from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime
from typing import Any, Optional, Protocol

try:
    from pymongo import ReturnDocument
except ModuleNotFoundError:
    class ReturnDocument:
        BEFORE = False
        AFTER = True


@dataclass
class AnalyticsLaunchPayload:
    device_id: str
    app_id: str
    app_version: str
    installed: bool
    timestamp: datetime


@dataclass
class AnalyticsStatsSnapshot:
    app_id: str
    total_launches: int
    unique_devices: int
    launches_today: int


class AnalyticsRepository(Protocol):
    async def ensure_indexes(self) -> None: ...

    async def upsert_device_launch(
        self,
        *,
        app_id: str,
        device_id: str,
        app_version: str,
        installed: bool,
        client_timestamp: datetime,
        received_at: datetime,
    ) -> bool: ...

    async def increment_app_stats(
        self,
        *,
        app_id: str,
        unique_device_increment: int,
        app_version: str,
        received_at: datetime,
    ) -> tuple[int, int]: ...

    async def increment_daily_launches(
        self,
        *,
        app_id: str,
        date_key: str,
        received_at: datetime,
    ) -> int: ...

    async def get_app_totals(self, *, app_id: str) -> tuple[int, int]: ...

    async def get_daily_launches(self, *, app_id: str, date_key: str) -> int: ...


class MongoAnalyticsRepository:
    def __init__(self, database: Any):
        self._db = database

    async def ensure_indexes(self) -> None:
        await self._db.analytics_devices.create_index(
            [("appId", 1), ("deviceId", 1)],
            unique=True,
            name="analytics_device_per_app",
        )
        await self._db.analytics_app_stats.create_index(
            [("appId", 1)],
            unique=True,
            name="analytics_app_stats_per_app",
        )
        await self._db.analytics_daily_stats.create_index(
            [("appId", 1), ("date", 1)],
            unique=True,
            name="analytics_daily_stats_per_app_date",
        )

    async def upsert_device_launch(
        self,
        *,
        app_id: str,
        device_id: str,
        app_version: str,
        installed: bool,
        client_timestamp: datetime,
        received_at: datetime,
    ) -> bool:
        existing = await self._db.analytics_devices.find_one_and_update(
            {"appId": app_id, "deviceId": device_id},
            {
                "$setOnInsert": {
                    "appId": app_id,
                    "deviceId": device_id,
                    "firstSeen": received_at,
                    "createdAt": received_at,
                },
                "$set": {
                    "appVersion": app_version,
                    "installed": installed,
                    "clientTimestamp": client_timestamp,
                    "lastSeen": received_at,
                    "updatedAt": received_at,
                },
                "$inc": {"launchCount": 1},
            },
            upsert=True,
            return_document=ReturnDocument.BEFORE,
        )
        return existing is None

    async def increment_app_stats(
        self,
        *,
        app_id: str,
        unique_device_increment: int,
        app_version: str,
        received_at: datetime,
    ) -> tuple[int, int]:
        stats_doc = await self._db.analytics_app_stats.find_one_and_update(
            {"appId": app_id},
            {
                "$setOnInsert": {
                    "appId": app_id,
                    "createdAt": received_at,
                },
                "$set": {
                    "updatedAt": received_at,
                    "lastLaunchAt": received_at,
                    "lastAppVersion": app_version,
                },
                "$inc": {
                    "totalLaunches": 1,
                    "uniqueDevices": unique_device_increment,
                },
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return stats_doc["totalLaunches"], stats_doc["uniqueDevices"]

    async def increment_daily_launches(
        self,
        *,
        app_id: str,
        date_key: str,
        received_at: datetime,
    ) -> int:
        daily_doc = await self._db.analytics_daily_stats.find_one_and_update(
            {"appId": app_id, "date": date_key},
            {
                "$setOnInsert": {
                    "appId": app_id,
                    "date": date_key,
                    "createdAt": received_at,
                },
                "$set": {
                    "updatedAt": received_at,
                },
                "$inc": {"launchCount": 1},
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return daily_doc["launchCount"]

    async def get_app_totals(self, *, app_id: str) -> tuple[int, int]:
        stats_doc = await self._db.analytics_app_stats.find_one({"appId": app_id})
        if not stats_doc:
            return 0, 0
        return stats_doc.get("totalLaunches", 0), stats_doc.get("uniqueDevices", 0)

    async def get_daily_launches(self, *, app_id: str, date_key: str) -> int:
        daily_doc = await self._db.analytics_daily_stats.find_one(
            {"appId": app_id, "date": date_key}
        )
        if not daily_doc:
            return 0
        return daily_doc.get("launchCount", 0)


def build_date_key(value: datetime) -> str:
    return value.strftime("%Y-%m-%d")


async def record_launch(
    repository: AnalyticsRepository,
    launch: AnalyticsLaunchPayload,
    *,
    received_at: Optional[datetime] = None,
) -> AnalyticsStatsSnapshot:
    now = received_at or datetime.utcnow()
    is_new_device = await repository.upsert_device_launch(
        app_id=launch.app_id,
        device_id=launch.device_id,
        app_version=launch.app_version,
        installed=launch.installed,
        client_timestamp=launch.timestamp,
        received_at=now,
    )
    total_launches, unique_devices = await repository.increment_app_stats(
        app_id=launch.app_id,
        unique_device_increment=1 if is_new_device else 0,
        app_version=launch.app_version,
        received_at=now,
    )
    launches_today = await repository.increment_daily_launches(
        app_id=launch.app_id,
        date_key=build_date_key(now),
        received_at=now,
    )
    return AnalyticsStatsSnapshot(
        app_id=launch.app_id,
        total_launches=total_launches,
        unique_devices=unique_devices,
        launches_today=launches_today,
    )


async def fetch_stats(
    repository: AnalyticsRepository,
    *,
    app_id: str,
    now: Optional[datetime] = None,
) -> AnalyticsStatsSnapshot:
    current_time = now or datetime.utcnow()
    total_launches, unique_devices = await repository.get_app_totals(app_id=app_id)
    launches_today = await repository.get_daily_launches(
        app_id=app_id,
        date_key=build_date_key(current_time),
    )
    return AnalyticsStatsSnapshot(
        app_id=app_id,
        total_launches=total_launches,
        unique_devices=unique_devices,
        launches_today=launches_today,
    )


def serialize_stats(snapshot: AnalyticsStatsSnapshot) -> dict[str, int | str]:
    return {
        "appId": snapshot.app_id,
        "totalLaunches": snapshot.total_launches,
        "uniqueDevices": snapshot.unique_devices,
        "launchesToday": snapshot.launches_today,
    }

import asyncio
from datetime import UTC, datetime

from backend.analytics import (
    AnalyticsLaunchPayload,
    AnalyticsLiveActivitySnapshot,
    SponsorAnalyticsSnapshot,
    build_date_key,
    fetch_stats,
    record_launch,
    serialize_live_activity,
)


class InMemoryAnalyticsRepository:
    def __init__(self):
        self.devices = {}
        self.app_totals = {}
        self.daily_totals = {}

    async def ensure_indexes(self) -> None:
        return None

    async def upsert_device_launch(
        self,
        *,
        app_id: str,
        device_id: str,
        app_version: str,
        installed: bool,
        client_timestamp: datetime,
        received_at: datetime,
    ) -> tuple[bool, bool]:
        key = (app_id, device_id)
        device = self.devices.get(key)
        if device is None:
            self.devices[key] = {
                "appVersion": app_version,
                "installed": installed,
                "clientTimestamp": client_timestamp,
                "firstSeen": received_at,
                "lastSeen": received_at,
                "launchCount": 1,
            }
            return True, installed

        device["appVersion"] = app_version
        was_installed = bool(device["installed"])
        device["installed"] = was_installed or installed
        device["clientTimestamp"] = client_timestamp
        device["lastSeen"] = received_at
        device["launchCount"] += 1
        return False, installed and not was_installed

    async def increment_app_stats(
        self,
        *,
        app_id: str,
        unique_device_increment: int,
        installed_device_increment: int,
        app_version: str,
        received_at: datetime,
    ) -> tuple[int, int, int]:
        stats = self.app_totals.setdefault(
            app_id,
            {
                "totalLaunches": 0,
                "uniqueDevices": 0,
                "installedDevices": 0,
                "lastAppVersion": app_version,
            },
        )
        stats["totalLaunches"] += 1
        stats["uniqueDevices"] += unique_device_increment
        stats["installedDevices"] += installed_device_increment
        stats["lastAppVersion"] = app_version
        return (
            stats["totalLaunches"],
            stats["uniqueDevices"],
            stats["installedDevices"],
        )

    async def increment_daily_launches(
        self,
        *,
        app_id: str,
        date_key: str,
        received_at: datetime,
    ) -> int:
        key = (app_id, date_key)
        self.daily_totals[key] = self.daily_totals.get(key, 0) + 1
        return self.daily_totals[key]

    async def get_app_totals(self, *, app_id: str) -> tuple[int, int, int]:
        stats = self.app_totals.get(app_id, {})
        return (
            stats.get("totalLaunches", 0),
            stats.get("uniqueDevices", 0),
            stats.get("installedDevices", 0),
        )

    async def get_daily_launches(self, *, app_id: str, date_key: str) -> int:
        return self.daily_totals.get((app_id, date_key), 0)

    async def fetch_event_overview(self, *, app_id: str, now: datetime):
        return {
            "totalSessions": 0,
            "returningVisitors": 0,
            "averageSessionDurationSeconds": 0,
            "mostVisitedPages": [],
            "mostUsedQuickActions": [],
            "mostViewedMaps": [],
            "mostViewedScheduleEvents": [],
            "mostClickedExternalLinks": [],
            "trafficByDay": [],
            "trafficByHour": [],
            "mapOpens": {},
            "liveActivity": None,
            "sponsors": SponsorAnalyticsSnapshot(),
        }


def test_repeated_launches_from_same_device_only_increment_unique_once():
    repository = InMemoryAnalyticsRepository()
    launch = AnalyticsLaunchPayload(
        device_id="device-a",
        app_id="walkerton-homecoming",
        app_version="1.0.0",
        installed=True,
        timestamp=datetime(2026, 7, 9, 10, 0, 0),
    )

    first_stats = asyncio.run(record_launch(repository, launch, received_at=datetime(2026, 7, 9, 10, 0, 0)))
    second_stats = asyncio.run(record_launch(repository, launch, received_at=datetime(2026, 7, 9, 11, 0, 0)))

    assert first_stats.total_launches == 1
    assert first_stats.unique_devices == 1
    assert first_stats.installed_devices == 1
    assert first_stats.browser_only_devices == 0
    assert second_stats.total_launches == 2
    assert second_stats.unique_devices == 1
    assert second_stats.installed_devices == 1
    assert second_stats.browser_only_devices == 0
    assert repository.devices[("walkerton-homecoming", "device-a")]["launchCount"] == 2


def test_different_devices_increase_unique_device_count():
    repository = InMemoryAnalyticsRepository()
    app_id = "walkerton-homecoming"

    first_launch = AnalyticsLaunchPayload(
        device_id="device-a",
        app_id=app_id,
        app_version="1.0.0",
        installed=False,
        timestamp=datetime(2026, 7, 9, 10, 0, 0),
    )
    second_launch = AnalyticsLaunchPayload(
        device_id="device-b",
        app_id=app_id,
        app_version="1.0.0",
        installed=True,
        timestamp=datetime(2026, 7, 9, 10, 5, 0),
    )

    asyncio.run(record_launch(repository, first_launch, received_at=datetime(2026, 7, 9, 10, 0, 0)))
    stats = asyncio.run(record_launch(repository, second_launch, received_at=datetime(2026, 7, 9, 10, 5, 0)))
    today = build_date_key(datetime(2026, 7, 9, 12, 0, 0))

    assert stats.total_launches == 2
    assert stats.unique_devices == 2
    assert stats.installed_devices == 1
    assert stats.browser_only_devices == 1
    assert repository.daily_totals[(app_id, today)] == 2


def test_stats_report_uses_app_id_scope():
    repository = InMemoryAnalyticsRepository()
    first_app_launch = AnalyticsLaunchPayload(
        device_id="device-a",
        app_id="walkerton-homecoming",
        app_version="1.0.0",
        installed=True,
        timestamp=datetime(2026, 7, 9, 10, 0, 0),
    )
    second_app_launch = AnalyticsLaunchPayload(
        device_id="device-a",
        app_id="another-jds-app",
        app_version="2.5.1",
        installed=True,
        timestamp=datetime(2026, 7, 9, 10, 10, 0),
    )

    asyncio.run(record_launch(repository, first_app_launch, received_at=datetime(2026, 7, 9, 10, 0, 0)))
    asyncio.run(record_launch(repository, second_app_launch, received_at=datetime(2026, 7, 9, 10, 10, 0)))

    stats = asyncio.run(
        fetch_stats(
            repository,
            app_id="walkerton-homecoming",
            now=datetime(2026, 7, 9, 12, 0, 0),
        )
    )

    assert stats.total_launches == 1
    assert stats.unique_devices == 1
    assert stats.launches_today == 1
    assert stats.installed_devices == 1
    assert stats.browser_only_devices == 0


def test_device_becomes_installed_once_and_stays_installed():
    repository = InMemoryAnalyticsRepository()
    app_id = "walkerton-homecoming"

    browser_launch = AnalyticsLaunchPayload(
        device_id="device-a",
        app_id=app_id,
        app_version="1.0.0",
        installed=False,
        timestamp=datetime(2026, 7, 9, 10, 0, 0),
    )
    installed_launch = AnalyticsLaunchPayload(
        device_id="device-a",
        app_id=app_id,
        app_version="1.0.1",
        installed=True,
        timestamp=datetime(2026, 7, 9, 11, 0, 0),
    )
    browser_again = AnalyticsLaunchPayload(
        device_id="device-a",
        app_id=app_id,
        app_version="1.0.2",
        installed=False,
        timestamp=datetime(2026, 7, 9, 12, 0, 0),
    )

    first_stats = asyncio.run(
        record_launch(repository, browser_launch, received_at=datetime(2026, 7, 9, 10, 0, 0))
    )
    second_stats = asyncio.run(
        record_launch(repository, installed_launch, received_at=datetime(2026, 7, 9, 11, 0, 0))
    )
    third_stats = asyncio.run(
        record_launch(repository, browser_again, received_at=datetime(2026, 7, 9, 12, 0, 0))
    )

    assert first_stats.installed_devices == 0
    assert first_stats.browser_only_devices == 1
    assert second_stats.installed_devices == 1
    assert second_stats.browser_only_devices == 0
    assert third_stats.installed_devices == 1
    assert third_stats.browser_only_devices == 0
    assert repository.devices[(app_id, "device-a")]["installed"] is True


def test_serialize_live_activity_marks_utc_timestamps_explicitly():
    snapshot = AnalyticsLiveActivitySnapshot(
        last_event_name="page_view",
        last_event_at=datetime(2026, 7, 31, 15, 45, 0),
    )

    payload = serialize_live_activity(snapshot)

    assert payload["lastEventAt"] == "2026-07-31T15:45:00+00:00"


def test_serialize_live_activity_preserves_existing_utc_timezone():
    snapshot = AnalyticsLiveActivitySnapshot(
        last_event_name="page_view",
        last_event_at=datetime(2026, 1, 15, 17, 0, 0, tzinfo=UTC),
    )

    payload = serialize_live_activity(snapshot)

    assert payload["lastEventAt"] == "2026-01-15T17:00:00+00:00"

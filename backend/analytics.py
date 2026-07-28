from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timedelta
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
class AnalyticsEventPayload:
    device_id: str
    session_id: str
    app_id: str
    app_version: str
    installed: bool
    launch_mode: str
    timestamp: datetime
    event_name: str
    properties: dict[str, str | int | float | bool | None] = field(default_factory=dict)


@dataclass
class AnalyticsMetric:
    label: str
    value: int
    type: Optional[str] = None


@dataclass
class AnalyticsLiveActivitySnapshot:
    last_event_name: Optional[str] = None
    last_event_at: Optional[datetime] = None
    last_page_viewed: Optional[str] = None
    last_map_opened: Optional[str] = None
    last_quick_action_opened: Optional[str] = None
    active_sessions: int = 0
    events_received_last_minute: int = 0
    events_received_last_five_minutes: int = 0


@dataclass
class SponsorAnalyticsSnapshot:
    total_page_views: int = 0
    unique_visitors: int = 0
    average_time_spent_seconds: Optional[float] = None
    most_viewed_sponsors: list[AnalyticsMetric] = field(default_factory=list)
    jds_website_clicks: int = 0


@dataclass
class AnalyticsStatsSnapshot:
    app_id: str
    total_launches: int
    unique_devices: int
    launches_today: int
    installed_devices: int
    browser_only_devices: int
    total_sessions: int = 0
    unique_visitors: int = 0
    returning_visitors: int = 0
    average_session_duration_seconds: float = 0
    most_visited_pages: list[AnalyticsMetric] = field(default_factory=list)
    most_used_quick_actions: list[AnalyticsMetric] = field(default_factory=list)
    most_viewed_maps: list[AnalyticsMetric] = field(default_factory=list)
    most_viewed_schedule_events: list[AnalyticsMetric] = field(default_factory=list)
    most_clicked_external_links: list[AnalyticsMetric] = field(default_factory=list)
    traffic_by_day: list[AnalyticsMetric] = field(default_factory=list)
    traffic_by_hour: list[AnalyticsMetric] = field(default_factory=list)
    map_opens: dict[str, int] = field(default_factory=dict)
    live_activity: AnalyticsLiveActivitySnapshot = field(
        default_factory=AnalyticsLiveActivitySnapshot
    )
    total_sponsor_page_views: int = 0
    unique_visitors_to_sponsors: int = 0
    average_time_spent_on_sponsors_page_seconds: Optional[float] = None
    most_viewed_sponsors: list[AnalyticsMetric] = field(default_factory=list)
    jds_website_clicks: int = 0


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
    ) -> tuple[bool, bool]: ...

    async def increment_app_stats(
        self,
        *,
        app_id: str,
        unique_device_increment: int,
        installed_device_increment: int,
        app_version: str,
        received_at: datetime,
    ) -> tuple[int, int, int]: ...

    async def increment_daily_launches(
        self,
        *,
        app_id: str,
        date_key: str,
        received_at: datetime,
    ) -> int: ...

    async def get_app_totals(self, *, app_id: str) -> tuple[int, int, int]: ...

    async def get_daily_launches(self, *, app_id: str, date_key: str) -> int: ...

    async def insert_event(
        self,
        *,
        app_id: str,
        device_id: str,
        session_id: str,
        app_version: str,
        installed: bool,
        launch_mode: str,
        event_name: str,
        properties: dict[str, str | int | float | bool | None],
        client_timestamp: datetime,
        received_at: datetime,
    ) -> None: ...

    async def fetch_event_overview(
        self,
        *,
        app_id: str,
        now: datetime,
    ) -> dict[str, Any]: ...


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
        await self._db.analytics_events.create_index(
            [("appId", 1), ("eventName", 1), ("receivedAt", -1)],
            name="analytics_events_app_event_received",
        )
        await self._db.analytics_events.create_index(
            [("appId", 1), ("sessionId", 1), ("receivedAt", -1)],
            name="analytics_events_app_session_received",
        )
        await self._db.analytics_events.create_index(
            [("appId", 1), ("deviceId", 1), ("receivedAt", -1)],
            name="analytics_events_app_device_received",
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
    ) -> tuple[bool, bool]:
        existing = await self._db.analytics_devices.find_one(
            {"appId": app_id, "deviceId": device_id}
        )
        was_installed = bool(existing and existing.get("installed"))
        installed_ever = was_installed or installed
        await self._db.analytics_devices.update_one(
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
                    "installed": installed_ever,
                    "clientTimestamp": client_timestamp,
                    "lastSeen": received_at,
                    "updatedAt": received_at,
                },
                "$inc": {"launchCount": 1},
            },
            upsert=True,
        )
        return existing is None, installed and not was_installed

    async def increment_app_stats(
        self,
        *,
        app_id: str,
        unique_device_increment: int,
        installed_device_increment: int,
        app_version: str,
        received_at: datetime,
    ) -> tuple[int, int, int]:
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
                    "installedDevices": installed_device_increment,
                },
            },
            upsert=True,
            return_document=ReturnDocument.AFTER,
        )
        return (
            stats_doc["totalLaunches"],
            stats_doc["uniqueDevices"],
            stats_doc.get("installedDevices", 0),
        )

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

    async def get_app_totals(self, *, app_id: str) -> tuple[int, int, int]:
        stats_doc = await self._db.analytics_app_stats.find_one({"appId": app_id})
        if not stats_doc:
            return 0, 0, 0
        return (
            stats_doc.get("totalLaunches", 0),
            stats_doc.get("uniqueDevices", 0),
            stats_doc.get("installedDevices", 0),
        )

    async def get_daily_launches(self, *, app_id: str, date_key: str) -> int:
        daily_doc = await self._db.analytics_daily_stats.find_one(
            {"appId": app_id, "date": date_key}
        )
        if not daily_doc:
            return 0
        return daily_doc.get("launchCount", 0)

    async def insert_event(
        self,
        *,
        app_id: str,
        device_id: str,
        session_id: str,
        app_version: str,
        installed: bool,
        launch_mode: str,
        event_name: str,
        properties: dict[str, str | int | float | bool | None],
        client_timestamp: datetime,
        received_at: datetime,
    ) -> None:
        await self._db.analytics_events.insert_one(
            {
                "appId": app_id,
                "deviceId": device_id,
                "sessionId": session_id,
                "appVersion": app_version,
                "installed": installed,
                "launchMode": launch_mode,
                "eventName": event_name,
                "properties": properties,
                "timestamp": client_timestamp,
                "receivedAt": received_at,
                "createdAt": received_at,
            }
        )

    async def fetch_event_overview(
        self,
        *,
        app_id: str,
        now: datetime,
    ) -> dict[str, Any]:
        one_minute_ago = now - timedelta(minutes=1)
        five_minutes_ago = now - timedelta(minutes=5)
        active_session_cutoff = now - timedelta(minutes=30)

        total_sessions = await self._count_documents(
            {"appId": app_id, "eventName": "session_started"}
        )
        returning_visitors = await self._db.analytics_devices.count_documents(
            {"appId": app_id, "launchCount": {"$gt": 1}}
        )
        average_session_duration_seconds = await self._get_average_value(
            {
                "appId": app_id,
                "eventName": "session_ended",
                "properties.durationSeconds": {"$type": "number"},
            },
            "$properties.durationSeconds",
        )

        most_visited_pages = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "page_view"},
            "$properties.page",
        )
        most_used_quick_actions = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "quick_action_opened"},
            "$properties.actionName",
        )
        most_viewed_maps = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "map_open"},
            {"$ifNull": ["$properties.mapName", "$properties.mapId"]},
        )
        most_viewed_schedule_events = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "schedule_event_viewed"},
            "$properties.eventTitle",
        )
        most_clicked_external_links = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "external_link_clicked"},
            "$properties.destinationName",
            type_expression="$properties.destinationType",
        )
        traffic_by_day = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "session_started"},
            {"$dateToString": {"format": "%Y-%m-%d", "date": "$timestamp"}},
            limit=31,
            ascending=True,
        )
        traffic_by_hour = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "session_started"},
            {"$dateToString": {"format": "%H:00", "date": "$timestamp"}},
            limit=24,
            ascending=True,
        )
        map_open_rows = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "map_open"},
            "$properties.mapId",
            limit=20,
        )
        map_opens = {
            metric.label: metric.value
            for metric in map_open_rows
            if metric.label
        }

        last_event = await self._get_latest_event({"appId": app_id})
        last_page_view = await self._get_latest_event(
            {"appId": app_id, "eventName": "page_view"}
        )
        last_map_open = await self._get_latest_event(
            {"appId": app_id, "eventName": "map_open"}
        )
        last_quick_action = await self._get_latest_event(
            {"appId": app_id, "eventName": "quick_action_opened"}
        )

        sponsor_page_views = await self._count_documents(
            {"appId": app_id, "eventName": "sponsors_page_viewed"}
        )
        unique_sponsor_visitors = await self._count_distinct_devices(
            {"appId": app_id, "eventName": "sponsors_page_viewed"}
        )
        most_viewed_sponsors = await self._get_ranked_metrics(
            {"appId": app_id, "eventName": "sponsor_selected"},
            "$properties.sponsorName",
        )
        jds_website_clicks = await self._count_documents(
            {
                "appId": app_id,
                "eventName": "external_link_clicked",
                "$or": [
                    {"properties.destinationType": "jds_website"},
                    {"properties.destinationUrl": {"$regex": r"^https?://(www\.)?jdsstudio\.ca", "$options": "i"}},
                ],
            }
        )

        overview = {
            "totalSessions": total_sessions,
            "returningVisitors": returning_visitors,
            "averageSessionDurationSeconds": average_session_duration_seconds,
            "mostVisitedPages": most_visited_pages,
            "mostUsedQuickActions": most_used_quick_actions,
            "mostViewedMaps": most_viewed_maps,
            "mostViewedScheduleEvents": most_viewed_schedule_events,
            "mostClickedExternalLinks": most_clicked_external_links,
            "trafficByDay": traffic_by_day,
            "trafficByHour": traffic_by_hour,
            "mapOpens": map_opens,
            "liveActivity": AnalyticsLiveActivitySnapshot(
                last_event_name=last_event.get("eventName") if last_event else None,
                last_event_at=last_event.get("receivedAt") if last_event else None,
                last_page_viewed=(last_page_view or {}).get("properties", {}).get("page"),
                last_map_opened=(last_map_open or {}).get("properties", {}).get("mapName"),
                last_quick_action_opened=(last_quick_action or {}).get("properties", {}).get("actionName"),
                active_sessions=await self._count_active_sessions(app_id, active_session_cutoff),
                events_received_last_minute=await self._count_documents(
                    {"appId": app_id, "receivedAt": {"$gte": one_minute_ago}}
                ),
                events_received_last_five_minutes=await self._count_documents(
                    {"appId": app_id, "receivedAt": {"$gte": five_minutes_ago}}
                ),
            ),
            "sponsors": SponsorAnalyticsSnapshot(
                total_page_views=sponsor_page_views,
                unique_visitors=unique_sponsor_visitors,
                average_time_spent_seconds=None,
                most_viewed_sponsors=most_viewed_sponsors,
                jds_website_clicks=jds_website_clicks,
            ),
        }

        return overview

    async def _count_documents(self, match: dict[str, Any]) -> int:
        return await self._db.analytics_events.count_documents(match)

    async def _count_distinct_devices(self, match: dict[str, Any]) -> int:
        pipeline = [
            {"$match": match},
            {"$group": {"_id": "$deviceId"}},
            {"$count": "value"},
        ]
        rows = await self._db.analytics_events.aggregate(pipeline).to_list(1)
        return int(rows[0]["value"]) if rows else 0

    async def _get_average_value(
        self,
        match: dict[str, Any],
        field_path: str,
    ) -> float:
        pipeline = [
            {"$match": match},
            {"$group": {"_id": None, "value": {"$avg": field_path}}},
        ]
        rows = await self._db.analytics_events.aggregate(pipeline).to_list(1)
        if not rows or rows[0].get("value") is None:
            return 0
        return float(rows[0]["value"])

    async def _get_ranked_metrics(
        self,
        match: dict[str, Any],
        label_expression: Any,
        *,
        limit: int = 10,
        type_expression: Any = None,
        ascending: bool = False,
    ) -> list[AnalyticsMetric]:
        group_id: dict[str, Any] = {"label": label_expression}
        if type_expression is not None:
            group_id["type"] = type_expression

        sort_stage = {"_id.label": 1} if ascending else {"value": -1, "_id.label": 1}
        if ascending:
            sort_stage = {"_id.label": 1}

        pipeline = [
            {"$match": match},
            {"$group": {"_id": group_id, "value": {"$sum": 1}}},
            {"$match": {"_id.label": {"$nin": [None, ""]}}},
            {"$sort": sort_stage},
            {"$limit": limit},
        ]
        rows = await self._db.analytics_events.aggregate(pipeline).to_list(limit)
        return [
            AnalyticsMetric(
                label=row["_id"]["label"],
                value=int(row["value"]),
                type=row["_id"].get("type"),
            )
            for row in rows
        ]

    async def _get_latest_event(self, match: dict[str, Any]) -> Optional[dict[str, Any]]:
        return await self._db.analytics_events.find_one(match, sort=[("receivedAt", -1)])

    async def _count_active_sessions(self, app_id: str, cutoff: datetime) -> int:
        pipeline = [
            {"$match": {"appId": app_id, "receivedAt": {"$gte": cutoff}}},
            {"$sort": {"sessionId": 1, "receivedAt": -1}},
            {
                "$group": {
                    "_id": "$sessionId",
                    "lastEventName": {"$first": "$eventName"},
                    "lastReceivedAt": {"$first": "$receivedAt"},
                }
            },
            {
                "$match": {
                    "lastEventName": {"$ne": "session_ended"},
                    "lastReceivedAt": {"$gte": cutoff},
                }
            },
            {"$count": "value"},
        ]
        rows = await self._db.analytics_events.aggregate(pipeline).to_list(1)
        return int(rows[0]["value"]) if rows else 0


def build_date_key(value: datetime) -> str:
    return value.strftime("%Y-%m-%d")


async def record_launch(
    repository: AnalyticsRepository,
    launch: AnalyticsLaunchPayload,
    *,
    received_at: Optional[datetime] = None,
) -> AnalyticsStatsSnapshot:
    now = received_at or datetime.utcnow()
    is_new_device, newly_installed_device = await repository.upsert_device_launch(
        app_id=launch.app_id,
        device_id=launch.device_id,
        app_version=launch.app_version,
        installed=launch.installed,
        client_timestamp=launch.timestamp,
        received_at=now,
    )
    total_launches, unique_devices, installed_devices = await repository.increment_app_stats(
        app_id=launch.app_id,
        unique_device_increment=1 if is_new_device else 0,
        installed_device_increment=1 if newly_installed_device else 0,
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
        installed_devices=installed_devices,
        browser_only_devices=max(unique_devices - installed_devices, 0),
    )


async def record_event(
    repository: AnalyticsRepository,
    event: AnalyticsEventPayload,
    *,
    received_at: Optional[datetime] = None,
) -> None:
    now = received_at or datetime.utcnow()
    await repository.insert_event(
        app_id=event.app_id,
        device_id=event.device_id,
        session_id=event.session_id,
        app_version=event.app_version,
        installed=event.installed,
        launch_mode=event.launch_mode,
        event_name=event.event_name,
        properties=event.properties,
        client_timestamp=event.timestamp,
        received_at=now,
    )


async def record_map_open(
    repository: AnalyticsRepository,
    event: AnalyticsEventPayload,
    *,
    received_at: Optional[datetime] = None,
) -> None:
    await record_event(repository, event, received_at=received_at)


async def fetch_stats(
    repository: AnalyticsRepository,
    *,
    app_id: str,
    now: Optional[datetime] = None,
) -> AnalyticsStatsSnapshot:
    current_time = now or datetime.utcnow()
    total_launches, unique_devices, installed_devices = await repository.get_app_totals(
        app_id=app_id
    )
    launches_today = await repository.get_daily_launches(
        app_id=app_id,
        date_key=build_date_key(current_time),
    )
    event_overview = await repository.fetch_event_overview(app_id=app_id, now=current_time)
    sponsors: SponsorAnalyticsSnapshot = event_overview["sponsors"]
    return AnalyticsStatsSnapshot(
        app_id=app_id,
        total_launches=total_launches,
        unique_devices=unique_devices,
        launches_today=launches_today,
        installed_devices=installed_devices,
        browser_only_devices=max(unique_devices - installed_devices, 0),
        total_sessions=event_overview["totalSessions"],
        unique_visitors=unique_devices,
        returning_visitors=event_overview["returningVisitors"],
        average_session_duration_seconds=event_overview["averageSessionDurationSeconds"],
        most_visited_pages=event_overview["mostVisitedPages"],
        most_used_quick_actions=event_overview["mostUsedQuickActions"],
        most_viewed_maps=event_overview["mostViewedMaps"],
        most_viewed_schedule_events=event_overview["mostViewedScheduleEvents"],
        most_clicked_external_links=event_overview["mostClickedExternalLinks"],
        traffic_by_day=event_overview["trafficByDay"],
        traffic_by_hour=event_overview["trafficByHour"],
        map_opens=event_overview["mapOpens"],
        live_activity=event_overview["liveActivity"],
        total_sponsor_page_views=sponsors.total_page_views,
        unique_visitors_to_sponsors=sponsors.unique_visitors,
        average_time_spent_on_sponsors_page_seconds=sponsors.average_time_spent_seconds,
        most_viewed_sponsors=sponsors.most_viewed_sponsors,
        jds_website_clicks=sponsors.jds_website_clicks,
    )


def serialize_metric(metric: AnalyticsMetric) -> dict[str, int | str]:
    payload: dict[str, int | str] = {
        "label": metric.label,
        "value": metric.value,
    }
    if metric.type:
        payload["type"] = metric.type
    return payload


def serialize_live_activity(
    snapshot: AnalyticsLiveActivitySnapshot,
) -> dict[str, int | str | None]:
    return {
        "lastEventName": snapshot.last_event_name,
        "lastEventAt": snapshot.last_event_at.isoformat() if snapshot.last_event_at else None,
        "lastPageViewed": snapshot.last_page_viewed,
        "lastMapOpened": snapshot.last_map_opened,
        "lastQuickActionOpened": snapshot.last_quick_action_opened,
        "activeSessions": snapshot.active_sessions,
        "eventsReceivedLastMinute": snapshot.events_received_last_minute,
        "eventsReceivedLastFiveMinutes": snapshot.events_received_last_five_minutes,
    }


def serialize_stats(snapshot: AnalyticsStatsSnapshot) -> dict[str, Any]:
    return {
        "appId": snapshot.app_id,
        "totalLaunches": snapshot.total_launches,
        "uniqueDevices": snapshot.unique_devices,
        "launchesToday": snapshot.launches_today,
        "installedDevices": snapshot.installed_devices,
        "browserOnlyDevices": snapshot.browser_only_devices,
        "totalSessions": snapshot.total_sessions,
        "uniqueVisitors": snapshot.unique_visitors,
        "returningVisitors": snapshot.returning_visitors,
        "averageSessionDurationSeconds": snapshot.average_session_duration_seconds,
        "mostVisitedPages": [serialize_metric(metric) for metric in snapshot.most_visited_pages],
        "mostUsedQuickActions": [serialize_metric(metric) for metric in snapshot.most_used_quick_actions],
        "mostViewedMaps": [serialize_metric(metric) for metric in snapshot.most_viewed_maps],
        "mostViewedScheduleEvents": [
            serialize_metric(metric) for metric in snapshot.most_viewed_schedule_events
        ],
        "mostClickedExternalLinks": [
            serialize_metric(metric) for metric in snapshot.most_clicked_external_links
        ],
        "trafficByDay": [serialize_metric(metric) for metric in snapshot.traffic_by_day],
        "trafficByHour": [serialize_metric(metric) for metric in snapshot.traffic_by_hour],
        "mapOpens": snapshot.map_opens,
        "liveActivity": serialize_live_activity(snapshot.live_activity),
        "totalSponsorPageViews": snapshot.total_sponsor_page_views,
        "uniqueVisitorsToSponsors": snapshot.unique_visitors_to_sponsors,
        "averageTimeSpentOnSponsorsPageSeconds": (
            snapshot.average_time_spent_on_sponsors_page_seconds
        ),
        "mostViewedSponsors": [
            serialize_metric(metric) for metric in snapshot.most_viewed_sponsors
        ],
        "jdsWebsiteClicks": snapshot.jds_website_clicks,
    }

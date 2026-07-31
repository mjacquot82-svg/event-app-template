import asyncio
from datetime import UTC, datetime
from zoneinfo import ZoneInfo

from backend.analytics import (
    AnalyticsLaunchPayload,
    AnalyticsLiveActivitySnapshot,
    ANALYTICS_HOURLY_LABELS,
    ANALYTICS_DISPLAY_TIMEZONE,
    MongoAnalyticsRepository,
    SponsorAnalyticsSnapshot,
    build_zero_filled_hourly_metrics,
    build_date_key,
    fetch_stats,
    get_analytics_day_bounds,
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
            "todayTrafficByHour": [],
            "trafficByHour": [],
            "mapOpens": {},
            "liveActivity": None,
            "sponsors": SponsorAnalyticsSnapshot(),
        }


class FakeAggregateCursor:
    def __init__(self, rows):
        self.rows = rows

    async def to_list(self, limit: int):
        return self.rows[:limit]


class FakeEventsCollection:
    def __init__(self, docs):
        self.docs = docs

    def aggregate(self, pipeline):
        match_stage = pipeline[0]["$match"]
        group_stage = pipeline[1]["$group"]
        time_zone = group_stage["_id"]["$dateToString"]["timezone"]
        display_zone = ZoneInfo(time_zone)
        start = match_stage["timestamp"]["$gte"]
        end = match_stage["timestamp"]["$lt"]
        counts: dict[str, int] = {}

        for doc in self.docs:
            if doc["appId"] != match_stage["appId"]:
                continue
            if doc["eventName"] != match_stage["eventName"]:
                continue
            if not (start <= doc["timestamp"] < end):
                continue

            label = doc["timestamp"].astimezone(display_zone).strftime("%H:00")
            counts[label] = counts.get(label, 0) + 1

        rows = [{"_id": label, "value": value} for label, value in sorted(counts.items())]
        return FakeAggregateCursor(rows)


class FakeEventsDatabase:
    def __init__(self, docs):
        self.analytics_events = FakeEventsCollection(docs)


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


def test_build_zero_filled_hourly_metrics_returns_all_24_hours():
    metrics = build_zero_filled_hourly_metrics({"08:00": 3, "20:00": 1})

    assert [metric.label for metric in metrics] == list(ANALYTICS_HOURLY_LABELS)
    assert metrics[8].value == 3
    assert metrics[20].value == 1
    assert metrics[0].value == 0
    assert metrics[23].value == 0


def test_get_analytics_day_bounds_follow_dst_transition_lengths():
    spring_forward_start, spring_forward_end = get_analytics_day_bounds(
        datetime(2026, 3, 8, 12, 0, 0, tzinfo=UTC)
    )
    fall_back_start, fall_back_end = get_analytics_day_bounds(
        datetime(2026, 11, 1, 12, 0, 0, tzinfo=UTC)
    )

    assert spring_forward_start == datetime(2026, 3, 8, 5, 0, 0, tzinfo=UTC)
    assert spring_forward_end == datetime(2026, 3, 9, 4, 0, 0, tzinfo=UTC)
    assert (spring_forward_end - spring_forward_start).total_seconds() == 23 * 60 * 60

    assert fall_back_start == datetime(2026, 11, 1, 4, 0, 0, tzinfo=UTC)
    assert fall_back_end == datetime(2026, 11, 2, 5, 0, 0, tzinfo=UTC)
    assert (fall_back_end - fall_back_start).total_seconds() == 25 * 60 * 60


def test_today_hourly_aggregation_uses_america_toronto_day_boundaries():
    repository = MongoAnalyticsRepository(
        FakeEventsDatabase(
            [
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 7, 31, 3, 30, 0, tzinfo=UTC),
                },
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 7, 31, 13, 15, 0, tzinfo=UTC),
                },
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 8, 1, 1, 5, 0, tzinfo=UTC),
                },
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 8, 1, 4, 5, 0, tzinfo=UTC),
                },
                {
                    "appId": "another-app",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 7, 31, 13, 15, 0, tzinfo=UTC),
                },
            ]
        )
    )

    metrics = asyncio.run(
        repository._get_today_hourly_metrics(
            app_id="walkerton-homecoming",
            now=datetime(2026, 7, 31, 16, 0, 0, tzinfo=UTC),
        )
    )
    values_by_label = {metric.label: metric.value for metric in metrics}

    assert len(metrics) == 24
    assert values_by_label["09:00"] == 1
    assert values_by_label["21:00"] == 1
    assert values_by_label["23:00"] == 0


def test_today_hourly_aggregation_combines_repeated_dst_hour_in_toronto():
    repository = MongoAnalyticsRepository(
        FakeEventsDatabase(
            [
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 11, 1, 5, 30, 0, tzinfo=UTC),
                },
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 11, 1, 6, 30, 0, tzinfo=UTC),
                },
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 11, 1, 7, 30, 0, tzinfo=UTC),
                },
            ]
        )
    )

    metrics = asyncio.run(
        repository._get_today_hourly_metrics(
            app_id="walkerton-homecoming",
            now=datetime(2026, 11, 1, 18, 0, 0, tzinfo=UTC),
        )
    )
    values_by_label = {metric.label: metric.value for metric in metrics}

    assert ANALYTICS_DISPLAY_TIMEZONE == "America/Toronto"
    assert values_by_label["01:00"] == 2
    assert values_by_label["02:00"] == 1


def test_today_hourly_aggregation_keeps_future_hours_empty():
    repository = MongoAnalyticsRepository(
        FakeEventsDatabase(
            [
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 7, 31, 16, 15, 0, tzinfo=UTC),
                },
                {
                    "appId": "walkerton-homecoming",
                    "eventName": "session_started",
                    "timestamp": datetime(2026, 7, 31, 23, 10, 0, tzinfo=UTC),
                },
            ]
        )
    )

    metrics = asyncio.run(
        repository._get_today_hourly_metrics(
            app_id="walkerton-homecoming",
            now=datetime(2026, 8, 1, 0, 5, 0, tzinfo=UTC),
        )
    )
    values_by_label = {metric.label: metric.value for metric in metrics}

    assert values_by_label["12:00"] == 1
    assert values_by_label["19:00"] == 1
    assert values_by_label["21:00"] == 0
    assert values_by_label["22:00"] == 0
    assert values_by_label["23:00"] == 0

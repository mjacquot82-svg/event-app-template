import { type Href, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform } from 'react-native';
import type { EventMapDefinition, MapAnalyticsKey } from '../data/maps';

type UseRouteBackedMapViewerOptions = {
  maps: EventMapDefinition[];
  onMapOpen?: (map: EventMapDefinition) => void | Promise<void>;
};

function getMapParamValue(mapParam: string | string[] | undefined): string | null {
  if (Array.isArray(mapParam)) {
    return mapParam[0] ?? null;
  }

  return mapParam ?? null;
}

function buildViewerHref(pathname: string, mapId?: MapAnalyticsKey | null): Href {
  if (!mapId) {
    return pathname as Href;
  }

  const separator = pathname.includes('?') ? '&' : '?';
  return `${pathname}${separator}map=${encodeURIComponent(mapId)}` as Href;
}

export function useRouteBackedMapViewer({
  maps,
  onMapOpen,
}: UseRouteBackedMapViewerOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useLocalSearchParams<{ map?: string | string[] }>();
  const openedFromHereRef = useRef(false);
  const [nativeSelectedMapId, setNativeSelectedMapId] = useState<MapAnalyticsKey | null>(null);
  const mapParam = getMapParamValue(params.map);
  const isWeb = Platform.OS === 'web';
  const matchedRouteMapId = useMemo(
    () => maps.find((map) => map.id === mapParam)?.id ?? null,
    [mapParam, maps]
  );
  const ignoredRouteMapIdRef = useRef<MapAnalyticsKey | null>(null);
  const [webSelectedMapId, setWebSelectedMapId] = useState<MapAnalyticsKey | null>(() =>
    isWeb ? matchedRouteMapId : null
  );

  const selectedMapId = useMemo(() => {
    return isWeb ? webSelectedMapId : nativeSelectedMapId;
  }, [isWeb, nativeSelectedMapId, webSelectedMapId]);

  const selectedMap = useMemo(
    () => maps.find((map) => map.id === selectedMapId) ?? null,
    [maps, selectedMapId]
  );

  useEffect(() => {
    if (!isWeb) {
      return;
    }

    if (!matchedRouteMapId) {
      ignoredRouteMapIdRef.current = null;
      setWebSelectedMapId(null);
      return;
    }

    if (ignoredRouteMapIdRef.current === matchedRouteMapId) {
      return;
    }

    ignoredRouteMapIdRef.current = null;
    setWebSelectedMapId((current) => (current === matchedRouteMapId ? current : matchedRouteMapId));
  }, [isWeb, matchedRouteMapId]);

  useEffect(() => {
    if (!selectedMapId) {
      openedFromHereRef.current = false;
    }
  }, [selectedMapId]);

  const openMap = (map: EventMapDefinition) => {
    if (selectedMapId === map.id) {
      return;
    }

    if (isWeb) {
      ignoredRouteMapIdRef.current = null;
      setWebSelectedMapId(map.id);

      if (selectedMapId) {
        router.replace(buildViewerHref(pathname, map.id));
      } else {
        openedFromHereRef.current = true;
        router.push(buildViewerHref(pathname, map.id));
      }
    } else {
      setNativeSelectedMapId(map.id);
    }

    void onMapOpen?.(map);
  };

  const closeMap = () => {
    if (!selectedMapId) {
      return;
    }

    if (!isWeb) {
      setNativeSelectedMapId(null);
      return;
    }

    if (openedFromHereRef.current) {
      openedFromHereRef.current = false;
      ignoredRouteMapIdRef.current = matchedRouteMapId === selectedMapId ? selectedMapId : null;
      setWebSelectedMapId(null);

      try {
        router.back();
        return;
      } catch {
        router.replace(buildViewerHref(pathname, null));
        return;
      }
    }

    openedFromHereRef.current = false;
    ignoredRouteMapIdRef.current = matchedRouteMapId === selectedMapId ? selectedMapId : null;
    setWebSelectedMapId(null);
    router.replace(buildViewerHref(pathname, null));
  };

  return {
    selectedMap,
    selectedMapId,
    openMap,
    closeMap,
  };
}

export default useRouteBackedMapViewer;

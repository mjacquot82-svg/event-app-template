import { type Href, useLocalSearchParams, usePathname, useRouter } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
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
  const mapParam = getMapParamValue(params.map);

  const selectedMapId = useMemo(() => {
    const matchedMap = maps.find((map) => map.id === mapParam);
    return matchedMap?.id ?? null;
  }, [mapParam, maps]);

  const selectedMap = useMemo(
    () => maps.find((map) => map.id === selectedMapId) ?? null,
    [maps, selectedMapId]
  );

  useEffect(() => {
    if (!selectedMapId) {
      openedFromHereRef.current = false;
    }
  }, [selectedMapId]);

  const openMap = (map: EventMapDefinition) => {
    if (selectedMapId === map.id) {
      return;
    }

    if (selectedMapId) {
      router.replace(buildViewerHref(pathname, map.id));
    } else {
      openedFromHereRef.current = true;
      router.push(buildViewerHref(pathname, map.id));
    }

    void onMapOpen?.(map);
  };

  const closeMap = () => {
    if (!selectedMapId) {
      return;
    }

    if (openedFromHereRef.current && router.canGoBack()) {
      openedFromHereRef.current = false;
      router.back();
      return;
    }

    openedFromHereRef.current = false;
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

// © 2026 1001538341 ONTARIO INC.
// Web-only celebration overlay powered by fireworks-js (MIT).

import React, { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Fireworks } from 'fireworks-js';

type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

const VIEWPORT_MARGIN = 32;
const OPENING_DELAY_MS = 1000;
const OPENING_DURATION_MIN_MS = 7000;
const OPENING_DURATION_MAX_MS = 9000;
const BURST_STAGGER_MIN_MS = 110;
const BURST_STAGGER_MAX_MS = 240;
const NEARLY_SIMULTANEOUS_MIN_MS = 70;
const NEARLY_SIMULTANEOUS_MAX_MS = 140;
const RAPID_TRIPLE_GAP_MIN_MS = 150;
const RAPID_TRIPLE_GAP_MAX_MS = 220;
const OPENING_COUNT_MIN = 18;
const OPENING_COUNT_MAX = 28;
const SIDE_OFFSET_MIN = 52;
const SIDE_OFFSET_MAX = 196;
const CORNER_OFFSET_MIN = 42;
const CORNER_OFFSET_MAX = 176;
const DRIFT_JITTER = 132;

type ShellSize = 'small' | 'medium' | 'large';

type ColorPreset = {
  hue: number;
  weight: number;
};

type FireworksRuntime = Fireworks & {
  sound?: {
    play: () => void;
  };
};

function randomInRange(min: number, max: number) {
  return min + Math.random() * (max - min);
}

const COLOR_PRESETS: ColorPreset[] = [
  { hue: 195, weight: 4.4 },
  { hue: 206, weight: 3.8 },
  { hue: 322, weight: 3.8 },
  { hue: 334, weight: 3.2 },
  { hue: 132, weight: 3.8 },
  { hue: 146, weight: 3.1 },
  { hue: 45, weight: 1.2 },
  { hue: 272, weight: 1.1 },
];

const SHELL_OPTIONS: Record<ShellSize, { explosion: number; particles: number; lineWidth: { min: number; max: number } }> = {
  small: {
    explosion: 4,
    particles: 42,
    lineWidth: { min: 1, max: 2.1 },
  },
  medium: {
    explosion: 5,
    particles: 58,
    lineWidth: { min: 1.2, max: 2.6 },
  },
  large: {
    explosion: 6,
    particles: 76,
    lineWidth: { min: 1.4, max: 3 },
  },
};

export default function CelebrationPanel() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const pillRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<FireworksRuntime | null>(null);
  const timerRefs = useRef<number[]>([]);
  const [pillRect, setPillRect] = useState<Rect | null>(null);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const pillShellResponsiveStyle: React.CSSProperties =
    viewport.width >= 1024
      ? { width: '62%' }
      : viewport.width >= 768
        ? { width: '78%' }
        : { width: '96%' };

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updatePreference = () => setReducedMotion(mediaQuery.matches);
    updatePreference();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updatePreference);
      return () => mediaQuery.removeEventListener('change', updatePreference);
    }

    mediaQuery.addListener(updatePreference);
    return () => mediaQuery.removeListener(updatePreference);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const updateVisibility = () => setPageVisible(document.visibilityState !== 'hidden');
    updateVisibility();
    document.addEventListener('visibilitychange', updateVisibility);
    return () => document.removeEventListener('visibilitychange', updateVisibility);
  }, []);

  useEffect(() => {
    const measure = () => {
      const pill = pillRef.current;
      if (!pill || typeof window === 'undefined') {
        return;
      }

      const rect = pill.getBoundingClientRect();

      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
      setPillRect({
        x: rect.left,
        y: rect.top,
        width: rect.width,
        height: rect.height,
      });
    };

    measure();

    if (typeof ResizeObserver !== 'undefined') {
      const observer = new ResizeObserver(measure);
      if (pillRef.current) observer.observe(pillRef.current);
      window.addEventListener('resize', measure);
      window.addEventListener('scroll', measure, true);
      return () => {
        observer.disconnect();
        window.removeEventListener('resize', measure);
        window.removeEventListener('scroll', measure, true);
      };
    }

    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, []);

  useEffect(() => {
    const clearTimers = () => {
      timerRefs.current.forEach((id) => window.clearTimeout(id));
      timerRefs.current = [];
    };

    const destroyFireworks = () => {
      const fireworks = fireworksRef.current;
      if (fireworks) {
        fireworks.stop(true);
        fireworksRef.current = null;
      }
    };

    if (!pillRect || viewport.width <= 0 || viewport.height <= 0 || reducedMotion || !pageVisible || !overlayRef.current) {
      clearTimers();
      destroyFireworks();
      return;
    }

    const overlay = overlayRef.current;
    overlay.style.width = `${viewport.width}px`;
    overlay.style.height = `${viewport.height}px`;

    const fireworks = new Fireworks(overlay, {
      autoresize: false,
      intensity: 0,
      rocketsPoint: { min: 50, max: 50 },
      boundaries: {
        x: VIEWPORT_MARGIN,
        y: VIEWPORT_MARGIN,
        width: viewport.width,
        height: viewport.height,
        debug: false,
      },
      mouse: {
        click: false,
        move: true,
        max: 1,
      },
      delay: {
        min: 999_999,
        max: 999_999,
      },
      traceLength: 1,
      traceSpeed: 28,
      acceleration: 1.18,
      lineWidth: {
        explosion: { min: 1, max: 3 },
        trace: { min: 0.01, max: 0.1 },
      },
    }) as FireworksRuntime;
    fireworksRef.current = fireworks;

    const canvas = overlay.querySelector('canvas');
    if (canvas instanceof HTMLCanvasElement) {
      canvas.style.position = 'absolute';
      canvas.style.inset = '0';
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      canvas.style.pointerEvents = 'none';
      canvas.style.zIndex = '3';
    }

    fireworks.start();

    const aimAt = (targetX: number, targetY: number) => {
      if (!(canvas instanceof HTMLCanvasElement) || typeof window === 'undefined') {
        return;
      }

      canvas.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true,
        clientX: targetX - window.scrollX,
        clientY: targetY - window.scrollY,
        pointerId: 1,
        pointerType: 'mouse',
      }));
    };

    const scheduleTimer = (delayMs: number, callback: () => void) => {
      const timerId = window.setTimeout(() => {
        timerRefs.current = timerRefs.current.filter((id) => id !== timerId);
        callback();
      }, delayMs);
      timerRefs.current.push(timerId);
    };

    const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
    const pillLeft = pillRect.x;
    const pillRight = pillRect.x + pillRect.width;
    const pillTop = pillRect.y;
    const pillBottom = pillRect.y + pillRect.height;
    const pillCenterX = pillLeft + pillRect.width / 2;
    const pillCenterY = pillTop + pillRect.height / 2;

    const isOutsidePill = (x: number, y: number) => x < pillLeft || x > pillRight || y < pillTop || y > pillBottom;

    const moveOutsidePill = (x: number, y: number) => {
      if (isOutsidePill(x, y)) {
        return {
          x: clamp(x, VIEWPORT_MARGIN, viewport.width - VIEWPORT_MARGIN),
          y: clamp(y, VIEWPORT_MARGIN, viewport.height - VIEWPORT_MARGIN),
        };
      }

      const horizontalDirection = x < pillCenterX ? -1 : 1;
      const verticalDirection = y < pillCenterY ? -1 : 1;
      const horizontalDistance = Math.min(Math.abs(x - pillLeft), Math.abs(x - pillRight));
      const verticalDistance = Math.min(Math.abs(y - pillTop), Math.abs(y - pillBottom));

      if (horizontalDistance < verticalDistance) {
        return {
          x: horizontalDirection < 0 ? pillLeft - SIDE_OFFSET_MIN : pillRight + SIDE_OFFSET_MIN,
          y: clamp(y, VIEWPORT_MARGIN, viewport.height - VIEWPORT_MARGIN),
        };
      }

      return {
        x: clamp(x, VIEWPORT_MARGIN, viewport.width - VIEWPORT_MARGIN),
        y: verticalDirection < 0 ? pillTop - SIDE_OFFSET_MIN : pillBottom + SIDE_OFFSET_MIN,
      };
    };

    const pickHue = () => {
      const totalWeight = COLOR_PRESETS.reduce((sum, preset) => sum + preset.weight, 0);
      let remaining = randomInRange(0, totalWeight);

      for (const preset of COLOR_PRESETS) {
        remaining -= preset.weight;
        if (remaining <= 0) {
          return Math.round(randomInRange(preset.hue - 8, preset.hue + 8));
        }
      }

      return 195;
    };

    const pickShellSize = (): ShellSize => {
      const roll = Math.random();

      if (roll < 0.42) {
        return 'small';
      }

      if (roll < 0.8) {
        return 'medium';
      }

      return 'large';
    };

    const sampleFramePosition = () => {
      const zone = Math.floor(Math.random() * 12);
      const nearBias = Math.random() < 0.58;
      const sideOffset = nearBias
        ? randomInRange(SIDE_OFFSET_MIN, SIDE_OFFSET_MAX * 0.58)
        : randomInRange(SIDE_OFFSET_MIN * 1.1, SIDE_OFFSET_MAX);
      const cornerOffset = nearBias
        ? randomInRange(CORNER_OFFSET_MIN, CORNER_OFFSET_MAX * 0.62)
        : randomInRange(CORNER_OFFSET_MIN * 1.1, CORNER_OFFSET_MAX);

      switch (zone) {
        case 0:
        case 1:
          return {
            x: randomInRange(pillLeft - SIDE_OFFSET_MAX * 0.35, pillRight + SIDE_OFFSET_MAX * 0.2),
            y: pillTop - sideOffset,
          };
        case 2:
          return {
            x: randomInRange(pillLeft - SIDE_OFFSET_MAX * 0.2, pillRight + SIDE_OFFSET_MAX * 0.35),
            y: pillBottom + sideOffset,
          };
        case 3:
        case 4:
          return {
            x: pillLeft - sideOffset,
            y: randomInRange(pillTop - SIDE_OFFSET_MAX * 0.24, pillBottom + SIDE_OFFSET_MAX * 0.18),
          };
        case 5:
          return {
            x: pillRight + sideOffset,
            y: randomInRange(pillTop - SIDE_OFFSET_MAX * 0.18, pillBottom + SIDE_OFFSET_MAX * 0.26),
          };
        case 6:
          return {
            x: pillLeft - cornerOffset,
            y: pillTop - cornerOffset,
          };
        case 7:
          return {
            x: pillRight + cornerOffset,
            y: pillTop - cornerOffset,
          };
        case 8:
          return {
            x: pillLeft - cornerOffset,
            y: pillBottom + cornerOffset,
          };
        case 9:
          return {
            x: pillRight + cornerOffset,
            y: pillBottom + cornerOffset,
          };
        case 10:
          return {
            x: randomInRange(pillLeft - SIDE_OFFSET_MAX * 0.12, pillRight + SIDE_OFFSET_MAX * 0.12),
            y: Math.random() < 0.5 ? pillTop - sideOffset * 0.82 : pillBottom + sideOffset * 0.82,
          };
        default:
          return {
            x: Math.random() < 0.5 ? pillLeft - sideOffset * 0.88 : pillRight + sideOffset * 0.88,
            y: randomInRange(pillTop - SIDE_OFFSET_MAX * 0.12, pillBottom + SIDE_OFFSET_MAX * 0.12),
          };
      }
    };

    const explodeAt = (targetX: number, targetY: number, shellSize: ShellSize) => {
      const point = moveOutsidePill(targetX, targetY);
      const shell = SHELL_OPTIONS[shellSize];
      const hue = pickHue();

      fireworks.updateOptions({
        explosion: shell.explosion,
        particles: shell.particles,
        hue: {
          min: hue,
          max: hue,
        },
        lineWidth: {
          explosion: shell.lineWidth,
          trace: { min: 0.01, max: 0.1 },
        },
      });
      aimAt(point.x, point.y);
      fireworks.launch(1);
      fireworks.sound?.play();
    };

    const sampleSequence = (count: number) => {
      const bursts: { x: number; y: number; shellSize: ShellSize }[] = [];
      const anchorCount = Math.random() < 0.45 ? 1 : Math.random() < 0.78 ? 2 : 3;
      const anchors = Array.from({ length: anchorCount }, () => {
        const point = sampleFramePosition();
        return moveOutsidePill(point.x, point.y);
      });

      while (bursts.length < count) {
        const anchor = anchors[Math.floor(Math.random() * anchors.length)];
        const shouldDrift = Math.random() < 0.7;
        const candidate = shouldDrift
          ? moveOutsidePill(
              anchor.x + randomInRange(-DRIFT_JITTER, DRIFT_JITTER),
              anchor.y + randomInRange(-DRIFT_JITTER, DRIFT_JITTER),
            )
          : moveOutsidePill(sampleFramePosition().x, sampleFramePosition().y);

        bursts.push({
          x: candidate.x,
          y: candidate.y,
          shellSize: pickShellSize(),
        });
      }

      return bursts;
    };

    const scheduleSequence = (delayMs = 0) => {
      scheduleTimer(delayMs, () => {
        const burstCount = Math.floor(randomInRange(OPENING_COUNT_MIN, OPENING_COUNT_MAX + 1));
        const bursts = sampleSequence(burstCount);
        let cumulativeDelay = 0;
        const openingDurationMs = randomInRange(OPENING_DURATION_MIN_MS, OPENING_DURATION_MAX_MS);

        for (let index = 0; index < bursts.length; index += 1) {
          if (index > 0) {
            const delayRoll = Math.random();
            if (delayRoll < 0.22) {
              cumulativeDelay += randomInRange(NEARLY_SIMULTANEOUS_MIN_MS, NEARLY_SIMULTANEOUS_MAX_MS);
            } else if (delayRoll < 0.46) {
              cumulativeDelay += randomInRange(RAPID_TRIPLE_GAP_MIN_MS, RAPID_TRIPLE_GAP_MAX_MS);
            } else {
              cumulativeDelay += randomInRange(BURST_STAGGER_MIN_MS, BURST_STAGGER_MAX_MS);
            }
          }

          if (cumulativeDelay > openingDurationMs) {
            break;
          }

          scheduleTimer(cumulativeDelay, () => {
            const burst = bursts[index];
            explodeAt(burst.x, burst.y, burst.shellSize);
          });
        }
      });
    };

    scheduleSequence(OPENING_DELAY_MS);

    return () => {
      clearTimers();
      destroyFireworks();
    };
  }, [pageVisible, pillRect, reducedMotion, viewport]);

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 3,
          overflow: 'visible',
        }}
      />
      <div ref={pillRef} style={{ ...pillShellStyle, ...pillShellResponsiveStyle }}>
        <View style={styles.card}>
          <View style={styles.glow} pointerEvents="none" />
          <View style={styles.content}>
            <View style={styles.badge}>
              <Feather name="star" size={16} color="#F5E6A8" />
              <Text style={styles.badgeText}>Celebration</Text>
            </View>
            <Text style={styles.title}>🎆 Celebrating Walkerton Homecoming 2026</Text>
            <Text style={styles.subtitle}>Enjoy the festivities!</Text>
          </View>
        </View>
      </div>
    </div>
  );
}

const wrapperStyle: React.CSSProperties = {
  position: 'relative',
  marginBottom: '14px',
  minHeight: '220px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  overflow: 'visible',
};

const pillShellStyle: React.CSSProperties = {
  position: 'relative',
  zIndex: 2,
  width: '100%',
  maxWidth: 'min(100%, 780px)',
};

const styles = StyleSheet.create({
  card: {
    position: 'relative',
    borderRadius: 22,
    backgroundColor: '#111214',
    paddingHorizontal: 24,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: '#1E2229',
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
    overflow: 'hidden',
  },
  glow: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    pointerEvents: 'none',
  },
  content: {
    alignItems: 'center',
    zIndex: 1,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: 'rgba(245, 230, 168, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 230, 168, 0.16)',
    marginBottom: 12,
  },
  badgeText: {
    color: '#F5E6A8',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.7,
    textTransform: 'uppercase',
  },
  title: {
    color: '#F8FAFC',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '900',
    textAlign: 'center',
    maxWidth: 560,
  },
  subtitle: {
    color: '#D9E1EA',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 8,
  },
});

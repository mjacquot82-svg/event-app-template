// © 2026 1001538341 ONTARIO INC.
// Web-only celebration overlay powered by fireworks-js (MIT).

import React, { useEffect, useRef, useState } from 'react';
import { Feather } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { Fireworks } from 'fireworks-js';

const OPENING_DELAY_MS = 1000;
const OPENING_DURATION_MS = 8000;
const OVERLAY_READY_TIMEOUT_MS = 4000;
const FIREWORKS_HUES = [188, 325, 104] as const;

export default function CelebrationPanel() {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const fireworksRef = useRef<Fireworks | null>(null);
  const timerRefs = useRef<number[]>([]);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const pillShellResponsiveStyle: React.CSSProperties =
    wrapperRef.current
      ? wrapperRef.current.clientWidth >= 1024
        ? { width: '62%' }
        : wrapperRef.current.clientWidth >= 768
          ? { width: '78%' }
          : { width: '96%' }
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

    if (reducedMotion) {
      clearTimers();
      destroyFireworks();
      return;
    }

    const scheduleTimer = (delayMs: number, callback: () => void) => {
      const timerId = window.setTimeout(() => {
        timerRefs.current = timerRefs.current.filter((id) => id !== timerId);
        callback();
      }, delayMs);
      timerRefs.current.push(timerId);
    };
    const pickHue = () => FIREWORKS_HUES[Math.floor(Math.random() * FIREWORKS_HUES.length)];

    let cancelled = false;
    let started = false;
    let animationFrameId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const beginSequence = () => {
      if (cancelled || started || !pageVisible) {
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) {
        return;
      }

      started = true;
      const fireworks = new Fireworks(overlay, {
        hue: { min: FIREWORKS_HUES[0], max: FIREWORKS_HUES[0] },
      });
      const runtime = fireworks as Fireworks & {
        createTrace?: () => void;
      };
      if (typeof runtime.createTrace === 'function') {
        const originalCreateTrace = runtime.createTrace.bind(runtime);
        runtime.createTrace = () => {
          const hue = pickHue();
          fireworks.updateOptions({
            hue: { min: hue, max: hue },
          });
          originalCreateTrace();
        };
      }
      fireworksRef.current = fireworks;

      scheduleTimer(OPENING_DELAY_MS, () => {
        fireworks.start();
        scheduleTimer(OPENING_DURATION_MS, () => {
          fireworks.stop(true);
          fireworksRef.current = null;
        });
      });
    };

    const waitForOverlay = () => {
      if (cancelled || started) {
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) {
        animationFrameId = window.requestAnimationFrame(waitForOverlay);
        return;
      }

      if (overlay.clientWidth > 0 && overlay.clientHeight > 0) {
        beginSequence();
        return;
      }

      animationFrameId = window.requestAnimationFrame(waitForOverlay);
    };

    animationFrameId = window.requestAnimationFrame(waitForOverlay);

    const overlay = overlayRef.current;
    if (typeof ResizeObserver !== 'undefined' && overlay) {
      resizeObserver = new ResizeObserver(() => {
        if (overlay.clientWidth > 0 && overlay.clientHeight > 0) {
          beginSequence();
        }
      });
      resizeObserver.observe(overlay);
    }

    scheduleTimer(OVERLAY_READY_TIMEOUT_MS, beginSequence);

    return () => {
      cancelled = true;
      if (animationFrameId) {
        window.cancelAnimationFrame(animationFrameId);
      }
      resizeObserver?.disconnect();
      clearTimers();
      destroyFireworks();
    };
  }, [pageVisible, reducedMotion]);

  return (
    <div ref={wrapperRef} style={wrapperStyle}>
      <div
        ref={overlayRef}
        aria-hidden="true"
        style={overlayStyle}
      />
      <div style={{ ...pillShellStyle, ...pillShellResponsiveStyle }}>
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
  overflow: 'hidden',
};

const overlayStyle: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  zIndex: 3,
  overflow: 'hidden',
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
    zIndex: 4,
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

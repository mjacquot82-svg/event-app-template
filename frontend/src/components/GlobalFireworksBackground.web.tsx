// © 2026 1001538341 ONTARIO INC.

import React, { useEffect, useRef, useState } from 'react';

type TrailPoint = {
  x: number;
  y: number;
  alpha: number;
};

type SmokeParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
};

type BurstStyle = 'chrysanthemum' | 'peony' | 'willow' | 'palm';
type ShellSize = 'small' | 'medium' | 'large';

type Rocket = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  ax: number;
  ay: number;
  targetY: number;
  color: string;
  radius: number;
  burstScale: number;
  particleCount: number;
  burstStyle: BurstStyle;
  shellSize: ShellSize;
  trail: TrailPoint[];
  smoke: SmokeParticle[];
};

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  radius: number;
  color: string;
  drag: number;
  brightness: number;
  twinkle: boolean;
};

type Flash = {
  x: number;
  y: number;
  radius: number;
  life: number;
  maxLife: number;
  color: string;
};

const FIREWORKS_COLORS = ['#20BFD8', '#EE008A', '#69BD4B'] as const;
const BURST_STYLES: BurstStyle[] = ['chrysanthemum', 'peony', 'willow', 'palm'];
const MIN_LAUNCH_DELAY_MS = 5500;
const MAX_LAUNCH_DELAY_MS = 9500;
const MIN_GROUP_DELAY_MS = 260;
const MAX_GROUP_DELAY_MS = 1600;
const INITIAL_LAUNCH_DELAY_MS = 1000;
const MAX_TRAIL_POINTS = 28;
const ROCKET_GRAVITY = -11;
const PARTICLE_GRAVITY = 46;
const MAX_PIXEL_RATIO = 1.75;
export default function GlobalFireworksBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number | null>(null);
  const timerRefs = useRef<number[]>([]);
  const lastTimeRef = useRef<number | null>(null);
  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const flashesRef = useRef<Flash[]>([]);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);

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
    if (typeof window === 'undefined') {
      return;
    }

    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    updateViewport();
    window.addEventListener('resize', updateViewport);
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || viewport.width <= 0 || viewport.height <= 0) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const ratio = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO) : 1;
    canvas.width = Math.floor(viewport.width * ratio);
    canvas.height = Math.floor(viewport.height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
  }, [viewport]);

  useEffect(() => {
    const clearAnimation = () => {
      timerRefs.current.forEach((timerId) => window.clearTimeout(timerId));
      timerRefs.current = [];
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
        frameRef.current = null;
      }
      lastTimeRef.current = null;
      rocketsRef.current = [];
      particlesRef.current = [];
      flashesRef.current = [];
    };

    const randomInRange = (min: number, max: number) => min + Math.random() * (max - min);
    const easeOutQuad = (value: number) => 1 - (1 - value) * (1 - value);
    const sample = <T,>(items: T[]): T => items[Math.floor(Math.random() * items.length)];
    const pickColor = () => sample(FIREWORKS_COLORS);
    const withAlpha = (color: string, alpha: number) =>
      `${color}${Math.round(Math.max(0, Math.min(alpha, 1)) * 255).toString(16).padStart(2, '0')}`;

    const draw = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        return;
      }

      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }

      context.clearRect(0, 0, viewport.width, viewport.height);

      context.globalCompositeOperation = 'lighter';

      rocketsRef.current.forEach((rocket) => {
        rocket.trail.forEach((point, index) => {
          const progress = (index + 1) / rocket.trail.length;
          context.save();
          context.globalAlpha = point.alpha * progress * 0.42;
          context.fillStyle = rocket.color;
          context.shadowBlur = 24;
          context.shadowColor = rocket.color;
          context.beginPath();
          context.arc(point.x, point.y, rocket.radius * (0.7 + progress * 1.8), 0, Math.PI * 2);
          context.fill();
          context.restore();
        });

        context.save();
        context.globalAlpha = 0.98;
        context.fillStyle = rocket.color;
        context.shadowBlur = 26;
        context.shadowColor = rocket.color;
        context.beginPath();
        context.arc(rocket.x, rocket.y, rocket.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      flashesRef.current.forEach((flash) => {
        const progress = 1 - flash.life / flash.maxLife;
        const radius = flash.radius * easeOutQuad(progress);
        const alpha = (1 - progress) * 0.52;
        const gradient = context.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius);
        gradient.addColorStop(0, withAlpha(flash.color, Math.min(alpha * 2.5, 1)));
        gradient.addColorStop(0.22, withAlpha(flash.color, Math.min(alpha, 210 / 255)));
        gradient.addColorStop(0.58, withAlpha(flash.color, 0.13));
        gradient.addColorStop(1, withAlpha(flash.color, 0));
        context.save();
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(flash.x, flash.y, radius, 0, Math.PI * 2);
        context.fill();
        context.restore();

        const ambientGradient = context.createRadialGradient(flash.x, flash.y, 0, flash.x, flash.y, radius * 1.95);
        ambientGradient.addColorStop(0, withAlpha(flash.color, alpha * 0.1));
        ambientGradient.addColorStop(0.45, withAlpha(flash.color, 0.1));
        ambientGradient.addColorStop(1, withAlpha(flash.color, 0));
        context.save();
        context.fillStyle = ambientGradient;
        context.beginPath();
        context.arc(flash.x, flash.y, radius * 1.95, 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      particlesRef.current.forEach((particle) => {
        const progress = 1 - particle.life / particle.maxLife;
        const alpha = (1 - easeOutQuad(progress)) * particle.brightness * (particle.twinkle ? randomInRange(0.72, 1) : 1);
        const radius = Math.max(0.7, particle.radius * (1 - progress * 0.42));

        context.save();
        context.globalAlpha = alpha * 0.48;
        context.fillStyle = particle.color;
        context.shadowBlur = 30;
        context.shadowColor = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, radius * 1.95, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.save();
        context.globalAlpha = alpha * 0.35;
        context.fillStyle = particle.color;
        context.shadowBlur = 36;
        context.shadowColor = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, radius * 1.15, 0, Math.PI * 2);
        context.fill();
        context.restore();

        context.save();
        context.globalAlpha = alpha;
        context.fillStyle = particle.color;
        context.shadowBlur = 16;
        context.shadowColor = particle.color;
        context.beginPath();
        context.arc(particle.x, particle.y, Math.max(0.6, radius * 0.42), 0, Math.PI * 2);
        context.fill();
        context.restore();
      });

      context.globalCompositeOperation = 'source-over';
    };

    if (viewport.width <= 0 || viewport.height <= 0 || reducedMotion || !pageVisible) {
      clearAnimation();
      draw();
      return;
    }

    const createParticle = ({
      x,
      y,
      angle,
      speed,
      color,
      radius,
      life,
      drag,
      brightness,
      twinkle,
      upwardBias = 0,
    }: {
      x: number;
      y: number;
      angle: number;
      speed: number;
      color: string;
      radius: number;
      life: number;
      drag: number;
      brightness: number;
      twinkle: boolean;
      upwardBias?: number;
    }) => {
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - upwardBias,
        life,
        maxLife: life,
        radius,
        color,
        drag,
        brightness,
        twinkle,
      });
    };

    const explode = (rocket: Rocket) => {
      const burstRadiusBySize = {
        small: randomInRange(75, 100),
        medium: randomInRange(125, 175),
        large: randomInRange(200, 300),
      };
      const burstRadius = burstRadiusBySize[rocket.shellSize];
      const particleCount = rocket.particleCount;
      const primaryColor = rocket.color;
      const secondaryColor = Math.random() > 0.68 ? pickColor() : primaryColor;

      flashesRef.current.push({
        x: rocket.x,
        y: rocket.y,
        radius: burstRadius * randomInRange(0.8, 1.15),
        life: 0.52,
        maxLife: 0.52,
        color: rocket.color,
      });

      if (rocket.burstStyle === 'chrysanthemum' || rocket.burstStyle === 'peony') {
        for (let index = 0; index < particleCount; index += 1) {
          const angle = (Math.PI * 2 * index) / particleCount + randomInRange(-0.08, 0.08);
          const speed =
            rocket.burstStyle === 'chrysanthemum'
              ? burstRadius * randomInRange(0.92, 1.08)
              : burstRadius * randomInRange(0.68, 1.12);
          createParticle({
            x: rocket.x,
            y: rocket.y,
            angle,
            speed,
            color: Math.random() > 0.72 ? secondaryColor : primaryColor,
            radius: rocket.burstScale * randomInRange(2.8, 5.8),
            life: randomInRange(3.1, 4),
            drag: rocket.burstStyle === 'chrysanthemum' ? randomInRange(0.968, 0.982) : randomInRange(0.962, 0.978),
            brightness: randomInRange(0.78, 1),
            twinkle: Math.random() > 0.48,
          });
        }
      } else if (rocket.burstStyle === 'willow') {
        for (let index = 0; index < particleCount; index += 1) {
          const angle = (Math.PI * 2 * index) / particleCount + randomInRange(-0.16, 0.16);
          const speed = burstRadius * randomInRange(0.42, 0.88);
          createParticle({
            x: rocket.x,
            y: rocket.y,
            angle,
            speed,
            color: Math.random() > 0.8 ? secondaryColor : primaryColor,
            radius: rocket.burstScale * randomInRange(3.2, 6.4),
            life: randomInRange(3.5, 4.2),
            drag: randomInRange(0.975, 0.986),
            brightness: randomInRange(0.76, 0.98),
            twinkle: Math.random() > 0.58,
            upwardBias: randomInRange(8, 20),
          });
        }
      } else {
        const fronds = Math.floor(randomInRange(8, 14));
        const particlesPerFrond = Math.max(10, Math.floor(particleCount / fronds));
        for (let frondIndex = 0; frondIndex < fronds; frondIndex += 1) {
          const baseAngle = (Math.PI * 2 * frondIndex) / fronds + randomInRange(-0.1, 0.1);
          for (let particleIndex = 0; particleIndex < particlesPerFrond; particleIndex += 1) {
            const angle = baseAngle + randomInRange(-0.1, 0.1);
            const speed = burstRadius * randomInRange(0.7, 1.12);
            createParticle({
              x: rocket.x,
              y: rocket.y,
              angle,
              speed,
              color: particleIndex < particlesPerFrond * 0.18 ? secondaryColor : primaryColor,
              radius: rocket.burstScale * randomInRange(2.8, 5.2),
              life: randomInRange(3.1, 4),
              drag: randomInRange(0.965, 0.979),
              brightness: randomInRange(0.8, 1),
              twinkle: Math.random() > 0.5,
            });
          }
        }
      }

      const coreCount = rocket.shellSize === 'large' ? Math.floor(randomInRange(20, 32)) : Math.floor(randomInRange(10, 18));
      for (let index = 0; index < coreCount; index += 1) {
        createParticle({
          x: rocket.x,
          y: rocket.y,
          angle: randomInRange(0, Math.PI * 2),
          speed: burstRadius * randomInRange(0.18, 0.34),
          color: primaryColor,
          radius: rocket.burstScale * randomInRange(2, 3.8),
          life: randomInRange(2.8, 3.6),
          drag: randomInRange(0.95, 0.968),
          brightness: randomInRange(0.72, 0.98),
          twinkle: true,
          upwardBias: randomInRange(4, 14),
        });
      }
    };

    const launchFirework = () => {
      const sizeRoll = Math.random();
      const shellSize: ShellSize = sizeRoll > 0.78 ? 'large' : sizeRoll > 0.38 ? 'medium' : 'small';
      const burstStyle = sample(BURST_STYLES);
      const launchX = randomInRange(viewport.width * 0.1, viewport.width * 0.9);
      const targetY = randomInRange(viewport.height * 0.2, viewport.height * 0.3);
      const targetX = launchX + randomInRange(-viewport.width * 0.08, viewport.width * 0.08);
      const flightTime = shellSize === 'large' ? randomInRange(2, 2.45) : randomInRange(1.7, 2.15);
      const startY = viewport.height + randomInRange(60, 140);
      const vx = (targetX - launchX) / flightTime;
      const vy = (targetY - startY - 0.5 * ROCKET_GRAVITY * flightTime * flightTime) / flightTime;
      const burstScaleBySize = {
        small: randomInRange(0.9, 1.02),
        medium: randomInRange(1.08, 1.28),
        large: randomInRange(1.34, 1.62),
      };
      const particleCountBySize = {
        small: Math.floor(randomInRange(85, 130)),
        medium: Math.floor(randomInRange(150, 210)),
        large: Math.floor(randomInRange(220, 320)),
      };

      rocketsRef.current.push({
        x: launchX,
        y: startY,
        vx,
        vy,
        ax: 0,
        ay: ROCKET_GRAVITY,
        targetY,
        color: pickColor(),
        radius: shellSize === 'large' ? randomInRange(3.2, 4.6) : shellSize === 'medium' ? randomInRange(2.5, 3.5) : randomInRange(2, 2.8),
        burstScale: burstScaleBySize[shellSize],
        particleCount: particleCountBySize[shellSize],
        burstStyle,
        shellSize,
        trail: [],
        smoke: [],
      });
    };

    const scheduleLaunch = (delayMs: number) => {
      const timerId = window.setTimeout(() => {
        launchFirework();
        timerRefs.current = timerRefs.current.filter((id) => id !== timerId);
      }, delayMs);
      timerRefs.current.push(timerId);
    };

    const scheduleSequence = (delayMs?: number) => {
      const nextDelay = delayMs ?? randomInRange(MIN_LAUNCH_DELAY_MS, MAX_LAUNCH_DELAY_MS);
      const timerId = window.setTimeout(() => {
        timerRefs.current = timerRefs.current.filter((id) => id !== timerId);

        const patternRoll = Math.random();
        if (patternRoll > 0.9) {
          const finaleCount = Math.floor(randomInRange(8, 13));
          for (let index = 0; index < finaleCount; index += 1) {
            scheduleLaunch(index * randomInRange(700, 1000));
          }
          scheduleSequence(randomInRange(12000, 16000));
          return;
        }

        const launchCount = patternRoll > 0.72 ? 3 : patternRoll > 0.38 ? 2 : 1;
        for (let index = 0; index < launchCount; index += 1) {
          scheduleLaunch(index * randomInRange(MIN_GROUP_DELAY_MS, MAX_GROUP_DELAY_MS));
        }

        scheduleSequence();
      }, nextDelay);

      timerRefs.current.push(timerId);
    };

    const tick = (time: number) => {
      if (lastTimeRef.current === null) {
        lastTimeRef.current = time;
      }

      const deltaSeconds = Math.min((time - lastTimeRef.current) / 1000, 0.032);
      lastTimeRef.current = time;

      rocketsRef.current = rocketsRef.current.flatMap((rocket) => {
        const nextVx = rocket.vx + rocket.ax * deltaSeconds;
        const nextVy = rocket.vy + rocket.ay * deltaSeconds;
        const nextX = rocket.x + nextVx * deltaSeconds;
        const nextY = rocket.y + nextVy * deltaSeconds;
        const nextTrail = rocket.trail.concat({
          x: rocket.x,
          y: rocket.y,
          alpha: 1,
        }).slice(-MAX_TRAIL_POINTS);
        const nextSmoke = rocket.smoke
          .map((smoke) => ({
            ...smoke,
            x: smoke.x + smoke.vx * deltaSeconds,
            y: smoke.y + smoke.vy * deltaSeconds,
            life: smoke.life - deltaSeconds,
            radius: smoke.radius + deltaSeconds * 7,
          }))
          .filter((smoke) => smoke.life > 0);

        const nextRocket: Rocket = {
          ...rocket,
          x: nextX,
          y: nextY,
          vx: nextVx,
          vy: nextVy,
          trail: nextTrail,
          smoke: nextSmoke,
        };

        if (nextRocket.y <= nextRocket.targetY || nextRocket.vy >= -24) {
          explode(nextRocket);
          return [];
        }

        return [nextRocket];
      });

      particlesRef.current = particlesRef.current.flatMap((particle) => {
        const nextLife = particle.life - deltaSeconds;
        if (nextLife <= 0) {
          return [];
        }

        return [{
          ...particle,
          x: particle.x + particle.vx * deltaSeconds,
          y: particle.y + particle.vy * deltaSeconds,
          vx: particle.vx * particle.drag,
          vy: particle.vy * particle.drag + PARTICLE_GRAVITY * deltaSeconds,
          life: nextLife,
        }];
      });

      flashesRef.current = flashesRef.current
        .map((flash) => ({
          ...flash,
          life: flash.life - deltaSeconds,
        }))
        .filter((flash) => flash.life > 0);

      draw();
      frameRef.current = window.requestAnimationFrame(tick);
    };

    scheduleSequence(INITIAL_LAUNCH_DELAY_MS);
    frameRef.current = window.requestAnimationFrame(tick);

    return () => {
      clearAnimation();
    };
  }, [pageVisible, reducedMotion, viewport.height, viewport.width]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 999,
        background: 'transparent',
      }}
    />
  );
}

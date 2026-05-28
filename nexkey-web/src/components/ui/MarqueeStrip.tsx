"use client";

import { useEffect, useRef } from "react";

interface MarqueeStripProps {
  items: readonly (readonly [string, string])[];
  /** pixels per second, default 70 */
  speed?: number;
}

export function MarqueeStrip({ items, speed = 70 }: MarqueeStripProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const xRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const prevTimeRef = useRef<number | null>(null);
  const pausedRef = useRef(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // half of total because we doubled the items for seamless loop
    const loopWidth = track.scrollWidth / 2;

    function tick(now: number) {
      const el = trackRef.current;
      if (el && !pausedRef.current && prevTimeRef.current !== null) {
        const delta = (now - prevTimeRef.current) / 1000; // seconds
        xRef.current += speed * delta;
        if (xRef.current >= loopWidth) xRef.current -= loopWidth;
        el.style.transform = `translateX(-${xRef.current}px)`;
      }
      prevTimeRef.current = now;
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [speed]);

  const doubled = [...items, ...items];

  return (
    <div
      className="overflow-hidden rounded-2xl border-y border-border bg-white py-3 shadow-sm"
      style={{
        WebkitMaskImage:
          "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
        maskImage:
          "linear-gradient(to right, transparent, black 16%, black 84%, transparent)",
      }}
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
        prevTimeRef.current = null; // reset delta to avoid jump on resume
      }}
    >
      {/* accessible text for screen readers */}
      <ul className="sr-only">
        {items.map(([value, label]) => (
          <li key={value}>
            {value} – {label}
          </li>
        ))}
      </ul>

      {/* animated track */}
      <div
        ref={trackRef}
        aria-hidden="true"
        className="flex gap-3"
        style={{ width: "max-content" }}
      >
        {doubled.map(([value, label], i) => (
          <div
            key={`${value}-${i}`}
            className="min-w-[200px] flex-shrink-0 rounded-xl border border-border bg-slate-50 px-4 py-3"
          >
            <div className="text-sm font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

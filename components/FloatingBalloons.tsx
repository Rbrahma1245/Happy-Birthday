
"use client";

import { useMemo } from "react";

export default function FloatingBalloons() {
  const balloons = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        id: i,
        left: `${(i * 37 + 8) % 100}%`,
        delay: `${-(i * 2.7)}s`,
        duration: `${13 + (i % 6) * 3}s`,
        size: `${36 + (i % 4) * 12}px`,
        color: [
          "#ff8fab",
          "#ffb3c6",
          "#ffc8a2",
          "#cdb4db",
          "#f9d976",
          "#ff6b81",
        ][i % 6],
      })),
    []
  );

  return (
    <div className="floating-balloons" aria-hidden="true">
      {balloons.map((balloon) => (
        <div
          key={balloon.id}
          className="floating-balloon"
          style={{
            left: balloon.left,
            animationDelay: balloon.delay,
            animationDuration: balloon.duration,
          }}
        >
          <div
            className="balloon-body"
            style={{
              width: balloon.size,
              backgroundColor: balloon.color,
            }}
          >
            <div className="balloon-shine" />
          </div>

          <div className="balloon-knot" />
          <div className="balloon-string" />
        </div>
      ))}
    </div>
  );
}

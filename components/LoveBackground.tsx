
"use client";

import { useMemo } from "react";

export default function LoveBackground() {
  const particles = useMemo(
    () =>
      Array.from({ length: 65 }, (_, i) => ({
        id: i,
        left: `${(i * 47.3 + 9) % 100}%`,
        delay: `${-((i * 1.37) % 16)}s`,
        duration: `${7 + (i % 8) * 1.2}s`,
        size: `${12 + (i % 5) * 5}px`,
        drift: `${((i * 19) % 140) - 70}px`,
        symbol: ["♥", "♡", "✦", "✧", "💕"][i % 5],
      })),
    []
  );

  return (
    <div className="love-background" aria-hidden="true">
      <div className="love-aurora love-aurora-one" />
      <div className="love-aurora love-aurora-two" />
      <div className="love-aurora love-aurora-three" />

      <div className="love-sparkle-field">
        {particles.map((item) => (
          <span
            key={item.id}
            className={`love-floating-particle ${
              item.id % 2 === 0 ? "pink" : "gold"
            }`}
            style={
              {
                left: item.left,
                fontSize: item.size,
                animationDelay: item.delay,
                animationDuration: item.duration,
                "--drift": item.drift,
              } as React.CSSProperties
            }
          >
            {item.symbol}
          </span>
        ))}
      </div>

      <div className="love-edge love-edge-left">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * -0.8}s` }}>
            {i % 3 === 0 ? "💗" : i % 3 === 1 ? "♡" : "✨"}
          </span>
        ))}
      </div>

      <div className="love-edge love-edge-right">
        {Array.from({ length: 12 }, (_, i) => (
          <span key={i} style={{ animationDelay: `${i * -0.95}s` }}>
            {i % 3 === 0 ? "💖" : i % 3 === 1 ? "♡" : "✦"}
          </span>
        ))}
      </div>
    </div>
  );
}

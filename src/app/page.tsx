
"use client";

import { useEffect, useRef, useState } from "react";
import type { TouchEvent } from "react";
import Image from "next/image";
import confetti from "canvas-confetti";

type Memory = {
  id: number;
  src: string;
};

const memories: Memory[] = Array.from(
  { length: 12 },
  (_, index) => ({
    id: index + 1,
    src: `/images/photo${index + 1}.jpg`,
  })
);

const decorations = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  side: i % 2 ? "right" : "left",
  top: `${5 + ((i * 19) % 85)}%`,
  offset: `${4 + ((i * 13) % 17)}%`,
  delay: `${-(i % 9) * 0.65}s`,
  duration: `${3 + (i % 5) * 0.6}s`,
  symbol: ["♥", "♡", "✦", "♥", "✧"][i % 5],
  size: `${13 + (i % 5) * 7}px`,
}));

export default function BirthdayPage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [selectedMemory, setSelectedMemory] =
    useState<Memory | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [surpriseOpened, setSurpriseOpened] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const touchStart = useRef<number | null>(null);
  const modalCloseRef = useRef<HTMLButtonElement | null>(null);

  // Continuously looping birthday music
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = 0.7;
    audio.loop = true;

    const playMusic = () => {
      if (audio.paused) {
        void audio.play().catch(() => {
          // Some browsers require the first user interaction.
        });
      }
    };

    playMusic();

    document.addEventListener("pointerdown", playMusic);
    document.addEventListener("keydown", playMusic);

    return () => {
      document.removeEventListener("pointerdown", playMusic);
      document.removeEventListener("keydown", playMusic);
    };
  }, []);

  const goToSlide = (index: number) => {
    setActiveSlide(
      (index + memories.length) % memories.length
    );
  };

  // Automatic slideshow
  useEffect(() => {
    if (isPaused || selectedMemory || memories.length < 2) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveSlide(
        (current) => (current + 1) % memories.length
      );
    }, 2200);

    return () => window.clearInterval(timer);
  }, [isPaused, selectedMemory]);

  // Modal keyboard controls and scroll lock
  useEffect(() => {
    if (!selectedMemory) return;

    const previousOverflow = document.body.style.overflow;
    const previousFocus = document.activeElement as HTMLElement | null;

    document.body.style.overflow = "hidden";
    modalCloseRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedMemory(null);
      }

      if (event.key === "ArrowRight") {
        setSelectedMemory((current) => {
          if (!current) return null;

          const index = memories.findIndex(
            (memory) => memory.id === current.id
          );

          return memories[(index + 1) % memories.length];
        });
      }

      if (event.key === "ArrowLeft") {
        setSelectedMemory((current) => {
          if (!current) return null;

          const index = memories.findIndex(
            (memory) => memory.id === current.id
          );

          return memories[
            (index - 1 + memories.length) % memories.length
          ];
        });
      }

      if (event.key === "Tab") {
        const modal = modalCloseRef.current?.closest(
          '[role="dialog"]'
        );

        const buttons = modal?.querySelectorAll<HTMLButtonElement>(
          "button:not(:disabled)"
        );

        if (!buttons?.length) return;

        const first = buttons[0];
        const last = buttons[buttons.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (
          !event.shiftKey &&
          document.activeElement === last
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      previousFocus?.focus();
    };
  }, [Boolean(selectedMemory)]);

  const changeModalPhoto = (direction: number) => {
    setSelectedMemory((current) => {
      if (!current) return null;

      const index = memories.findIndex(
        (memory) => memory.id === current.id
      );

      return memories[
        (index + direction + memories.length) % memories.length
      ];
    });
  };

  const celebrate = () => {
    setSurpriseOpened(true);

    if (audioRef.current?.paused) {
      void audioRef.current.play().catch(() => {});
    }

    confetti({
      particleCount: 170,
      spread: 110,
      startVelocity: 45,
      origin: { y: 0.55 },
      colors: [
        "#ed7d9d",
        "#f6c5a8",
        "#fff0c5",
        "#ffffff",
        "#d95c84",
      ],
    });

    const until = Date.now() + 1800;

    const burst = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.65 },
      });

      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.65 },
      });

      if (Date.now() < until) {
        requestAnimationFrame(burst);
      }
    };

    requestAnimationFrame(burst);
  };

  const handleTouchStart = (
    event: TouchEvent<HTMLDivElement>
  ) => {
    touchStart.current =
      event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (
    event: TouchEvent<HTMLDivElement>
  ) => {
    if (touchStart.current === null) return;

    const diff =
      touchStart.current -
      event.changedTouches[0].clientX;

    if (Math.abs(diff) > 45) {
      goToSlide(activeSlide + (diff > 0 ? 1 : -1));
    }

    touchStart.current = null;
  };

  return (
    <main className="birthday-page">
      {/* Background music */}
      <audio
        ref={audioRef}
        src="/music/happy-birthday.mp3"
        autoPlay
        loop
        preload="auto"
      />

      {/* Navigation */}
      <nav className="birthday-nav">
        <a className="birthday-logo" href="#home">
          ♡ <span>our little forever</span>
        </a>
      </nav>

      {/* Hero */}
      <section id="home" className="birthday-hero">
        <div
          className="birthday-hero-orb orb-left"
          aria-hidden="true"
        />

        <div
          className="birthday-hero-orb orb-right"
          aria-hidden="true"
        />

        <span
          className="hero-flower flower-one"
          aria-hidden="true"
        >
          ✿
        </span>

        <span
          className="hero-flower flower-two"
          aria-hidden="true"
        >
          ✳
        </span>

        <div className="birthday-hero-inner">
          <div className="birthday-eyebrow">
            <span>✦</span> TODAY IS ALL ABOUT YOU <span>✦</span>
          </div>

          <p className="birthday-handwriting">
            To my favorite person in the world,
          </p>

          <h1>
            Happy Birthday <span>my love.</span>
          </h1>

          <p className="birthday-hero-copy">
            You make every ordinary moment feel like magic.
            Here&apos;s a little corner of the universe,
            made just to celebrate you.
          </p>

          <div className="birthday-hero-buttons">
            <button
              className="birthday-primary"
              type="button"
              onClick={celebrate}
            >
              {surpriseOpened
                ? "Celebrate again ✨"
                : "Open your surprise ✨"}
            </button>

            <a
              className="birthday-secondary"
              href="#memories"
            >
              See our memories <span>↗</span>
            </a>
          </div>

          {surpriseOpened && (
            <p className="birthday-surprise" role="status">
              ♡ You deserve all the happiness in the world ♡
            </p>
          )}
        </div>

        <div className="birthday-hero-bottom">
          a story written in little moments <span>↓</span>
        </div>
      </section>

      {/* Memories */}
      <section id="memories" className="birthday-memories">
        <div className="birthday-section-heading">
          <span className="birthday-section-label">
            CHAPTER ONE · OUR STORY
          </span>

          <h2>
            Little moments, <em>big love.</em>
          </h2>

          <p>
            Every photo holds a piece of my favorite story — ours.
          </p>
        </div>

        <div className="birthday-carousel-scene">
          <div
            className="birthday-love-field"
            aria-hidden="true"
          >
            {decorations.map((d) => (
              <span
                key={d.id}
                className={`birthday-love-particle ${d.side}`}
                style={{
                  top: d.top,
                  [d.side]: d.offset,
                  animationDelay: d.delay,
                  animationDuration: d.duration,
                  fontSize: d.size,
                }}
              >
                {d.symbol}
              </span>
            ))}
          </div>

          <div
            className="birthday-orbit orbit-a"
            aria-hidden="true"
          />

          <div
            className="birthday-orbit orbit-b"
            aria-hidden="true"
          />

          {/* Responsive image carousel */}
          <div
            className="birthday-carousel"
            role="region"
            aria-roledescription="carousel"
            aria-label="Our favorite memories"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
            onFocusCapture={() => setIsPaused(true)}
            onBlurCapture={(event) => {
              if (
                !event.currentTarget.contains(
                  event.relatedTarget as Node | null
                )
              ) {
                setIsPaused(false);
              }
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="birthday-slide-stage">
              {memories.map((memory, index) => {
                const position =
                  (index - activeSlide + memories.length) %
                  memories.length;

                const side =
                  position === 0
                    ? "center"
                    : position <= Math.floor(memories.length / 2)
                      ? "right"
                      : "left";

                return (
                  <div
                    key={memory.id}
                    className={`birthday-slide birthday-slide-${side}`}
                    aria-hidden={side !== "center"}
                    inert={side !== "center"}
                  >
                    <button
                      type="button"
                      className="birthday-image-click"
                      onClick={() => setSelectedMemory(memory)}
                      aria-label={`Open photo ${memory.id}`}
                      tabIndex={side === "center" ? 0 : -1}
                    >
                      <Image
                        src={memory.src}
                        alt={`Our memory ${memory.id}`}
                        fill
                        sizes="(max-width: 600px) 92vw, (max-width: 1024px) 75vw, 660px"
                        className="birthday-slide-photo"
                        priority={index === 0}
                      />
                    </button>
                  </div>
                );
              })}

              <div
                className="birthday-slide-sticker"
                aria-hidden="true"
              >
                made with
                <strong>love ♡</strong>
              </div>
            </div>

            <div className="birthday-carousel-controls">
              <button
                type="button"
                onClick={() => goToSlide(activeSlide - 1)}
                aria-label="Previous photo"
              >
                ←
              </button>

              <div className="birthday-carousel-pagination">
                {memories.map((memory, index) => (
                  <button
                    key={memory.id}
                    type="button"
                    className={
                      activeSlide === index ? "active" : ""
                    }
                    onClick={() => goToSlide(index)}
                    aria-label={`Go to photo ${memory.id}`}
                    aria-current={
                      activeSlide === index ? "true" : undefined
                    }
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() => goToSlide(activeSlide + 1)}
                aria-label="Next photo"
              >
                →
              </button>
            </div>

            <p className="birthday-carousel-count">
              {String(activeSlide + 1).padStart(2, "0")}
              <span> / </span>
              {String(memories.length).padStart(2, "0")}
            </p>
          </div>
        </div>

        <p className="birthday-carousel-caption">
          ♡ And the best memories are still waiting to be made ♡
        </p>
      </section>

      {/* Love letter */}
      <section
        className="birthday-letter-section"
        id="letter"
      >
        <div className="birthday-letter-card">
          <span className="birthday-letter-seal">
            ♡
          </span>

          <span className="birthday-section-label">
            A LETTER, JUST FOR YOU
          </span>

          <h2>
            Some things are better{" "}
            <em>written from the heart.</em>
          </h2>

          <div className="birthday-letter-rule">
            ✦
          </div>

          <p>
            Thank you for making ordinary days feel extraordinary,
            for being the reason behind so many of my smiles,
            and for filling my world with a happiness I never
            knew I needed.
          </p>

          <p>
            On your birthday, I wish you endless laughter,
            beautiful surprises, dreams that come true,
            and a love that reminds you every day how
            precious you are.
          </p>

          <p>
            No matter how many birthdays pass,
            I hope I get to celebrate every single
            one of them by your side.
          </p>

          <p className="birthday-letter-signoff">
            Forever and always,
            <strong>
              Yours, with all my love ♡
            </strong>
          </p>
        </div>
      </section>

      {/* Ending */}
      <section className="birthday-ending">
        <div className="birthday-ending-stars">
          ✧ &nbsp; ♡ &nbsp; ✧
        </div>

        <p>one more thing...</p>

        <h2>
          You are my favorite <em>everything.</em>
        </h2>

        <button
          type="button"
          className="birthday-ending-heart"
          onClick={celebrate}
          aria-label="Celebrate again"
        >
          ♥
        </button>

        <span>
          Happy birthday, today and always.
        </span>
      </section>

      <footer className="birthday-footer">
        made with love, just for you · ♡
      </footer>

      {/* Fullscreen photo modal */}
      {selectedMemory && (
        <div
          className="birthday-image-modal-backdrop"
          onClick={() => setSelectedMemory(null)}
        >
          <div
            className="birthday-image-modal"
            role="dialog"
            aria-modal="true"
            aria-label="Enlarged memory photo"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="birthday-image-modal-frame">
              <Image
                key={selectedMemory.id}
                src={selectedMemory.src}
                alt={`Our memory ${selectedMemory.id}`}
                fill
                sizes="(max-width: 600px) 96vw, (max-width: 1024px) 90vw, 1100px"
                className="birthday-image-modal-photo"
                priority
              />
            </div>

            <button
              ref={modalCloseRef}
              type="button"
              className="birthday-image-modal-close"
              onClick={() => setSelectedMemory(null)}
              aria-label="Close image"
            >
              ×
            </button>

            <button
              type="button"
              className="birthday-image-modal-prev"
              onClick={() => changeModalPhoto(-1)}
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              type="button"
              className="birthday-image-modal-next"
              onClick={() => changeModalPhoto(1)}
              aria-label="Next image"
            >
              ›
            </button>

            <div className="birthday-image-modal-count">
              {selectedMemory.id} / {memories.length}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

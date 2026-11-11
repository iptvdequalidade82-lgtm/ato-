"use client";

/**
 * Perspective Tunnel Hero — adaptado para a ATO.
 *
 * Base: componente "perspective-tunnel-hero" (21st.dev), com estas mudanças:
 * - a rolagem nativa move o túnel enquanto a primeira tela fica fixa;
 * - quando a animação termina, a página continua para a próxima seção;
 * - começa só com o título; as fotos surgem conforme a rolagem e o título cresce e some no fim;
 * - prefers-reduced-motion: cena estática, sem túnel nem parallax;
 * - visual da ATO (azul-marinho, Manrope, sem gradientes de texto nem cores neon).
 */

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export type TunnelImage = { src: string; srcSet?: string; title: string };

type TunnelCardData = {
  item: TunnelImage;
  angleCos: number;
  angleSin: number;
  radiusFactorX: number;
  radiusFactorY: number;
  rotationZ: number;
  index: number;
};

type Stage = { width: number; height: number; isMobile: boolean };

const SPRING = { stiffness: 60, damping: 25, mass: 0.5 };
const EASE = [0.16, 1, 0.3, 1] as const;

function buildCards(images: TunnelImage[]): TunnelCardData[] {
  return images.map((item, i) => {
    const golden = i * 137.5 * (Math.PI / 180);
    return {
      item,
      angleCos: Math.cos(golden),
      angleSin: Math.sin(golden),
      radiusFactorX: 0.28 + (i % 3) * 0.08,
      radiusFactorY: 0.26 + (i % 2) * 0.09,
      rotationZ: (i % 2 === 0 ? 1 : -1) * (2 + (i % 5) * 1.5),
      index: i,
    };
  });
}

function useCameraParallax(enabled: boolean) {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, SPRING);
  const y = useSpring(rawY, SPRING);
  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
      rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [enabled, rawX, rawY]);
  return { x, y };
}

function TunnelCard({
  card,
  progress,
  pointer,
  total,
  stage,
}: {
  card: TunnelCardData;
  progress: MotionValue<number>;
  pointer: { x: MotionValue<number>; y: MotionValue<number> };
  total: number;
  stage: Stage;
}) {
  const span = 0.52;
  const start = total > 1 ? (card.index / (total - 1)) * 0.43 : 0;
  const local = useTransform(progress, [start, start + span], [0, 1]);

  const z = useTransform(local, [0, 1], stage.isMobile ? [-1100, 670] : [-1600, 800]);
  const opacity = useTransform(local, [0, 0.14, 0.75, 0.93, 1], [0, 1, 1, 1, 0]);
  const zIndex = useTransform(z, (depth) => (depth > -120 ? 70 + card.index : card.index + 1));

  const width = stage.isMobile
    ? Math.max(120, Math.min(170, stage.width * 0.36))
    : Math.max(200, Math.min(300, stage.width * 0.2));
  const baseX = card.angleCos * stage.width * card.radiusFactorX;
  const baseY = card.angleSin * stage.height * card.radiusFactorY;
  const pan = stage.isMobile ? 16 : 40;

  const transform = useTransform([z, pointer.x, pointer.y], ([cz, px, py]: number[]) => {
    const ox = baseX - px * pan;
    const oy = baseY - py * pan;
    return `translate3d(calc(-50% + ${ox}px), calc(-50% + ${oy}px), ${cz}px) rotateZ(${card.rotationZ}deg)`;
  });

  return (
    <motion.figure
      style={{ width, transform, opacity, zIndex }}
      className="pointer-events-none absolute left-1/2 top-1/2 m-0 aspect-[4/5] will-change-transform"
    >
      <div className="relative h-full w-full overflow-hidden rounded-[3px] bg-navy-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
        <img
          src={card.item.src}
          srcSet={card.item.srcSet}
          sizes={stage.isMobile ? "40vw" : "18vw"}
          alt=""
          draggable={false}
          decoding="async"
          className="h-full w-full object-cover"
        />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-3.5 pt-12 text-[0.875rem] font-medium tracking-[-0.01em] text-paper sm:px-5 sm:pb-4 sm:text-[0.9375rem]">
          {card.item.title}
        </figcaption>
      </div>
    </motion.figure>
  );
}

export default function PerspectiveTunnelHero({
  images,
  titleLines,
  text,
  actions,
  id,
  scrollHint = "Role para explorar",
}: {
  images: TunnelImage[];
  titleLines: readonly string[];
  text: string;
  actions?: ReactNode;
  id?: string;
  scrollHint?: string;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const cards = buildCards(images);

  const [stage, setStage] = useState<Stage>({ width: 1440, height: 900, isMobile: false });
  useEffect(() => {
    const update = () =>
      setStage({ width: window.innerWidth, height: window.innerHeight, isMobile: window.innerWidth < 768 });
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mede diretamente a posição do palco no documento. O scroll permanece 100% nativo:
  // a cena sticky avança proporcionalmente ao percurso antes de liberar a próxima seção.
  const raw = useMotionValue(0);
  const smooth = useSpring(raw, { stiffness: 100, damping: 30, mass: 0.35, restDelta: 0.0001 });
  const still = useMotionValue(0.35);
  const progress = reduce ? still : smooth;

  useEffect(() => {
    if (reduce) return;
    const section = sectionRef.current;
    if (!section) return;
    let frame = 0;

    const measure = () => {
      frame = 0;
      const rect = section.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const distance = Math.max(1, rect.height - viewport);
      const nextProgress = Math.max(0, Math.min(1, -rect.top / distance));
      raw.set(nextProgress);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(schedule);
    resizeObserver?.observe(section);

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      resizeObserver?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [raw, reduce]);

  const pointer = useCameraParallax(!reduce && !stage.isMobile);

  // como na referência: o título cresce durante a viagem e some no final
  const copyScale = useTransform(progress, [0, 0.5, 1], [0.86, 1, 1.28]);
  const copyOpacity = useTransform(progress, [0, 0.88, 1], [1, 1, 0]);
  const copyEvents = useTransform(copyOpacity, (o) => (o < 0.2 ? "none" : "auto"));
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  return (
    <section
      id={id}
      data-ato-hero-version="scroll-v3"
      ref={sectionRef}
      aria-labelledby="hero-titulo"
      className="grain relative h-[360svh] bg-navy text-paper motion-reduce:h-[100svh]"
    >
      <div
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ perspective: stage.isMobile ? "900px" : "1200px" }}
      >
        {/* o Λ da marca, em duas linhas finas ao fundo */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path d="M260 900 L720 40 L1180 900" fill="none" stroke="var(--color-gold)" strokeOpacity="0.22" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        {/* plano 3D dos cards (decorativo para leitores de tela) */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ transformStyle: "preserve-3d" }}>
          {cards.map((card) => (
            <TunnelCard key={card.item.src} card={card} progress={progress} pointer={pointer} total={cards.length} stage={stage} />
          ))}
        </div>

        {/* texto central */}
        <motion.div
          style={reduce ? undefined : { scale: copyScale, opacity: copyOpacity, pointerEvents: copyEvents }}
          className="wrap relative z-[60] flex flex-col items-center text-center"
        >
          {/* véu neutro só atrás do texto, para manter a leitura quando um card passa por trás */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[min(110%,60rem)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(8,13,27,0.72),rgba(8,13,27,0))]"
          />
          <h1 id="hero-titulo" className="display-xl max-w-[12ch] [text-shadow:0_2px_30px_rgba(8,13,27,0.85)]">
            {titleLines.map((line, i) => (
              <span key={line} className="line">
                <motion.span
                  className="block"
                  initial={reduce ? false : { y: "112%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.4, ease: EASE, delay: 0.25 + i * 0.12 }}
                >
                  {line}
                </motion.span>
              </span>
            ))}
          </h1>
          <motion.p
            initial={reduce ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.95 }}
            className="lead mt-7 max-w-[34ch] text-mist [text-shadow:0_2px_20px_rgba(8,13,27,0.9)]"
          >
            {text}
          </motion.p>
          {actions && (
            <motion.div
              initial={reduce ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: EASE, delay: 1.1 }}
              className="mt-10 flex flex-col items-center gap-x-9 gap-y-5 sm:flex-row"
            >
              {actions}
            </motion.div>
          )}
        </motion.div>

        {/* dica de rolagem */}
        {!reduce && (
          <motion.div
            aria-hidden="true"
            style={{ opacity: hintOpacity }}
            className="pointer-events-none absolute bottom-7 z-[60] flex flex-col items-center gap-3 text-[0.875rem] text-mist"
          >
            <span>{scrollHint}</span>
            <motion.span
              className="block h-8 w-px origin-top bg-gold"
              animate={{ scaleY: [0, 1, 0], y: [0, 0, 12] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        )}
      </div>
    </section>
  );
}

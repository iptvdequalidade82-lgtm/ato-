"use client";

/**
 * ATO — hero com túnel 3D controlado pela rolagem nativa.
 *
 * O movimento é aplicado diretamente aos elementos do DOM em requestAnimationFrame.
 * Não intercepta wheel, touch ou teclado e não depende do pipeline de MotionValue.
 * A seção longa mantém a cena sticky até a viagem terminar.
 */
import { useEffect, useRef, type ReactNode } from "react";

export type TunnelImage = { src: string; srcSet?: string; title: string };

const clamp = (n: number) => Math.max(0, Math.min(1, n));

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
  const sceneRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const scene = sceneRef.current;
    const title = titleRef.current;
    if (!section || !scene || !title) return;

    const cards = Array.from(scene.querySelectorAll<HTMLElement>("[data-tunnel-card]"));
    const hint = scene.querySelector<HTMLElement>("[data-tunnel-hint]");
    const debug = scene.querySelector<HTMLElement>("[data-tunnel-debug]");
    let frame = 0;
    let mouseX = 0;
    let mouseY = 0;

    section.dataset.atoHeroRuntime = "ready";
    if (debug && new URLSearchParams(window.location.search).get("heroDebug") === "1") {
      debug.style.display = "block";
    }

    const render = () => {
      frame = 0;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = width < 768;
      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, rect.height - height);
      const scrollProgress = clamp(-rect.top / distance);
      const progress = scrollProgress;
      section.dataset.atoHeroProgress = Math.round(scrollProgress * 100).toString();

      if (debug) {
        debug.textContent = "Túnel 3D ativo · " + Math.round(scrollProgress * 100) + "% · " + cards.length + " fotos";
      }

      const titleScale = 0.89 + 0.32 * progress;
      const titleOpacity = progress < 0.8 ? 1 : clamp((1 - progress) / 0.2);
      title.style.transform = "scale(" + titleScale.toFixed(4) + ")";
      title.style.opacity = titleOpacity.toFixed(3);

      if (hint) hint.style.opacity = clamp(1 - progress * 18).toFixed(3);

      cards.forEach((card, index) => {
        const golden = index * 137.5 * (Math.PI / 180);
        const angleX = Math.cos(golden);
        const angleY = Math.sin(golden);
        const start = cards.length > 1 ? (index / (cards.length - 1)) * 0.43 : 0;
        const local = clamp((progress - start) / 0.52);
        const depth = (isMobile ? -1100 : -1650) + local * (isMobile ? 1780 : 2550);
        const opacity =
          local <= 0 ? 0 :
          local < 0.13 ? local / 0.13 :
          local > 0.87 ? (1 - local) / 0.13 :
          1;

        const x = angleX * width * (isMobile ? 0.30 : (0.25 + (index % 3) * 0.065));
        const y = angleY * height * (isMobile ? 0.23 : (0.24 + (index % 2) * 0.07));
        const px = !isMobile ? mouseX * 18 : 0;
        const py = !isMobile ? mouseY * 18 : 0;
        const rotation = (index % 2 === 0 ? 1 : -1) * (2 + (index % 5) * 1.5);
        const cardWidth = isMobile
          ? Math.max(118, Math.min(180, width * 0.38))
          : Math.max(190, Math.min(300, width * 0.21));

        card.style.width = cardWidth + "px";
        card.style.transform =
          "translate3d(calc(-50% + " + (x - px).toFixed(2) +
          "px), calc(-50% + " + (y - py).toFixed(2) +
          "px), " + depth.toFixed(2) + "px) rotateZ(" + rotation + "deg)";
        card.style.opacity = clamp(opacity).toFixed(3);
        card.style.zIndex = depth > -100 ? String(70 + index) : String(1 + index);
      });
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(render);
    };
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      mouseX = (event.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      mouseY = (event.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    window.addEventListener("pageshow", schedule);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(schedule) : null;
    observer?.observe(section);
    render();

    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("pageshow", schedule);
      window.removeEventListener("pointermove", onPointerMove);
      observer?.disconnect();
      if (frame) window.cancelAnimationFrame(frame);
      section.dataset.atoHeroRuntime = "unmounted";
    };
  }, [images]);

  return (
    <section
      id={id}
      ref={sectionRef}
      aria-labelledby="hero-titulo"
      data-ato-hero-version="scroll-v5-auto"
      className="grain relative h-[350svh] bg-navy text-paper"
    >
      <div
        ref={sceneRef}
        className="sticky top-0 flex h-[100svh] w-full items-center justify-center overflow-hidden"
        style={{ perspective: "1200px" }}
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <path d="M260 900 L720 40 L1180 900" fill="none" stroke="var(--color-gold)" strokeOpacity="0.22" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ transformStyle: "preserve-3d" }}
        >
          {images.map((item, index) => (
            <figure
              key={item.src}
              data-tunnel-card={index}
              className="pointer-events-none absolute left-1/2 top-1/2 m-0 aspect-[4/5] w-[190px] opacity-0 will-change-transform"
              style={{ transform: "translate3d(-50%, -50%, -1200px)" }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-[3px] bg-navy-2 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.75)] ring-1 ring-white/10">
                <img
                  src={item.src}
                  srcSet={item.srcSet}
                  sizes="(max-width: 767px) 40vw, 21vw"
                  alt=""
                  loading="eager"
                  decoding="async"
                  draggable={false}
                  className="h-full w-full object-cover"
                />
                <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent px-4 pb-3.5 pt-12 text-[0.875rem] font-medium text-paper sm:px-5 sm:pb-4 sm:text-[0.9375rem]">
                  {item.title}
                </figcaption>
              </div>
            </figure>
          ))}
        </div>

        <div
          ref={titleRef}
          className="wrap relative z-[60] flex flex-col items-center text-center will-change-transform"
        >
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[120%] w-[min(110%,60rem)] -translate-x-1/2 -translate-y-1/2 bg-[radial-gradient(closest-side,rgba(8,13,27,0.72),rgba(8,13,27,0))]"
          />
          <h1 id="hero-titulo" className="display-xl max-w-[12ch] [text-shadow:0_2px_30px_rgba(8,13,27,0.85)]">
            {titleLines.map((line, index) => (
              <span key={index} className="line"><span>{line}</span></span>
            ))}
          </h1>
          <p className="lead mt-7 max-w-[34ch] text-mist [text-shadow:0_2px_20px_rgba(8,13,27,0.9)]">
            {text}
          </p>
          {actions && (
            <div className="mt-10 flex flex-col items-center gap-x-9 gap-y-5 sm:flex-row">
              {actions}
            </div>
          )}
        </div>

        <div
          data-tunnel-hint=""
          aria-hidden="true"
          className="pointer-events-none absolute bottom-7 z-[60] flex flex-col items-center gap-3 text-[0.875rem] text-mist"
        >
          <span>{scrollHint}</span>
          <span className="block h-8 w-px bg-gold" />
        </div>

        <output
          data-tunnel-debug=""
          style={{ display: "none" }}
          className="absolute bottom-5 left-5 z-[100] border border-gold bg-navy px-3 py-2 text-xs text-paper"
          aria-live="off"
        />
      </div>
    </section>
  );
}

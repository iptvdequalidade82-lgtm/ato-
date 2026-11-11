"use client";

import { useEffect, useRef, useState } from "react";

type ShowcaseVideo = {
  src: string;
  label: string;
  title: string;
  duration: string;
};

const videos: ShowcaseVideo[] = [
  {
    src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KOFaksa4y4MGaZHaLLriyHBm0x/9b15170d-7fe2-4caf-918b-e72d737016b7.mp4",
    label: "CONTEÚDO 01",
    title: "Consórcio e contemplação",
    duration: "01:42",
  },
  {
    src: "https://d2ol7oe51mr4n9.cloudfront.net/user_3KOFaksa4y4MGaZHaLLriyHBm0x/93a0920f-6f16-49da-8d60-452f2363ed5c.mp4",
    label: "CONTEÚDO 02",
    title: "Planejamento em números",
    duration: "00:41",
  },
];

export default function ImpactVideoGallery() {
  const refs = useRef<Array<HTMLVideoElement | null>>([]);
  const [active, setActive] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState<number[]>([]);

  useEffect(() => {
    return () => refs.current.forEach((video) => video?.pause());
  }, []);

  const play = async (index: number) => {
    refs.current.forEach((video, i) => {
      if (i !== index) video?.pause();
    });
    const video = refs.current[index];
    if (!video) return;
    try {
      setActive(index);
      await video.play();
    } catch {
      setActive(null);
    }
  };

  return (
    <div className="relative z-10 mt-16 border-t border-white/15 pt-10 md:mt-24 md:pt-14">
      <div className="text-center">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.24em] text-gold">
          CONTEÚDOS ATO
        </p>
        <h3 className="mx-auto mt-5 max-w-[22ch] text-balance text-[clamp(1.4rem,2.8vw,2.5rem)] font-light leading-[1.2] tracking-[-0.035em] text-paper">
          Informação também faz parte de uma boa decisão.
        </h3>
        <p className="mx-auto mt-4 max-w-[46ch] text-sm leading-relaxed text-mist md:text-base">
          Assista a duas conversas sobre consórcio e planejamento.
        </p>
      </div>

      <div
        aria-label="Vídeos sobre consórcio e planejamento"
        className="mx-auto mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-6 [scrollbar-width:thin] md:mt-14 md:grid md:max-w-[790px] md:grid-cols-2 md:gap-8 md:overflow-visible md:pb-0"
      >
        {videos.map((item, index) => (
          <article key={item.src} className="group w-[min(74vw,360px)] shrink-0 snap-center md:w-full">
            <div className="relative aspect-[9/16] overflow-hidden rounded-[2px] border border-white/10 bg-navy-2 shadow-[0_22px_70px_-38px_rgba(0,0,0,0.8)]">
              <video
                ref={(node) => { refs.current[index] = node; }}
                src={item.src}
                preload="metadata"
                playsInline
                controls={active === index}
                onPlay={() => {
                  refs.current.forEach((other, i) => {
                    if (i !== index) other?.pause();
                  });
                  setActive(index);
                }}
                onEnded={() => {
                  refs.current[index]?.load();
                  setActive((current) => current === index ? null : current);
                }}
                onError={() => setUnavailable((current) => current.includes(index) ? current : [...current, index])}
                onLoadedMetadata={(event) => {
                  // Carrega um frame de prévia sem reproduzir o vídeo automaticamente.
                  const element = event.currentTarget;
                  if (element.currentTime === 0 && element.duration > 0.15) {
                    element.currentTime = 0.15;
                  }
                }}
                className="h-full w-full object-cover"
                aria-label={item.title}
              />

              {active !== index && !unavailable.includes(index) && (
                <button
                  type="button"
                  onClick={() => void play(index)}
                  className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/55 via-black/5 to-black/20 transition-colors hover:from-black/35 focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-gold"
                  aria-label={`Reproduzir: ${item.title}`}
                >
                  <span className="flex h-16 w-16 items-center justify-center rounded-full border border-white/65 bg-black/30 text-white backdrop-blur-[6px] transition-transform duration-500 group-hover:scale-110 md:h-20 md:w-20">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M8 5.5 19 12 8 18.5V5.5Z" fill="currentColor" />
                    </svg>
                  </span>
                  <span className="absolute bottom-5 left-5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-white/90">
                    ASSISTIR VÍDEO
                  </span>
                  <span className="absolute bottom-5 right-5 text-xs tabular-nums text-white/80">
                    {item.duration}
                  </span>
                </button>
              )}

              {unavailable.includes(index) && (
                <div className="absolute inset-0 flex items-center justify-center bg-navy-2 px-6 text-center text-sm text-mist" role="status">
                  Não foi possível carregar este vídeo.
                </div>
              )}
            </div>

            <div className="mt-5 flex items-start justify-between gap-3 border-t border-white/15 pt-4">
              <div>
                <span className="block text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-gold">
                  {item.label}
                </span>
                <h4 className="mt-2 text-[clamp(1rem,1.6vw,1.3rem)] font-medium tracking-[-0.02em] text-paper">
                  {item.title}
                </h4>
              </div>
              <span className="pt-1 text-[0.75rem] text-mist tabular-nums">
                0{index + 1} / 02
              </span>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-mist md:hidden">
        Deslize para explorar os vídeos
      </p>
    </div>
  );
}

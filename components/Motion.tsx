"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

/**
 * Orquestra todo o movimento da página a partir de atributos data-*.
 * Respeita prefers-reduced-motion (nada é animado) e alivia o movimento no celular.
 */
export function Motion() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    (window as unknown as { __atoMotion: boolean }).__atoMotion = true;
    const mm = gsap.matchMedia();

    mm.add(
      { motion: "(prefers-reduced-motion: no-preference)", desktop: "(min-width: 1024px)" },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        // 2. Títulos de seção: mesmas máscaras de linha, disparadas na entrada
        gsap.utils.toArray<HTMLElement>("[data-lines]").forEach((el) => {
          gsap.to(el.querySelectorAll(".line > span"), {
            y: 0,
            duration: 1.3,
            ease: "expo.out",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: "top 86%", once: true },
          });
        });

        // 3. Conteúdo: entra em grupo, com pequeno escalonamento
        gsap.set("[data-reveal]", { y: desktop ? 32 : 18 });
        ScrollTrigger.batch("[data-reveal]", {
          start: "top 90%",
          once: true,
          onEnter: (els) =>
            gsap.to(els, { y: 0, autoAlpha: 1, duration: 1.1, ease: "expo.out", stagger: 0.09, overwrite: true }),
        });

        // 4. Linhas finas que se desenham com a rolagem
        gsap.utils.toArray<SVGGeometryElement>("[data-draw]").forEach((path) => {
          gsap.fromTo(
            path,
            { strokeDasharray: 1, strokeDashoffset: 1 },
            {
              strokeDashoffset: 0,
              ease: "none",
              scrollTrigger: { trigger: path.closest("section"), start: "top 75%", end: "bottom 70%", scrub: 0.8 },
            },
          );
        });

        // 5. Parallax discreto, só em telas grandes e só em poucas imagens
        if (desktop) {
          gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((el) => {
            gsap.fromTo(
              el,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: "none",
                scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          });
        }

        return () => {
          // ao sair do contexto (ex.: reduced-motion ligado), tudo volta a ficar visível
          gsap.set("[data-reveal]", { clearProps: "all" });
          document.documentElement.classList.remove("motion");
        };
      },
    );

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);
    return () => {
      window.removeEventListener("load", onLoad);
      mm.revert();
    };
  }, []);

  return null;
}

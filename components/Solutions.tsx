"use client";

import { useState } from "react";
import { site, solutions } from "@/content/site";
import { Arrow, Picture, ext } from "./ui";

export function Solutions() {
  const [active, setActive] = useState(0);

  return (
    <section id="solucoes" className="section on-light bg-white">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <h2 data-lines className="display-lg col-span-12 lg:col-span-9">
            <span className="line">
              <span>{solutions.title}</span>
            </span>
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-12 gap-x-6 lg:mt-24">
          <ol className="col-span-12 border-t border-line lg:col-span-7">
            {solutions.items.map((item, i) => {
              const on = active === i;
              return (
                <li
                  key={item.title}
                  data-reveal
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className="group border-b border-line"
                >
                  <div className="grid grid-cols-12 gap-x-6 py-8 lg:py-12">
                    <span
                      aria-hidden="true"
                      className={`col-span-2 pt-2 text-[0.9375rem] tabular-nums transition-colors duration-500 lg:col-span-1 ${on ? "text-gold-deep" : "text-mute"}`}
                    >
                      0{i + 1}
                    </span>
                    <div className="col-span-10 lg:col-span-11">
                      <h3
                        className={`display-md transition-[transform,color] duration-700 ease-[var(--ease-expo)] lg:group-hover:translate-x-3 ${on ? "text-ink" : "lg:text-ink/60"}`}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-4 max-w-[52ch] text-mute">{item.text}</p>
                      <a
                        href={site.whatsapp}
                        {...ext(site.whatsapp)}
                        className="link mt-5 inline-flex items-center gap-3 text-[0.9375rem] font-semibold"
                        data-underlined
                        aria-label={`Conversar sobre ${item.title.toLowerCase()} no WhatsApp`}
                      >
                        {item.cta} <Arrow />
                      </a>
                      {/* No celular e no tablet a imagem acompanha cada linha */}
                      <div className="mt-8 aspect-[16/10] overflow-hidden lg:hidden">
                        <Picture
                          name={item.image}
                          alt={item.alt}
                          ratio={item.ratio}
                          sizes="(min-width: 768px) 80vw, 82vw"
                          className="h-full w-full object-cover"
                        />
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>

          {/* No desktop, um painel fixo troca a imagem conforme a linha ativa */}
          <div className="col-span-4 col-start-9 hidden lg:block" aria-hidden="true">
            <div data-reveal className="sticky top-[calc(var(--header-h)+2.5rem)]">
              <div className="relative aspect-[4/5] overflow-hidden bg-navy">
                {solutions.items.map((item, i) => (
                  <Picture
                    key={item.image}
                    name={item.image}
                    alt=""
                    ratio={item.ratio}
                    sizes="32vw"
                    className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[1100ms] ease-[var(--ease-expo)] ${
                      active === i ? "scale-100 opacity-100" : "scale-[1.06] opacity-0"
                    }`}
                  />
                ))}
              </div>
              <p className="mt-4 flex justify-between text-[0.875rem] text-mute">
                <span>{solutions.items[active].title}</span>
                <span className="tabular-nums">
                  0{active + 1} / 0{solutions.items.length}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

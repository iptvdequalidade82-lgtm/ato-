import { about, cta, hero, impact, site, team, tunnel } from "@/content/site";
import PerspectiveTunnelHero from "./ui/perspective-tunnel-hero";
import { Button, Lines, Picture, Wordmark, ext } from "./ui";

import ImpactVideoGallery from "./ImpactVideoGallery";

/* ───────────────────────── Hero (túnel em perspectiva) ───────────────────────── */
export function Hero() {
  return (
    <PerspectiveTunnelHero
      id="topo"
      images={tunnel}
      titleLines={hero.titleLines}
      actions={
        <>
          <Button href={hero.primary.href}>{hero.primary.label}</Button>
          <a href={hero.secondary.href} {...ext(hero.secondary.href)} className="link font-semibold" data-underlined>
            {hero.secondary.label}
          </a>
        </>
      }
    />
  );
}

/* ───────────────────────── Sobre ───────────────────────── */
export function About() {
  return (
    <section id="sobre" className="section on-light relative overflow-hidden bg-paper">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-6 gap-y-10">
          <h2 data-lines className="display-lg col-span-12 lg:col-span-9">
            <Lines lines={about.titleLines} />
          </h2>
        </div>

        {/* trajetória: uma linha fina que sobe em degraus, desenhada pela rolagem */}
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="mt-12 hidden h-24 w-full md:block lg:mt-20"
        >
          <path
            data-draw
          pathLength={1}
            d="M0 112 H300 L420 78 H700 L820 44 H1010 L1200 6"
            fill="none"
            stroke="var(--color-gold-deep)"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        <div className="mt-12 grid grid-cols-12 gap-x-6 gap-y-14 lg:mt-16">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <div data-reveal className="aspect-[4/5] overflow-hidden">
              <Picture
                name="planejamento"
                alt="Luz do fim de tarde entrando por uma janela e projetando linhas sobre a parede"
                ratio={[4, 5]}
                sizes="(min-width: 768px) 36vw, 92vw"
                className="h-[112%] w-full object-cover"
                data-parallax=""
              />
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-6 lg:col-start-7">
            <div className="space-y-6">
              {about.paragraphs.map((p, i) => (
                <p key={i} data-reveal className="lead max-w-[30ch]">
                  {p}
                </p>
              ))}
            </div>

            <dl className="mt-14 border-t border-line lg:mt-20">
              {about.principles.map((p) => (
                <div key={p.title} data-reveal className="grid grid-cols-12 gap-x-6 border-b border-line py-6">
                  <dt className="col-span-12 text-xl font-medium tracking-[-0.02em] sm:col-span-4">{p.title}</dt>
                  <dd className="col-span-12 mt-1 text-mute sm:col-span-8 sm:mt-0">{p.text}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── Impacto ───────────────────────── */
export function Impact() {
  return (
    <section
      aria-labelledby="impacto-titulo"
      className="grain relative isolate overflow-hidden bg-navy text-paper"
    >
      <div className="wrap relative z-10 py-[clamp(6rem,12vw,10rem)]">
        <h2
          id="impacto-titulo"
          data-lines
          className="display-xl max-w-[15ch] text-left"
        >
          <Lines lines={impact.titleLines} />
        </h2>
        <ImpactVideoGallery />
      </div>
    </section>
  );
}

/* ───────────────────────── Equipe ───────────────────────── */
const offsets = ["", "md:mt-24", "md:mt-12"];

export function Team() {
  return (
    <section id="equipe" className="section on-light bg-paper">
      <div className="wrap">
        <div className="grid grid-cols-12 gap-x-6 gap-y-6">
          <h2 data-lines className="display-lg col-span-12 lg:col-span-7">
            <span className="line">
              <span>{team.title}</span>
            </span>
          </h2>
        </div>

        <ul className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 md:grid-cols-3 lg:mt-24">
          {team.members.map((m, i) => (
            <li key={m.name} data-reveal className={`group ${offsets[i]}`}>
              <figure>
                <div className={`relative aspect-[4/5] overflow-hidden text-paper ${m.photo ? "bg-[#e6e4df]" : "grain bg-navy"}`}>
                  {m.photo ? (
                    <img
                      src={`images/equipe-${m.photo}-1200.webp`}
                      srcSet={`images/equipe-${m.photo}-600.webp 600w, images/equipe-${m.photo}-1200.webp 1200w`}
                      sizes="(min-width: 768px) 31vw, 92vw"
                      width={1200}
                      height={1500}
                      alt={`Retrato de ${m.name}, ${m.role.toLowerCase()} da ATO`}
                      loading="lazy"
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[var(--ease-expo)] group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div role="img" aria-label={`Espaço reservado para o retrato de ${m.name}`} className="absolute inset-0">
                      <svg viewBox="0 0 400 500" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                        <path d="M70 500 L250 60 L400 430" fill="none" stroke="var(--color-gold)" strokeOpacity="0.4" vectorEffect="non-scaling-stroke" />
                      </svg>
                      <span aria-hidden="true" className="absolute bottom-5 left-6 text-[clamp(4rem,9vw,8rem)] font-extralight leading-none tracking-[-0.05em]">
                        {m.initials}
                      </span>
                      <span aria-hidden="true" className="absolute right-6 top-5 text-[0.8125rem] text-mist">
                        Retrato oficial
                      </span>
                    </div>
                  )}
                </div>
                <figcaption className="mt-6">
                  <h3 className="text-[1.75rem] font-medium leading-tight tracking-[-0.03em]">{m.name}</h3>
                  <p className="mt-2 text-mute">{m.role}</p>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────────────── CTA final ───────────────────────── */
export function Cta() {
  return (
    <section id="contato" className="grain relative overflow-hidden bg-ink text-paper">
      <div className="wrap relative z-10 grid grid-cols-12 gap-x-6 py-[clamp(6rem,13vw,12rem)]">
        <h2 data-lines className="display-xl col-span-12 lg:col-span-8">
          <Lines lines={cta.titleLines} />
        </h2>
        <div className="col-span-12 mt-10 md:col-span-7 lg:col-span-5 lg:mt-16">
          <p data-reveal className="lead max-w-[38ch] text-mist">
            {cta.text}
          </p>
          <div data-reveal className="mt-10 flex flex-col items-start gap-x-9 gap-y-5 sm:flex-row sm:items-center">
            <Button href={cta.button.href}>{cta.button.label}</Button>
            <a href={site.instagram} {...ext(site.instagram)} className="link font-semibold" data-underlined>
              {site.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/9] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[30vw]">
        <Picture
          name="passo"
          alt="Escadaria iluminada degrau a degrau subindo em direção a uma passagem"
          ratio={[2, 3]}
          sizes="(min-width: 1024px) 30vw, 100vw"
          className="h-[112%] w-full object-cover"
          data-parallax=""
        />
      </div>
    </section>
  );
}

/* ───────────────────────── Footer (marca ATO lisa) ───────────────────────── */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line-inv bg-navy text-paper">
      <div className="wrap pt-[clamp(2rem,4vw,3rem)]">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className="text-[0.875rem] font-semibold tracking-[0.03em]">{site.name}</p>
            <p className="mt-2 text-[0.75rem] leading-relaxed text-mist">
              © {site.year} ATO. Todos os direitos reservados.
            </p>
          </div>

          <nav aria-label="Explorar" className="text-[0.8125rem]">
            <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-mist">Explorar</p>
            <ul className="space-y-1">
              <li><a href="#sobre" className="link">A ATO</a></li>
              <li><a href="#solucoes" className="link">Soluções</a></li>
              <li><a href="#equipe" className="link">Nossa equipe</a></li>
            </ul>
          </nav>

          <nav aria-label="Conectar" className="text-[0.8125rem]">
            <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-mist">Conectar</p>
            <ul className="space-y-1">
              <li><a href={site.whatsapp} {...ext(site.whatsapp)} className="link">WhatsApp</a></li>
              <li><a href={site.instagram} {...ext(site.instagram)} className="link">Instagram</a></li>
              <li><a href="#contato" className="link">Contato</a></li>
            </ul>
          </nav>
        </div>

        <div className="mt-9 flex justify-end border-t border-line-inv pt-4">
          <a href="#topo" className="link text-[0.6875rem] font-semibold uppercase tracking-[0.16em]">
            Voltar ao topo ↑
          </a>
        </div>
      </div>

      {/* Reutiliza exatamente a marca do cabeçalho. O corte é feito pelo contêiner,
          sem Canvas, pontilhado ou efeitos sobre as letras. */}
      <div
        className="relative mt-6 h-[clamp(6.5rem,22vw,22rem)] w-full overflow-hidden text-paper"
        aria-label="ATO"
      >
        <div className="absolute left-1/2 top-0 -translate-x-1/2">
          <Wordmark className="whitespace-nowrap text-[clamp(9rem,34vw,34rem)]" />
        </div>
      </div>
    </footer>
  );
}

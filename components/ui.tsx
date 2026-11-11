import type { ReactNode } from "react";

/** Marca tipográfica provisória. Substituir pelo arquivo original do logotipo (SVG) quando disponível. */
export function Wordmark({ className = "", weight = 500 }: { className?: string; weight?: 300 | 500 }) {
  const stroke = weight === 300 ? 6 : 9;
  return (
    <span
      aria-hidden="true"
      className={`inline-flex items-baseline leading-none tracking-[0.14em] ${className}`}
      style={{ fontWeight: weight }}
    >
      <svg viewBox="0 0 66 72" className="mr-[0.1em] h-[0.72em] w-auto overflow-hidden" focusable="false">
        <path d="M2 84 L33 9 L64 84" fill="none" stroke="currentColor" strokeWidth={stroke} strokeMiterlimit={10} />
      </svg>
      TO
    </span>
  );
}

export function Arrow() {
  return (
    <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true" focusable="false">
      <path d="M0 6h20M15 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

const isExternal = (href: string) => href.startsWith("http");
export const ext = (href: string) => (isExternal(href) ? { target: "_blank", rel: "noopener noreferrer" } : {});

export function Button({
  href,
  children,
  tone = "light",
  className = "",
}: {
  href: string;
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <a href={href} {...ext(href)} className={`btn ${tone === "light" ? "btn-light" : "btn-dark"} ${className}`}>
      {children}
      <Arrow />
    </a>
  );
}

/** Imagem responsiva pré-otimizada (webp em 2 larguras, geradas por scripts/images.mjs). */
export function Picture({
  name,
  alt,
  ratio,
  sizes,
  priority = false,
  className = "",
  ...rest
}: {
  name: string;
  alt: string;
  ratio: readonly [number, number];
  sizes: string;
  priority?: boolean;
  className?: string;
  [key: `data-${string}`]: string | undefined;
}) {
  return (
    <img
      src={`images/${name}-1600.webp`}
      srcSet={`images/${name}-800.webp 800w, images/${name}-1600.webp 1600w`}
      sizes={sizes}
      width={1600}
      height={Math.round((1600 * ratio[1]) / ratio[0])}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}

/** Título em linhas com máscara, para o reveal vertical. */
export function Lines({ lines, hero = false }: { lines: readonly string[]; hero?: boolean }) {
  return (
    <>
      {lines.map((l) => (
        <span key={l} className="line" {...(hero ? { "data-hero-line": "" } : {})}>
          <span>{l}</span>
        </span>
      ))}
    </>
  );
}

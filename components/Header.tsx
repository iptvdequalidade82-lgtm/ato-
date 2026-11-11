"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { Wordmark, ext } from "./ui";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 text-paper transition-[background-color,border-color] duration-500 ${
        solid ? "border-b border-line-inv bg-navy" : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="wrap flex h-[var(--header-h)] items-center justify-between">
        <a href="#topo" className="flex items-baseline gap-3" onClick={() => setOpen(false)}>
          <Wordmark className="text-[1.7rem]" />
          <span className="sr-only">{site.name}, voltar ao início</span>
          <span aria-hidden="true" className="hidden text-[0.8125rem] text-mist sm:inline">
            Investimentos &amp; Consórcios
          </span>
        </a>

        <nav aria-label="Principal" className="hidden items-center gap-10 lg:flex">
          {nav.map((n) => (
            <a key={n.href} href={n.href} className="link text-[0.9375rem]">
              {n.label}
            </a>
          ))}
          <a
            href={site.whatsapp}
            {...ext(site.whatsapp)}
            className="ml-2 inline-flex min-h-11 items-center border border-paper/40 px-5 text-[0.9375rem] font-semibold transition-colors duration-500 hover:border-paper hover:bg-paper hover:text-navy"
          >
            Fale conosco
          </a>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="-mr-2 flex min-h-11 items-center gap-3 px-2 text-[0.9375rem] font-semibold lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Fechar" : "Menu"}
          <span aria-hidden="true" className="relative block h-3 w-6">
            <span
              className={`absolute inset-x-0 top-0 h-px bg-current transition-transform duration-500 ${open ? "translate-y-[5.5px] rotate-45" : ""}`}
            />
            <span
              className={`absolute inset-x-0 bottom-0 h-px bg-current transition-transform duration-500 ${open ? "-translate-y-[5.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </div>

      <div
        id="menu-mobile"
        hidden={!open}
        className="fixed inset-x-0 bottom-0 top-[var(--header-h)] overflow-y-auto bg-navy lg:hidden"
      >
        <nav aria-label="Menu" className="wrap flex min-h-full flex-col justify-between pb-10 pt-10">
          <ul>
            {nav.map((n) => (
              <li key={n.href} className="border-b border-line-inv">
                <a href={n.href} onClick={() => setOpen(false)} className="display-lg block py-5">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-12 flex flex-col gap-5">
            <a href={site.whatsapp} {...ext(site.whatsapp)} className="btn btn-light justify-between">
              Conversar no WhatsApp
              <svg width="22" height="12" viewBox="0 0 22 12" fill="none" aria-hidden="true">
                <path d="M0 6h20M15 1l5 5-5 5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </a>
            <a href={site.instagram} {...ext(site.instagram)} className="text-mist">
              Instagram {site.instagramHandle}
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}

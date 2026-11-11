import { Header } from "@/components/Header";
import { Motion } from "@/components/Motion";
import { About, Cta, Footer, Hero, Impact, Team } from "@/components/Sections";
import { Solutions } from "@/components/Solutions";

export default function Page() {
  return (
    <>
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:bg-paper focus:px-4 focus:py-3 focus:text-navy"
      >
        Pular para o conteúdo
      </a>
      <Header />
      <main id="conteudo">
        <Hero />
        <About />
        <Solutions />
        <Impact />
        <Team />
        <Cta />
      </main>
      <Footer />
      <Motion />
    </>
  );
}

// Todo o conteúdo editável do site fica aqui.
// Textos são provisórios (conceito) e podem ser revisados sem tocar nos componentes.

export const site = {
  name: "ATO Investimentos & Consórcios",
  shortName: "ATO",
  description:
    "Consórcios e planejamento financeiro com atendimento próximo. Converse com a equipe da ATO e transforme seus próximos objetivos em conquistas reais.",
  // Canais confirmados no Instagram oficial (@atoinvestimentos)
  whatsapp: "https://wa.me/message/XJRFQOBKHACWD1",
  instagram: "https://www.instagram.com/atoinvestimentos/",
  instagramHandle: "@atoinvestimentos",
  year: 2026,
};

export const nav = [
  { label: "A ATO", href: "#sobre" },
  { label: "Soluções", href: "#solucoes" },
  { label: "Equipe", href: "#equipe" },
  { label: "Contato", href: "#contato" },
];

export const hero = {
  titleLines: ["Seu futuro merece", "um plano à altura."],
  primary: { label: "Conheça a ATO", href: "#sobre" },
  secondary: { label: "Fale com nossa equipe", href: site.whatsapp },
};

// Fotos do túnel da primeira dobra: objetivos que dá para planejar com consórcio
export const tunnel = [
  { key: "casa", title: "A casa própria" },
  { key: "carro", title: "O carro novo" },
  { key: "apartamento", title: "O apartamento" },
  { key: "caminhao", title: "O caminhão da frota" },
  { key: "terreno", title: "O terreno" },
  { key: "reforma", title: "A reforma" },
  { key: "agro", title: "O maquinário do campo" },
  { key: "chaves", title: "As chaves na mão" },
].map(({ key, title }) => ({
  title,
  src: `images/tunel-${key}-800.webp`,
  srcSet: `images/tunel-${key}-480.webp 480w, images/tunel-${key}-800.webp 800w`,
}));

export const about = {
  titleLines: ["Mais do que planejar.", "É construir possibilidades."],
  paragraphs: [
    "Intenção só vira realidade com um plano. Cada conversa começa pelo que você quer conquistar.",
  ],
  principles: [
    {
      title: "Clareza",
      text: "Tudo explicado antes de assinar.",
    },
    {
      title: "Precisão",
      text: "Um plano feito para o seu objetivo.",
    },
    {
      title: "Proximidade",
      text: "Atendimento direto, do início ao fim.",
    },
  ],
};

export const solutions = {
  title: "Soluções para cada etapa do seu plano.",
  items: [
    {
      title: "Consórcios",
      text: "Conquiste bens de maior valor com planejamento.",
      cta: "Conversar",
      image: "consorcios",
      alt: "Fachada de uma casa contemporânea iluminada ao entardecer",
      ratio: [3, 2],
    },
    {
      title: "Planejamento financeiro",
      text: "Objetivos e prioridades em ordem.",
      cta: "Conversar",
      image: "planejamento",
      alt: "Luz do fim de tarde atravessando uma janela e desenhando linhas na parede de um escritório",
      ratio: [4, 5],
    },
    {
      // Oferta a confirmar com a ATO antes da versão final.
      title: "Investimentos",
      text: "O próximo passo para o seu patrimônio.",
      cta: "Conversar",
      image: "investimentos",
      alt: "Edifício de tijolos escuros visto de baixo contra o céu claro",
      ratio: [2, 3],
    },
  ],
} as const;

export const impact = {
  titleLines: ["Grandes conquistas", "começam com", "boas decisões."],
};

export const team = {
  title: "Quem cuida do seu plano.",
  // Cargos e retratos conforme o Instagram oficial. `photo` = nome base em public/images/equipe-<photo>-{600,1200}.webp
  members: [
    {
      name: "Aline Toledo",
      role: "Gestora da ATO Investimentos",
      initials: "AT",
      photo: "aline" as string | null,
    },
    {
      name: "Liliane Schmidt",
      role: "Consultora de negócios",
      initials: "LS",
      photo: "liliane" as string | null,
    },
    {
      name: "Maria Eduarda",
      role: "Assistente de escritório",
      initials: "ME",
      photo: "maria" as string | null,
    },
  ],
};

export const cta = {
  titleLines: ["O próximo passo", "começa com", "uma conversa."],
  text: "Conte o que você quer conquistar. A gente mostra o caminho.",
  button: { label: "Conversar com a ATO", href: site.whatsapp },
};

# ATO Investimentos & Consórcios — landing page (conceito)

Projeto conceito da Brandify. Next.js (App Router) + TypeScript + Tailwind CSS v4 + GSAP/ScrollTrigger.

## Rodar
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # gera o site estático em /out (pronto para Vercel ou qualquer hospedagem)
```

## Onde mexer
- `content/site.ts` — todos os textos, links (WhatsApp, Instagram) e a equipe.
- `app/globals.css` — tokens de cor, tipografia e espaçamento (`@theme`).
- `components/Motion.tsx` — todas as animações (respeita `prefers-reduced-motion`).
- `scripts/images.mjs` — otimização das fotos de `/raw` para `/public/images` (`npm run images`).

## Pendências antes de publicar de verdade
- Logotipo original (SVG) no lugar da marca tipográfica provisória (`components/ui.tsx`, `Wordmark`).
- Retratos oficiais da equipe: salvar em `public/images/` e preencher `photo` em `content/site.ts`.
- Confirmar com a ATO: oferta de investimentos, textos institucionais e cargos.
- Dados legais no rodapé (razão social, CNPJ), Política de Privacidade e Termos de Uso.
- Cores e fonte são aproximações visuais do Instagram, não valores oficiais da marca.

Lenis não foi usado: a rolagem nativa ficou mais natural e acessível.

## Hero em túnel (framer-motion)
- Componente: `components/ui/perspective-tunnel-hero.tsx` (pasta padrão do shadcn para componentes de UI).
- Fotos e legendas: `tunnel` em `content/site.ts`; arquivos em `public/images/tunel-*`.
- O túnel avança com a rolagem da página (não bloqueia a roda do mouse) e fica estático com `prefers-reduced-motion`.
- Dependência: `framer-motion`. O projeto não usa o CLI do shadcn; se quiser adotar, rode `npx shadcn@latest init` e mantenha `components/ui`.

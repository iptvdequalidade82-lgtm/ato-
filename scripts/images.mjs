// Gera as versões otimizadas (webp, 2 larguras) a partir de /raw.
import sharp from "sharp";
const navy = { r: 92, g: 108, b: 150 };
// duas passagens: primeiro tons de cinza, depois o tom azul-marinho
const mono = (s, brightness = 1) => s.modulate({ saturation: 0, brightness }).tint(navy);
const jobs = [
  ["cta", "hero", (s) => mono(s).modulate({ brightness: 0.8 })],
  ["hero", "impacto", (s) => mono(s.rotate(270), 1.15)],
  ["sobre", "passo", (s) => mono(s).modulate({ brightness: 0.9 })],
  ["planejamento", "planejamento", (s) => s.modulate({ saturation: 0.75 })],
  ["consorcios", "consorcios", (s) => s.modulate({ saturation: 0.7, brightness: 0.92 })],
  ["investimentos", "investimentos", (s) => mono(s)],
];
for (const [src, out, grade] of jobs)
  for (const w of [800, 1600])
    await grade(sharp(await sharp(`raw/${src}.jpg`).resize({ width: w * 1.5 | 0 }).toColourspace('srgb').toBuffer())).resize({ width: w }).webp({ quality: 74 }).toFile(`public/images/${out}-${w}.webp`);
console.log("ok");

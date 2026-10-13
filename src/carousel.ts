// Carrossel de Instagram (1080x1350, 4:5). Edita aqui os textos e as fotos de cada slide.
import {FACTS, PROMPT} from "./facts";

export const W = 1080;
export const H = 1350;
export const HANDLE = "@runwithbroto_";

export type FactSlide = {
  kind: "fact"; kicker: string; chapter: string; title: string; body: string; photo: string; cut?: string; pos: string;
  accent: string; night?: boolean; shift?: number; diagram?: "hybrid" | "night"; stat?: {text: string; stamp?: boolean; led?: boolean; ribbon?: boolean};
};
export type Slide = {kind: "cover"; prompt: string; photo: string; pos: string} | FactSlide | {kind: "cta"};

const BRAND = "#fabb00";
// foto / recorte / enquadramento de cada facto (mesma ordem de FACTS em facts.ts)
const LOOK = [
  {pos: "49% 50%", shift: 170}, {pos: "28% 50%"}, {pos: "50% 60%"}, {pos: "50% 0%", shift: 290, diagram: "night"}, {pos: "50% 60%", diagram: "hybrid"}, {pos: "50% 50%"}, {pos: "50% 40%"}, {pos: "50% 0%"},
];
const STAT = [undefined, undefined, undefined, undefined, undefined, {text: "+2500", led: true}, {text: "+1 000", ribbon: true}, {text: "25 JUN", stamp: true}];

export const SLIDES: Slide[] = [
  {kind: "cover", prompt: PROMPT, photo: "photos/cover.jpg", pos: "50% 0%"},
  ...FACTS.map((f, i): FactSlide => ({
    kind: "fact", kicker: f.kicker, chapter: f.chapter, title: f.title, body: f.body, photo: f.photo, cut: f.cut, pos: LOOK[i].pos, night: (LOOK[i] as {night?: boolean}).night, shift: (LOOK[i] as {shift?: number}).shift, diagram: (LOOK[i] as {diagram?: "hybrid" | "night"}).diagram,
    accent: f.accent ?? BRAND, stat: STAT[i],
  })),
  {kind: "cta"},
];

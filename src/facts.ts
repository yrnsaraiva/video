// Edita aqui o texto de cada cena. Fotos: public/photos/01.jpg ... 07.jpg (9:16, 1080x1920 ou maior).
export const PROMPT = "Gemini, diz-me os factos mais interessantes sobre o RUNWITHBROTO.";

// Cada facto tem a sua própria linguagem de animação (storytelling):
//   chapter: rótulo do capítulo       accent: cor do capítulo (destaques, contador, faixa)
//   anim:    como o título entra      deco:   elemento próprio da cena
//   stat:    {to: 2500, prefix: "+"} contador  |  {text: "25 JUN"} carimbo
//   route:   ["MAPUTO", "MATOLA"] rota no topo |  badge: selo giratório
//   cut:     PNG recortado (mesmo tamanho da foto) para o número gigante ficar atrás do sujeito
export type Anim = "slideUp" | "words" | "wipeX" | "slideX" | "zoom" | "drop";
export type Deco = "pack" | "dots" | "sun" | "steam";
export type Fact = {
  kicker: string; chapter: string; title: string; body: string; photo: string; pos?: string; video?: string; cut?: string;
  accent?: string; anim: Anim; deco?: Deco;
  stat?: {to?: number; prefix?: string; text?: string};
  route?: [string, string];
  badge?: {center: string; ring: string};
};

export const FACTS: Fact[] = [
  {kicker: "FACTO 01", chapter: "A ORIGEM", anim: "slideUp", title: "Nasceu em\nMaputo.\nChegou à Matola.", body: "A comunidade saiu de Maputo e levou a corrida a novas ruas.", photo: "photos/02.jpg", cut: "photos/02-cut.png", pos: "52% 50%", route: ["MAPUTO", "MATOLA"]},
  {kicker: "FACTO 02", chapter: "O LEMA", anim: "words", deco: "pack", title: "Ninguém fica\npara trás.", body: "We run together. We grow together. A consistência vence a motivação. E a rua é para todos.", photo: "photos/03.jpg", cut: "photos/03-cut.png"},
  {kicker: "FACTO 03", chapter: "A COMUNIDADE", anim: "wipeX", deco: "dots", title: "membros\nactivos.", body: "Eventos chegam a ter mais de 1 000 inscrições numa única semana.", photo: "photos/04.jpg", stat: {to: 2500, prefix: "+"}},
  {kicker: "FACTO 04", chapter: "AS CAUSAS", anim: "slideX", accent: "#ff5fa2", title: "inscritos no\nOutubro Rosa.", body: "Uma corrida para conscientizar sobre a prevenção do câncer de mama.", photo: "photos/05.jpg", stat: {to: 1000, prefix: "+"}},
  {kicker: "FACTO 05", chapter: "A LIBERDADE", anim: "zoom", accent: "#ff8a1f", deco: "sun", title: "Ao amanhecer.", body: "No Dia da Independência, centenas de pessoas correm juntas, celebrando a liberdade em movimento.", photo: "photos/06.jpg", cut: "photos/06-cut.png", stat: {text: "25 JUN"}},
  {kicker: "FACTO 06", chapter: "O CONVÍVIO", anim: "drop", accent: "#e0a458", deco: "steam", title: "Depois do 5 km,\nvem o café.", body: "As Coffee Parties juntam corrida descontraída, pequeno-almoço e convívio.", photo: "photos/07.jpg", video: "videos/07.mp4", badge: {center: "5KM", ring: "COFFEE PARTY • COFFEE PARTY • "}},
];

export const FPS = 30;
export const INTRO = 150;
export const FACT_LEN = 120;
export const OUTRO = 120;
export const TOTAL = INTRO + FACT_LEN * FACTS.length + OUTRO;

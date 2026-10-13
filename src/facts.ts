// Edita aqui o texto de cada cena. Fotos: public/photos/01.jpg ... 07.jpg (9:16, 1080x1920 ou maior).
export const PROMPT = "Gemini, diz-me os factos mais interessantes sobre o RUNWITHBROTO.";

// Elementos animados opcionais de cada facto:
//   stat:  {to: 2500, prefix: "+"}  contador a subir   |  {text: "25 JUN"}  carimbo
//   route: ["MAPUTO", "MATOLA"]     rota animada no topo
//   badge: "5 KM"                    selo giratório (texto central) com badgeRing a rodar à volta
export type Fact = {
  kicker: string; title: string; body: string; photo: string; pos?: string; video?: string;
  stat?: {to?: number; prefix?: string; text?: string};
  route?: [string, string];
  badge?: {center: string; ring: string};
};

export const FACTS: Fact[] = [
  {kicker: "FACTO 01", title: "Nasceu em\nMaputo.\nChegou à Matola.", body: "A comunidade saiu de Maputo e levou a corrida a novas ruas.", photo: "photos/02.jpg", pos: "52% 50%", route: ["MAPUTO", "MATOLA"]},
  {kicker: "FACTO 02", title: "Ninguém fica\npara trás.", body: "We run together. We grow together. A consistência vence a motivação. E a rua é para todos.", photo: "photos/03.jpg"},
  {kicker: "FACTO 03", title: "membros\nactivos.", body: "Eventos chegam a ter mais de 1 000 inscrições numa única semana.", photo: "photos/04.jpg", stat: {to: 2500, prefix: "+"}},
  {kicker: "FACTO 04", title: "inscritos no\nOutubro Rosa.", body: "Uma corrida para conscientizar sobre a prevenção do câncer de mama.", photo: "photos/05.jpg", stat: {to: 1000, prefix: "+"}},
  {kicker: "FACTO 05", title: "Ao amanhecer.", body: "No Dia da Independência, centenas de pessoas correm juntas, celebrando a liberdade em movimento.", photo: "photos/06.jpg", stat: {text: "25 JUN"}},
  {kicker: "FACTO 06", title: "Depois do 5 km,\nvem o café.", body: "As Coffee Parties juntam corrida descontraída, pequeno-almoço e convívio.", photo: "photos/07.jpg", video: "videos/07.mp4", badge: {center: "5KM", ring: "COFFEE PARTY • COFFEE PARTY • "}},
];

export const FPS = 30;
export const INTRO = 150;
export const FACT_LEN = 120;
export const OUTRO = 120;
export const TOTAL = INTRO + FACT_LEN * FACTS.length + OUTRO;

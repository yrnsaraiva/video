# RUNWITHBROTO · motion video (Remotion)

Vídeo vertical 1080x1920 · 30 fps · 33 s: pergunta à IA → 6 factos animados → fecho com logo.

```bash
npm install
npm run dev      # Remotion Studio (pré-visualização ao vivo)
npm run build    # gera out/rwb-facts.mp4
```

## Editar
- **Textos e elementos de cada facto:** `src/facts.ts` (pergunta, título, texto, foto, duração `FACT_LEN`).
  Elementos opcionais por facto: `stat` (contador `{to: 2500, prefix: "+"}` ou carimbo `{text: "25 JUN"}`),
  `route` (rota animada A→B) e `badge` (selo giratório).
- **Efeito de profundidade:** `cut: "photos/NN-cut.png"` num facto (PNG recortado, do mesmo tamanho da foto) põe o número gigante atrás do sujeito. Os recortes foram feitos localmente com `@imgly/background-removal-node`.
- **Fotos/vídeos:** `public/photos/02…07.jpg` (cenas dos factos), `public/videos/01.mp4` (fundo da abertura),
  `public/videos/07.mp4` (fundo do facto 6). Vídeos devem ser H.264/SDR (converter HEVC/HDR com ffmpeg antes).
- **Transições entre cenas:** `KINDS` em `src/RWBFacts.tsx` (`wipe`, `stripes`, `iris`, `slats`); código em `src/Transitions.tsx`.
- **Elementos (faixa, selo, contador, faíscas, barra de progresso):** `src/Elements.tsx`.
- **Texto da faixa deslizante:** constante `TICKER` em `src/RWBFacts.tsx`.

Marca: amarelo `#fabb00`, tinta `#0b0b0b`, Oswald + Inter (fontes locais em `public/fonts`).

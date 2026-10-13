# RUNWITHBROTO · carrossel de Instagram (Remotion)

10 slides em **1080×1350 (4:5)**, prontos a publicar em `carousel/slide-1.jpg … slide-10.jpg`:
capa (pergunta à IA) → 8 factos → convite final.

```bash
npm install
npm run dev                                   # Remotion Studio: composição "Carousel" (muda o "index" 0–9)
# renderizar um slide (index 0 = capa … 9 = fecho):
npx remotion still Carousel carousel/slide-1.jpg --props='{"index":0}' --image-format=jpeg --jpeg-quality=95
```

## Editar o carrossel
- **Textos dos factos:** `src/facts.ts` (`title`, `body`, `chapter`, `accent`).
- **Fotos, enquadramento (`pos`), contadores e `HANDLE`:** `src/carousel.ts`. Fotos em `public/photos/`;
  o recorte (`cut`, PNG do mesmo tamanho da foto) põe o número gigante atrás do sujeito.
- **Desenho dos slides** (capa, factos, fecho, cabeçalho e rodapé): `src/Carousel.tsx`.

---
*Abaixo: o projeto anterior, em vídeo (composição `RWBFacts`), mantido no histórico.*

# RUNWITHBROTO · motion video (Remotion)

Vídeo vertical 1080x1920 · 30 fps · 33 s: pergunta à IA → 6 factos animados → fecho com logo.

```bash
npm install
npm run dev      # Remotion Studio (pré-visualização ao vivo)
npm run build    # gera out/rwb-facts.mp4
```

## Editar
- **Cada facto é um "capítulo"** em `src/facts.ts`: texto (`title`, `body`), rótulo (`chapter`), cor (`accent`),
  animação do título (`anim`: `slideUp`, `words`, `wipeX`, `slideX`, `zoom`, `drop`) e elemento próprio (`deco`: `pack`, `dots`, `sun`, `steam`).
  Opcionais: `stat` (contador `{to: 2500, prefix: "+"}` ou carimbo `{text: "25 JUN"}`), `route` (rota A→B), `badge` (selo giratório),
  `cut` (PNG recortado do mesmo tamanho da foto: o número gigante fica atrás do sujeito).
- **Transições feitas à medida** (`src/Transitions.tsx`, lista `KINDS` em `src/RWBFacts.tsx`): `sparkle` (estrela da IA), `track` (raias de pista),
  `dots` (multidão), `burst` (explosão rosa), `sunrise` (sol), `coffee` (café), `checker` (linha de meta).
- **Fotos/vídeos:** `public/photos/02…07.jpg`, `public/videos/01.mp4` (abertura), `public/videos/07.mp4` (facto 6). Vídeos em H.264/SDR
  (converter HEVC/HDR com ffmpeg antes). Recortes: `@imgly/background-removal-node` (offline) ou `remove_background` do Higgsfield.
- **Elementos** (faixa, selo, contador, grelha de pontos, sol, vapor): `src/Elements.tsx`. Texto da faixa: constante `TICKER` em `src/RWBFacts.tsx`.

Marca: amarelo `#fabb00`, tinta `#0b0b0b`, Oswald + Inter (fontes locais em `public/fonts`).

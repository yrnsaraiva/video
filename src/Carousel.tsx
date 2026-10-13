import React from "react";
import {AbsoluteFill, Freeze, Img, OffthreadVideo, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BRAND, INK, INTER, OSWALD} from "./theme";
import {FACTS} from "./facts";
import {FactSlide, H, HANDLE, SLIDES, W} from "./carousel";

const PAD = 64;
const TOTAL = SLIDES.length;

// Paleta original do Gemini
const G_BLUE = "#4285f4", G_PURPLE = "#9b72cb", G_RED = "#d96570";
const G_GRAD = `linear-gradient(90deg, ${G_BLUE} 0%, ${G_PURPLE} 55%, ${G_RED} 100%)`;

const Sparkle: React.FC<{size: number; rotate?: number}> = ({size, rotate = 0}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${rotate}deg)`}}>
    <defs>
      <linearGradient id="gem" x1="0" y1="1" x2="1" y2="0">
        <stop offset="0" stopColor={G_BLUE} /><stop offset=".55" stopColor={G_PURPLE} /><stop offset="1" stopColor={G_RED} />
      </linearGradient>
    </defs>
    <path d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0Z" fill="url(#gem)" />
  </svg>
);


const CAPTION = (n: number): {t: string; hl?: boolean}[] => [
  {t: "Aqui estão "}, {t: `${n} factos`, hl: true}, {t: " sobre o "}, {t: "RUNWITHBROTO", hl: true}, {t: ". Desliza para descobrir."},
];
const sliceSegs = (segs: {t: string; hl?: boolean}[], n: number) => {
  const out: {t: string; hl?: boolean}[] = [];
  let left = n;
  for (const g of segs) { if (left <= 0) break; out.push({t: g.t.slice(0, left), hl: g.hl}); left -= g.t.length; }
  return out;
};

/** Capa: conversa com a IA (pergunta → a pensar → resposta). `still` mostra o estado final. */
const CoverChat: React.FC<{prompt: string; photo: string; pos: string; still?: boolean}> = ({prompt, photo, pos, still}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const CLIP = 184; // congela no sorriso (~6,1 s), antes de ele sair de quadro
  const f = still ? 9999 : frame;
  // Sincronizado com o clipe: ele "escreve" no relógio de ~0,8 s a ~5,6 s e começa a sorrir aos ~6,0 s (frame 180)
  const enter = spring({frame: f - 14, fps, config: {damping: 15, stiffness: 120}});
  const typed = Math.floor(interpolate(f, [26, 156], [0, prompt.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const sent = f >= 160;
  const press = interpolate(f, [160, 165, 174], [1, 0.86, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const pulse = !sent && f > 142 ? 1 + 0.08 * Math.sin((f - 142) * 0.5) : 1;
  const ring = interpolate(f, [160, 180], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const caret = !sent && typed < prompt.length && Math.floor(f / 10) % 2 === 0;
  const think = f >= 164 && f < 180;
  const respIn = interpolate(f, [164, 174], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const caption = CAPTION(FACTS.length);
  const capLen = caption.reduce((n, g) => n + g.t.length, 0);
  const capTyped = Math.floor(interpolate(f, [180, 245], [0, capLen], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const zoom = still ? 1.05 : interpolate(frame, [0, 300], [1, 1.05], {extrapolateRight: "clamp"});
  const shade = still ? 1 : interpolate(f, [10, 40], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const parts = prompt.slice(0, still ? prompt.length : typed).split(/(Gemini,|factos mais interessantes|RUNWITHBROTO)/);
  return (
    <AbsoluteFill style={{background: INK}}>
      <AbsoluteFill style={{transform: `scale(${zoom})`}}>
        {still ? (
          <Img src={staticFile(photo)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: pos}} />
        ) : (
          <Freeze frame={Math.min(frame, CLIP)}>
            <OffthreadVideo src={staticFile("videos/01.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: pos}} />
          </Freeze>
        )}
      </AbsoluteFill>
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,11,11,0.5) 0%, rgba(11,11,11,0) 26%, rgba(11,11,11,0) 70%, rgba(11,11,11,0.6) 100%)"}} />
      <AbsoluteFill style={{opacity: shade, background: "linear-gradient(180deg, rgba(11,11,11,0.9) 0%, rgba(11,11,11,0.84) 40%, rgba(11,11,11,0.6) 55%, rgba(11,11,11,0.06) 72%, rgba(11,11,11,0) 100%)"}} />

      {/* a pergunta */}
      <div style={{position: "absolute", left: PAD, right: PAD, top: 150, opacity: enter, transform: `translateY(${(1 - enter) * -60}px)`}}>
        <div style={{background: "rgba(14,14,16,0.96)", borderRadius: 64, padding: "50px 52px 42px", minHeight: 330,
          boxShadow: "0 0 0 2px rgba(255,255,255,0.16), 0 0 70px rgba(66,133,244,0.28)"}}>
          <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 56, lineHeight: 1.25, color: "#dcdcde", minHeight: 210}}>
            {parts.map((p, i) => p === "Gemini," || p === "factos mais interessantes" || p === "RUNWITHBROTO"
              ? <b key={i} style={{fontWeight: 700, color: "#fff"}}>{p}</b> : <span key={i}>{p}</span>)}
            {caret && <span style={{display: "inline-block", width: 5, height: 56, background: G_BLUE, marginLeft: 6, verticalAlign: "middle"}} />}
          </div>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Sparkle size={60} />
            <div style={{position: "relative"}}>
              <div style={{position: "absolute", inset: 0, borderRadius: 44, border: `4px solid ${G_BLUE}`, opacity: sent && ring < 1 ? 1 - ring : 0, transform: `scale(${1 + ring * 1.7})`}} />
              <div style={{width: 88, height: 88, borderRadius: 44, background: G_BLUE, display: "grid", placeItems: "center", transform: `scale(${sent ? press : pulse})`}}>
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* a resposta */}
      <div style={{position: "absolute", left: PAD + 8, right: PAD, top: 566, display: "flex", gap: 26, alignItems: "flex-start", opacity: respIn, transform: `translateY(${(1 - respIn) * 24}px)`}}>
        <div style={{flex: "none", marginTop: 8}}><Sparkle size={64} rotate={think ? f * 9 : 0} /></div>
        {think ? (
          <div style={{display: "flex", gap: 16, marginTop: 30}}>
            {[0, 1, 2].map((i) => <div key={i} style={{width: 20, height: 20, borderRadius: 10, background: G_GRAD, transform: `translateY(${-Math.abs(Math.sin((f - i * 4) * 0.35)) * 20}px)`}} />)}
          </div>
        ) : (
          <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 54, lineHeight: 1.3, color: "#ececee"}}>
            {sliceSegs(caption, still ? capLen : capTyped).map((g, i) => g.hl
              ? <b key={i} style={{fontWeight: 700, backgroundImage: G_GRAD, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent"}}>{g.t}</b>
              : <span key={i}>{g.t}</span>)}
          </div>
        )}
      </div>
      <Img src={staticFile("wordmark-yellow.png")} style={{position: "absolute", left: PAD, top: 56, height: 46}} />
    </AbsoluteFill>
  );
};

/** Lua e estrelas para o capítulo da Night Run. */
const Moon: React.FC = () => (
  <svg width="1080" height="1350" viewBox="0 0 1080 1350" style={{position: "absolute", inset: 0}}>
    {[[180, 220, 4], [320, 160, 3], [520, 250, 3], [640, 190, 4], [760, 330, 3], [900, 470, 3], [120, 400, 3], [430, 120, 3]].map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill="#fff" opacity={0.8} />)}
    <defs><mask id="moonMask"><rect width="1080" height="1350" fill="#fff" /><circle cx="915" cy="232" r="80" fill="#000" /></mask></defs>
    <circle cx="880" cy="250" r="86" fill="#eef4ff" mask="url(#moonMask)" />
  </svg>
);

/** Ilustração: várias partidas históricas → uma só chegada (Fortaleza). Versão limpa. */
const HybridDiagram: React.FC = () => {
  const ROUTES = [
    {color: BRAND, n: "1", pts: [[150, 150], [150, 262], [330, 292], [452, 330]], label: ["Estátua", "Eduardo Mondlane"], x: 150},
    {color: "#ffffff", n: "2", pts: [[476, 132], [476, 205], [476, 268], [476, 326]], label: ["Praça", "da OMM"], x: 476},
    {color: "#ff8a1f", n: "3", pts: [[802, 150], [802, 262], [622, 292], [500, 330]], label: ["Destacamento", "Feminino"], x: 802},
  ];
  return (
    <svg width="952" height="470" viewBox="0 0 952 470" style={{position: "absolute", left: PAD, top: 128, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7))"}}>
      {ROUTES.map((r, i) => {
        const [a, b, c, d] = r.pts;
        const path = `M${a[0]},${a[1]} C${b[0]},${b[1]} ${c[0]},${c[1]} ${d[0]},${d[1]}`;
        return (
          <g key={i}>
            <path d={path} fill="none" stroke={r.color} strokeWidth="6" strokeLinecap="round" strokeDasharray="1 15" />
            <circle cx={a[0]} cy={a[1] - 12} r="24" fill={r.color} />
            <text x={a[0]} y={a[1] - 1} textAnchor="middle" fontFamily={OSWALD} fontWeight={700} fontSize="32" fill={INK}>{r.n}</text>
            <text x={r.x} y={48} textAnchor="middle" fontFamily={OSWALD} fontWeight={500} fontSize="28" letterSpacing="3" fill="#fff">{r.label[0].toUpperCase()}</text>
            <text x={r.x} y={80} textAnchor="middle" fontFamily={OSWALD} fontWeight={500} fontSize="28" letterSpacing="3" fill="#fff">{r.label[1].toUpperCase()}</text>
          </g>
        );
      })}
      <g transform="translate(416 332)">
        <line x1="60" y1="-34" x2="60" y2="6" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
        <polygon points="60,-34 96,-22 60,-10" fill="#fff" />
        {[0, 26, 52, 78, 104].map((x) => <rect key={x} x={x} y="4" width="16" height="18" fill={BRAND} />)}
        <rect x="0" y="20" width="120" height="62" rx="4" fill={BRAND} />
        <path d="M46 82 V56 a14 14 0 0 1 28 0 V82 Z" fill={INK} />
      </g>
      <text x="476" y="450" textAnchor="middle" fontFamily={OSWALD} fontWeight={700} fontSize="36" letterSpacing="8" fill="#fff">FORTALEZA</text>
    </svg>
  );
};

/** Ilustração da Night Run: o caracol, a quinta-feira da semana e a lua. */
const spiral = (cx: number, cy: number, turns: number, b: number) => {
  let d = "";
  for (let a = 0; a <= turns * 2 * Math.PI; a += 0.15) {
    const r = 2 + b * a;
    d += `${d ? "L" : "M"}${(cx + r * Math.cos(a)).toFixed(1)},${(cy + r * Math.sin(a)).toFixed(1)} `;
  }
  return d;
};
const NightArt: React.FC<{accent: string}> = ({accent}) => {
  const DAYS = ["SEG", "TER", "QUA", "QUI", "SEX", "SÁB", "DOM"];
  const x = (i: number) => 305 + i * 88;
  return (
    <svg width="952" height="165" viewBox="0 0 952 165" style={{position: "absolute", left: PAD, top: 120, filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.7))"}}>
      <defs>
        <mask id="moonM"><rect width="100" height="100" fill="#fff" /><circle cx="62" cy="40" r="26" fill="#000" /></mask>
      </defs>
      {/* o caracol */}
      <g>
        <path d="M22 150 Q100 174 176 154 Q198 148 192 124" fill="none" stroke="#e4ecff" strokeWidth="18" strokeLinecap="round" />
        <line x1="192" y1="126" x2="180" y2="96" stroke="#e4ecff" strokeWidth="5" strokeLinecap="round" />
        <line x1="198" y1="124" x2="210" y2="98" stroke="#e4ecff" strokeWidth="5" strokeLinecap="round" />
        <circle cx="179" cy="92" r="6" fill="#e4ecff" /><circle cx="211" cy="94" r="6" fill="#e4ecff" />
        <circle cx="98" cy="92" r="58" fill={accent} />
        <path d={spiral(98, 92, 2.4, 3.2)} fill="none" stroke="#0b1b4a" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      {/* a semana: quinta-feira em destaque */}
      {DAYS.map((d, i) => {
        const on = i === 3;
        return (
          <g key={d}>
            <text x={x(i)} y={42} textAnchor="middle" fontFamily={OSWALD} fontWeight={on ? 700 : 500} fontSize={on ? 32 : 26} letterSpacing="2" fill={on ? accent : "#fff"} opacity={on ? 1 : 0.7}>{d}</text>
            {on ? (
              <g>
                <circle cx={x(i)} cy={96} r={46} fill={accent} opacity="0.25" />
                <circle cx={x(i)} cy={96} r={36} fill={accent} />
                <g transform={`translate(${x(i) - 22} ${96 - 22}) scale(0.44)`}><circle cx="50" cy="50" r="40" fill="#0b1b4a" mask="url(#moonM)" /></g>
              </g>
            ) : <circle cx={x(i)} cy={96} r={7} fill="#fff" opacity="0.45" />}
          </g>
        );
      })}
    </svg>
  );
};

/** Painel de pontos luminosos (estilo LED) a escrever o número. */
const LED_FONT: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "+": ["00000", "00100", "00100", "11111", "00100", "00100", "00000"],
};
const LedNumber: React.FC<{text: string; accent: string}> = ({text, accent}) => {
  const P = 28; // passo entre pontos
  const PAD_BOARD = 30;
  const lit: {x: number; y: number}[] = [];
  const off: {x: number; y: number}[] = [];
  let col = 0;
  text.split("").forEach((c, k) => {
    LED_FONT[c].forEach((row, y) => row.split("").forEach((v, x) => (v === "1" ? lit : off).push({x: col + x, y})));
    col += 5 + (k === 1 ? 3 : 1); // pausa maior a seguir ao 2 (lê-se "2 500")
  });
  const cols = col - 1;
  const w = cols * P + PAD_BOARD * 2, h = 7 * P + PAD_BOARD * 2;
  const cx = (x: number) => PAD_BOARD + x * P + P / 2, cy = (y: number) => PAD_BOARD + y * P + P / 2;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{display: "block", marginBottom: 26}}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="30" fill="rgba(8,8,10,0.88)" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
      {off.map(({x, y}, i) => <circle key={`o${i}`} cx={cx(x)} cy={cy(y)} r={4} fill="#fff" opacity={0.14} />)}
      {lit.map(({x, y}, i) => (
        <g key={i}>
          <circle cx={cx(x)} cy={cy(y)} r={13} fill={accent} opacity={0.22} />
          <circle cx={cx(x)} cy={cy(y)} r={10.5} fill={accent} />
          <circle cx={cx(x) - 3} cy={cy(y) - 3} r={3.6} fill="#fff" opacity={0.6} />
        </g>
      ))}
    </svg>
  );
};

const Fact: React.FC<{s: FactSlide}> = ({s}) => {
  const lines = s.title.split("\n");
  const stat = s.stat;
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile(s.photo)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos, transform: s.shift ? `translateY(${-s.shift}px)` : undefined, WebkitMaskImage: s.shift ? (s.shift > 0 ? `linear-gradient(180deg, #000 ${1350 - s.shift - 200}px, transparent ${1350 - s.shift}px)` : `linear-gradient(180deg, transparent ${-s.shift}px, #000 ${-s.shift + 220}px)`) : undefined, filter: s.cut ? "blur(4px) brightness(0.8)" : s.night ? "brightness(0.55) saturate(0.7) contrast(1.1)" : undefined}} />
      {s.night && <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(8,24,70,0.78) 0%, rgba(14,40,110,0.45) 100%)", mixBlendMode: "multiply"}} />}
      {s.night && <Moon />}
      {s.diagram && <AbsoluteFill style={{background: s.diagram === "night" ? "linear-gradient(180deg, rgba(8,14,36,0.9) 0%, rgba(8,14,36,0.75) 21%, rgba(8,14,36,0) 36%)" : "linear-gradient(180deg, rgba(11,11,11,0.65) 0%, rgba(11,11,11,0.2) 45%, rgba(11,11,11,0) 100%)"}} />}
      {s.diagram === "hybrid" && <HybridDiagram />}
      {s.diagram === "night" && <NightArt accent={s.accent} />}
      {s.cut && (
        <div style={{position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: OSWALD, fontWeight: 700, fontSize: 760, lineHeight: 1, color: s.accent, opacity: 0.95}}>
          {s.kicker.slice(-2)}
        </div>
      )}
      {s.cut && <Img src={staticFile(s.cut)} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos}} />}
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,11,11,0.5) 0%, rgba(11,11,11,0) 22%, rgba(11,11,11,0) 38%, rgba(11,11,11,0.82) 66%, rgba(11,11,11,0.95) 100%)"}} />
      <div style={{position: "absolute", left: PAD, right: PAD, bottom: 96}}>
        <div style={{display: "flex", alignItems: "center", gap: 18, marginBottom: 22}}>
          <div style={{background: s.accent, color: INK, fontFamily: OSWALD, fontWeight: 700, fontSize: 38, letterSpacing: 5, padding: "8px 24px", borderRadius: 8}}>{s.kicker}</div>
          <div style={{fontFamily: OSWALD, fontWeight: 500, fontSize: 34, letterSpacing: 7, color: "#fff"}}>{s.chapter}</div>
        </div>
        {stat && stat.led && <LedNumber text={stat.text} accent={s.accent} />}
        {stat && !stat.led && (stat.stamp
          ? <div style={{display: "inline-block", background: s.accent, color: INK, fontFamily: OSWALD, fontWeight: 700, fontSize: 190, lineHeight: 1, padding: "4px 30px 12px", borderRadius: 8, transform: "rotate(-3deg)", marginBottom: 14}}>{stat.text}</div>
          : <div style={{fontFamily: OSWALD, fontWeight: 700, fontSize: 250, lineHeight: 0.95, color: s.accent, textShadow: "0 6px 40px rgba(0,0,0,0.5)"}}>{stat.text}</div>)}
        {lines.map((l, k) => {
          const hl = k === lines.length - 1;
          return (
            <div key={k} style={{position: "relative", display: "block", width: "fit-content"}}>
              {hl && <div style={{position: "absolute", inset: "2px -16px 0 -16px", background: s.accent}} />}
              <div style={{position: "relative", fontFamily: OSWALD, fontWeight: 700, fontSize: stat ? 100 : s.diagram === "hybrid" ? 100 : 112, lineHeight: 1.18, textTransform: "uppercase", color: hl ? INK : "#fff"}}>{l}</div>
            </div>
          );
        })}
        {s.body && <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 38, lineHeight: 1.35, color: "#ececec", marginTop: 26, maxWidth: 900}}>{s.body}</div>}
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: INK}}>
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 42%, rgba(250,187,0,0.16) 0%, rgba(11,11,11,0) 60%)"}} />
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", textAlign: "center", padding: PAD}}>
      <Img src={staticFile("logo-yellow.png")} style={{width: 680}} />
      <div style={{marginTop: 70, fontFamily: OSWALD, fontWeight: 700, fontSize: 96, lineHeight: 1.1, textTransform: "uppercase", color: "#fff", letterSpacing: 2}}>Junta-te ao clube</div>
      <div style={{marginTop: 34, fontFamily: OSWALD, fontWeight: 500, fontSize: 42, letterSpacing: 6, color: BRAND}}>{HANDLE}</div>
    </AbsoluteFill>
  </AbsoluteFill>
);

export const Carousel: React.FC<{index: number}> = ({index}) => {
  const s = SLIDES[index];
  const accent = s.kind === "fact" ? s.accent : BRAND;
  return (
    <AbsoluteFill style={{width: W, height: H, background: INK}}>
      {s.kind === "cover" && <CoverChat prompt={s.prompt} photo={s.photo} pos={s.pos} still />}
      {s.kind === "fact" && <Fact s={s} />}
      {s.kind === "cta" && <Cta />}
    </AbsoluteFill>
  );
};

/** Capa em vídeo (conversa com a IA) para o primeiro slide do carrossel. */
export const CoverVideo: React.FC = () => {
  const s = SLIDES[0];
  if (s.kind !== "cover") return null;
  return (
    <AbsoluteFill style={{width: W, height: H, background: INK}}>
      <CoverChat prompt={s.prompt} photo={s.photo} pos={s.pos} />
    </AbsoluteFill>
  );
};

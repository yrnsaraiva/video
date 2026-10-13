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

/** Cabeçalho e rodapé comuns a todos os slides. */
const Chrome: React.FC<{index: number; accent?: string}> = ({index, accent = BRAND}) => {
  const last = index === TOTAL - 1;
  return (
    <>
      <Img src={staticFile("wordmark-yellow.png")} style={{position: "absolute", left: PAD, top: 56, height: 46}} />
      <div style={{position: "absolute", right: PAD, top: 56, fontFamily: OSWALD, fontWeight: 500, fontSize: 34, letterSpacing: 4, color: "#fff", lineHeight: "46px"}}>
        {String(index + 1).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
      </div>
      <div style={{position: "absolute", left: PAD, right: PAD, bottom: 56, display: "flex", alignItems: "center", justifyContent: "space-between"}}>
        <div style={{display: "flex", gap: 10, alignItems: "center"}}>
          {SLIDES.map((_, i) => (
            <div key={i} style={{height: 10, width: i === index ? 44 : 10, borderRadius: 5, background: i === index ? accent : "rgba(255,255,255,0.35)"}} />
          ))}
        </div>
        {!last && (
          <div style={{display: "flex", alignItems: "center", gap: 14, fontFamily: OSWALD, fontWeight: 500, fontSize: 32, letterSpacing: 6, color: "#fff"}}>
            DESLIZA
            <svg width="46" height="24" viewBox="0 0 46 24" fill="none" stroke={accent} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h40M32 3l10 9-10 9" /></svg>
          </div>
        )}
      </div>
    </>
  );
};

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
  const CLIP = 130; // o vídeo dele corre até aos ~4,3 s (ele ao centro); depois fica parado
  const f = still ? 9999 : frame - 64; // a conversa começa aos 64 frames (~2 s), com ele a mexer no relógio
  const enter = spring({frame: f, fps, config: {damping: 15, stiffness: 120}});
  const typed = Math.floor(interpolate(f, [16, 92], [0, prompt.length], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const sent = f >= 98;
  const press = interpolate(f, [98, 103, 112], [1, 0.86, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const pulse = !sent && f > 80 ? 1 + 0.08 * Math.sin((f - 80) * 0.5) : 1;
  const ring = interpolate(f, [98, 118], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const caret = !sent && typed < prompt.length && Math.floor(f / 10) % 2 === 0;
  const think = f >= 112 && f < 140;
  const respIn = interpolate(f, [112, 124], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
  const caption = CAPTION(FACTS.length);
  const capLen = caption.reduce((n, g) => n + g.t.length, 0);
  const capTyped = Math.floor(interpolate(f, [140, 214], [0, capLen], {extrapolateLeft: "clamp", extrapolateRight: "clamp"}));
  const zoom = still ? 1.05 : interpolate(frame, [0, 300], [1, 1.05], {extrapolateRight: "clamp"});
  const shade = still ? 1 : interpolate(f, [0, 36], [0, 1], {extrapolateLeft: "clamp", extrapolateRight: "clamp"});
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

const Fact: React.FC<{s: FactSlide}> = ({s}) => {
  const lines = s.title.split("\n");
  const stat = s.stat;
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile(s.photo)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos, transform: s.shift ? `translateY(${-s.shift}px)` : undefined, WebkitMaskImage: s.shift ? `linear-gradient(180deg, #000 ${1350 - s.shift - 200}px, transparent ${1350 - s.shift}px)` : undefined, filter: s.cut ? "blur(4px) brightness(0.8)" : s.night ? "brightness(0.55) saturate(0.7) contrast(1.1)" : undefined}} />
      {s.night && <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(8,24,70,0.78) 0%, rgba(14,40,110,0.45) 100%)", mixBlendMode: "multiply"}} />}
      {s.night && <Moon />}
      {s.diagram && <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,11,11,0.6) 0%, rgba(11,11,11,0.2) 45%, rgba(11,11,11,0) 100%)"}} />}
      {s.diagram && <HybridDiagram />}
      {s.cut && (
        <div style={{position: "absolute", left: 0, right: 0, top: 120, textAlign: "center", fontFamily: OSWALD, fontWeight: 700, fontSize: 760, lineHeight: 1, color: s.accent, opacity: 0.95}}>
          {s.kicker.slice(-2)}
        </div>
      )}
      {s.cut && <Img src={staticFile(s.cut)} style={{position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos}} />}
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,11,11,0.5) 0%, rgba(11,11,11,0) 22%, rgba(11,11,11,0) 38%, rgba(11,11,11,0.82) 66%, rgba(11,11,11,0.95) 100%)"}} />
      <div style={{position: "absolute", left: PAD, right: PAD, bottom: 140}}>
        <div style={{display: "flex", alignItems: "center", gap: 18, marginBottom: 22}}>
          <div style={{background: s.accent, color: INK, fontFamily: OSWALD, fontWeight: 700, fontSize: 38, letterSpacing: 5, padding: "8px 24px", borderRadius: 8}}>{s.kicker}</div>
          <div style={{fontFamily: OSWALD, fontWeight: 500, fontSize: 34, letterSpacing: 7, color: "#fff"}}>{s.chapter}</div>
        </div>
        {stat && (stat.stamp
          ? <div style={{display: "inline-block", background: s.accent, color: INK, fontFamily: OSWALD, fontWeight: 700, fontSize: 190, lineHeight: 1, padding: "4px 30px 12px", borderRadius: 8, transform: "rotate(-3deg)", marginBottom: 14}}>{stat.text}</div>
          : <div style={{fontFamily: OSWALD, fontWeight: 700, fontSize: 250, lineHeight: 0.95, color: s.accent, textShadow: "0 6px 40px rgba(0,0,0,0.5)"}}>{stat.text}</div>)}
        {lines.map((l, k) => {
          const hl = k === lines.length - 1;
          return (
            <div key={k} style={{position: "relative", display: "block", width: "fit-content"}}>
              {hl && <div style={{position: "absolute", inset: "2px -16px 0 -16px", background: s.accent}} />}
              <div style={{position: "relative", fontFamily: OSWALD, fontWeight: 700, fontSize: stat ? 100 : s.diagram ? 100 : 112, lineHeight: 1.18, textTransform: "uppercase", color: hl ? INK : "#fff"}}>{l}</div>
            </div>
          );
        })}
        <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 38, lineHeight: 1.35, color: "#ececec", marginTop: 26, maxWidth: 900}}>{s.body}</div>
      </div>
    </AbsoluteFill>
  );
};

const Cta: React.FC = () => (
  <AbsoluteFill style={{background: INK}}>
    <AbsoluteFill style={{background: "radial-gradient(circle at 50% 38%, rgba(250,187,0,0.3) 0%, rgba(11,11,11,0) 62%)"}} />
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", textAlign: "center", padding: PAD}}>
      <Img src={staticFile("logo-yellow.png")} style={{width: 720}} />
      <div style={{marginTop: 54, fontFamily: OSWALD, fontWeight: 700, fontSize: 130, lineHeight: 1.08, textTransform: "uppercase", color: "#fff"}}>Junta-te</div>
      <div style={{position: "relative", marginTop: 4}}>
        <div style={{position: "absolute", inset: "2px -22px 0 -22px", background: BRAND}} />
        <div style={{position: "relative", fontFamily: OSWALD, fontWeight: 700, fontSize: 130, lineHeight: 1.08, textTransform: "uppercase", color: INK}}>ao clube</div>
      </div>
      <div style={{marginTop: 48, display: "flex", gap: 22, fontFamily: INTER, fontWeight: 600, fontSize: 46}}>
        <span style={{color: BRAND}}>Corre.</span><span style={{color: "#fff"}}>Convive.</span><span style={{color: BRAND}}>Repete.</span>
      </div>
      <div style={{marginTop: 40, fontFamily: OSWALD, fontWeight: 500, fontSize: 42, letterSpacing: 5, color: "#fff"}}>{HANDLE}</div>
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
      <Chrome index={index} accent={accent} />
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
      <Chrome index={0} />
    </AbsoluteFill>
  );
};

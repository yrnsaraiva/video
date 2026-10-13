import React, {useEffect, useRef, useState} from "react";
import {AbsoluteFill, Img, continueRender, delayRender, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BRAND, INK, INTER, OSWALD, clamp, outExpo} from "./theme";

/** Foto com Ken Burns (zoom + deslize lento). */
export const Photo: React.FC<{src: string; dark?: number; len: number; dir?: 1 | -1; pos?: string; overlay?: boolean; blur?: number}> = ({src, dark = 0.45, len, dir = 1, pos = "50% 50%", overlay = true, blur = 0}) => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, len], dir === 1 ? [1.06, 1.24] : [1.24, 1.06], clamp);
  const x = interpolate(f, [0, len], [0, -40 * dir], clamp);
  return (
    <AbsoluteFill style={{background: overlay ? INK : undefined}}>
      <AbsoluteFill style={{transform: `translateX(${x}px) scale(${scale})`}}>
        <Img src={staticFile(src)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: pos, filter: blur ? `blur(${blur}px)` : undefined}} />
      </AbsoluteFill>
      {overlay && <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(11,11,11,${dark}) 0%, rgba(11,11,11,${dark * 0.4}) 40%, rgba(11,11,11,${dark + 0.4}) 100%)`}} />}
    </AbsoluteFill>
  );
};

/** Entrada "punch": a imagem chega ampliada e desfocada e assenta. */
export const Punch: React.FC<{children: React.ReactNode}> = ({children}) => {
  const f = useCurrentFrame();
  const s = interpolate(f, [0, 16], [1.22, 1], {...clamp, easing: outExpo});
  const blur = interpolate(f, [0, 12], [16, 0], clamp);
  return <AbsoluteFill style={{transform: `scale(${s})`, filter: blur > 0.2 ? `blur(${blur}px)` : undefined}}>{children}</AbsoluteFill>;
};

export const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.55) 100%)", pointerEvents: "none"}} />
);

/** Faíscas amarelas a subir. */
export const Sparks: React.FC<{seed?: number; count?: number}> = ({seed = 0, count = 26}) => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {new Array(count).fill(0).map((_, i) => {
        const r = (k: string) => random(`${k}${i}-${seed}`);
        const size = 6 + r("sz") * 12;
        const y = 2100 - ((f * (2.4 + r("sp") * 4.8) + r("y") * 2400) % 2300);
        const x = r("x") * 1080 + Math.sin(f * 0.05 + i) * 30;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: size, height: size, borderRadius: size, background: i % 4 === 0 ? "#fff" : BRAND, opacity: 0.25 + r("o") * 0.5, boxShadow: "0 0 18px rgba(250,187,0,0.6)"}} />;
      })}
    </AbsoluteFill>
  );
};

/** Barra de progresso estilo stories. */
export const StoryBar: React.FC<{index: number; total: number; len: number}> = ({index, total, len}) => {
  const f = useCurrentFrame();
  return (
    <div style={{position: "absolute", top: 44, left: 70, right: 70, display: "flex", gap: 10}}>
      {new Array(total).fill(0).map((_, i) => {
        const fill = i < index ? 1 : i === index ? Math.min(1, f / len) : 0;
        return (
          <div key={i} style={{flex: 1, height: 8, borderRadius: 4, background: "rgba(255,255,255,0.3)", overflow: "hidden"}}>
            <div style={{width: `${fill * 100}%`, height: "100%", background: BRAND}} />
          </div>
        );
      })}
    </div>
  );
};

/** Número gigante em contorno (ou preenchido e centrado, quando fica atrás de um recorte). */
export const Ghost: React.FC<{n: number; behind?: boolean}> = ({n, behind}) => {
  const f = useCurrentFrame();
  const p = interpolate(f, [2, 26], [0, 1], {...clamp, easing: outExpo});
  const base: React.CSSProperties = {position: "absolute", fontFamily: OSWALD, fontWeight: 700, lineHeight: 1, pointerEvents: "none"};
  if (behind) {
    return (
      <div style={{...base, left: 0, right: 0, textAlign: "center", top: 140, fontSize: 880, color: BRAND, opacity: 0.95 * p,
        transform: `translateY(${(1 - p) * 260}px) scale(${1.1 - 0.1 * p + f * 0.0007})`}}>
        {String(n).padStart(2, "0")}
      </div>
    );
  }
  return (
    <div style={{...base, right: -20, top: 150, fontSize: 560, color: "transparent", WebkitTextStroke: "5px rgba(250,187,0,0.55)", opacity: p,
      transform: `translateX(${(1 - p) * 420 - f * 0.9}px)`}}>
      {String(n).padStart(2, "0")}
    </div>
  );
};

/** Faixa de texto a deslizar. */
export const Ticker: React.FC<{text: string; y: number; rot?: number; dir?: 1 | -1; speed?: number; bg?: string; color?: string}> = ({text, y, rot = -2.5, dir = 1, speed = 5, bg = BRAND, color = INK}) => {
  const f = useCurrentFrame();
  const ref = useRef<HTMLSpanElement>(null);
  const [w, setW] = useState(1600);
  useEffect(() => {
    const h = delayRender("ticker");
    document.fonts.ready.then(() => { if (ref.current) setW(ref.current.offsetWidth); continueRender(h); });
  }, [text]);
  const rise = interpolate(f, [4, 22], [0, 1], {...clamp, easing: outExpo});
  const shift = (f * speed) % w;
  return (
    <div style={{position: "absolute", left: -80, right: -80, top: y, height: 88, background: bg, overflow: "hidden", display: "flex", alignItems: "center",
      transform: `translateY(${(1 - rise) * 200}px) rotate(${rot}deg)`, boxShadow: "0 10px 40px rgba(0,0,0,0.45)"}}>
      <div style={{display: "flex", whiteSpace: "nowrap", transform: `translateX(${dir === 1 ? -shift : shift - w}px)`}}>
        {new Array(8).fill(0).map((_, i) => (
          <span key={i} ref={i === 0 ? ref : undefined} style={{display: "inline-block", whiteSpace: "pre", fontFamily: OSWALD, fontWeight: 700, fontSize: 50, letterSpacing: 5, color}}>{text}</span>
        ))}
      </div>
    </div>
  );
};

/** Rota animada A → B. */
export const Route: React.FC<{from: string; to: string}> = ({from, to}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f - 8, fps, config: {damping: 14}});
  const prog = interpolate(f, [22, 62], [0, 1], {...clamp, easing: outExpo});
  const b = spring({frame: f - 58, fps, config: {damping: 9, stiffness: 160}});
  const pill = (txt: string, s: number, bg: string, fg: string) => (
    <div style={{background: bg, color: fg, fontFamily: OSWALD, fontWeight: 700, fontSize: 42, letterSpacing: 4, padding: "10px 28px", borderRadius: 14, transform: `scale(${s})`, boxShadow: "0 8px 30px rgba(0,0,0,0.4)"}}>{txt}</div>
  );
  return (
    <div style={{position: "absolute", left: 70, right: 70, top: 190, display: "flex", alignItems: "center"}}>
      {pill(from, a, BRAND, INK)}
      <div style={{flex: 1, margin: "0 20px", position: "relative", height: 30}}>
        <div style={{position: "absolute", top: 12, left: 0, width: `${prog * 100}%`, height: 6, borderRadius: 3, backgroundImage: "repeating-linear-gradient(90deg, #fff 0 14px, transparent 14px 28px)"}} />
        <div style={{position: "absolute", top: 0, left: `calc(${prog * 100}% - 15px)`, width: 30, height: 30, borderRadius: 15, background: BRAND, border: "4px solid #fff", boxShadow: "0 0 24px rgba(250,187,0,0.9)", opacity: prog > 0 ? 1 : 0}} />
      </div>
      {pill(to, b, "#fff", INK)}
    </div>
  );
};

/** Selo giratório com texto em círculo. */
export const Badge: React.FC<{center: string; ring: string}> = ({center, ring}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - 14, fps, config: {damping: 11, stiffness: 120}});
  return (
    <div style={{position: "absolute", right: 60, top: 190, width: 300, height: 300, transform: `scale(${s}) rotate(${(1 - s) * -120}deg)`}}>
      <svg width="300" height="300" viewBox="0 0 300 300">
        <circle cx="150" cy="150" r="148" fill={BRAND} />
        <circle cx="150" cy="150" r="76" fill={INK} />
        <g style={{transformOrigin: "150px 150px", transform: `rotate(${f * 3}deg)`}}>
          <defs><path id="ring" d="M150,150 m-108,0 a108,108 0 1,1 216,0 a108,108 0 1,1 -216,0" /></defs>
          <text fontFamily={OSWALD} fontWeight={700} fontSize="36" letterSpacing="5" fill={INK}><textPath href="#ring">{ring}</textPath></text>
        </g>
        <text x="150" y="172" textAnchor="middle" fontFamily={OSWALD} fontWeight={700} fontSize="64" fill={BRAND}>{center}</text>
      </svg>
    </div>
  );
};

const fmt = (n: number) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");

/** Contador a subir ou carimbo. */
export const Stat: React.FC<{to?: number; prefix?: string; text?: string}> = ({to, prefix = "", text}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (text) {
    const s = spring({frame: f - 6, fps, config: {damping: 9, stiffness: 170, mass: 0.7}});
    const shake = f >= 14 && f < 28 ? Math.sin(f * 2.6) * (28 - f) * 0.7 : 0;
    return (
      <div style={{alignSelf: "flex-start", marginBottom: 18, background: BRAND, color: INK, fontFamily: OSWALD, fontWeight: 700, fontSize: 210, lineHeight: 1, padding: "6px 36px 14px", borderRadius: 10,
        transform: `translateX(${shake}px) rotate(-4deg) scale(${3 - 2 * s})`, opacity: Math.min(1, s * 3), boxShadow: "0 14px 50px rgba(0,0,0,0.5)"}}>{text}</div>
    );
  }
  const v = Math.round(interpolate(f, [8, 52], [0, to ?? 0], {...clamp, easing: outExpo}));
  const pop = spring({frame: f - 4, fps, config: {damping: 12, stiffness: 140}});
  return (
    <div style={{fontFamily: OSWALD, fontWeight: 700, fontSize: 280, lineHeight: 0.95, color: BRAND, textShadow: "0 8px 44px rgba(0,0,0,0.55)", transformOrigin: "left bottom",
      transform: `scale(${0.7 + pop * 0.3})`, opacity: Math.min(1, pop * 2)}}>{prefix}{fmt(v)}</div>
  );
};

/** Linha de título com revelação por máscara e destaque amarelo opcional. */
export const TitleLine: React.FC<{text: string; k: number; hl: boolean; size: number}> = ({text, k, hl, size}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - 12 - k * 7, fps, config: {damping: 15, stiffness: 120}});
  const sweep = hl ? interpolate(f, [30 + k * 7, 46 + k * 7], [0, 1], {...clamp, easing: outExpo}) : 0;
  return (
    <div style={{overflow: "hidden", margin: "-48px -20px 0", padding: "48px 20px 0"}}>
      <div style={{display: "inline-block", position: "relative", transform: `translateY(${(1 - p) * 150}px)`, opacity: p}}>
        {hl && <div style={{position: "absolute", inset: "-4px -18px -4px -18px", background: BRAND, transformOrigin: "left", transform: `scaleX(${sweep})`}} />}
        <div style={{position: "relative", fontFamily: OSWALD, fontWeight: 700, fontSize: size, lineHeight: 1.22, textTransform: "uppercase", color: sweep > 0.5 ? INK : "#fff"}}>{text}</div>
      </div>
    </div>
  );
};

export const Body: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const o = interpolate(f, [38, 58], [0, 1], clamp);
  return <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 46, lineHeight: 1.35, color: "#ececec", marginTop: 34, opacity: o, transform: `translateY(${(1 - o) * 26}px)`, maxWidth: 920}}>{text}</div>;
};

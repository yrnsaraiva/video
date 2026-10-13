import React from "react";
import {AbsoluteFill, Img, interpolate, random, staticFile, useCurrentFrame} from "remotion";
import {BRAND, INK, INTER, OSWALD, clamp, inOut, outExpo} from "./theme";

// Cada transição é feita à medida do que acontece na cena a seguir.
// O corte da cena acontece a meio (t = 0.5), tapado pela transição.
export type TKind = "sparkle" | "track" | "dots" | "burst" | "sunrise" | "coffee" | "checker";
export const T_LEN = 24;

export const PINK = "#ff5fa2";
export const ORANGE = "#ff8a1f";
export const COFFEE = "#4a2c1a";
export const CARAMEL = "#d9a066";

const ramp = (t: number, a: number, b: number, easing: (n: number) => number = inOut) =>
  interpolate(t, [a, b], [0, 1], {...clamp, easing});

const Label: React.FC<{t: number; text: string; color?: string; size?: number}> = ({t, text, color = "#fff", size = 130}) => {
  const o = interpolate(t, [0.28, 0.42, 0.58, 0.72], [0, 1, 1, 0], clamp);
  const s = interpolate(t, [0.28, 0.5, 0.72], [0.8, 1, 1.1], clamp);
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: o}}>
      <div style={{fontFamily: OSWALD, fontWeight: 700, fontSize: size, letterSpacing: 8, color, textTransform: "uppercase", textAlign: "center", lineHeight: 1.05,
        transform: `scale(${s})`, textShadow: "0 8px 40px rgba(0,0,0,0.35)"}}>{text}</div>
    </AbsoluteFill>
  );
};

const STAR = "M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0Z";

/** Abertura → facto 1: a estrela da IA cresce e inunda o ecrã. */
const SparkleT: React.FC<{t: number}> = ({t}) => {
  const cx = 165, cy = 565, R = 2400;
  const grow = interpolate(t, [0, 0.5], [0, R], {...clamp, easing: inOut});
  const hole = interpolate(t, [0.5, 1], [0, R], {...clamp, easing: inOut});
  const mask = `radial-gradient(circle at ${cx}px ${cy}px, transparent ${hole}px, #000 ${hole + 1}px)`;
  const scale = interpolate(t, [0, 0.5, 1], [0.7, 7, 0.7], {...clamp});
  return (
    <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>
      <AbsoluteFill style={{background: BRAND, clipPath: `circle(${grow}px at ${cx}px ${cy}px)`}} />
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
        <g transform={`translate(${cx} ${cy}) rotate(${t * 220}) scale(${scale * 3.6}) translate(-50 -50)`} opacity={interpolate(t, [0, 0.12, 0.88, 1], [0, 1, 1, 0], clamp)}>
          <path d={STAR} fill={INK} />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

/** Facto 1 → 2: raias de pista de atletismo a correr na diagonal. */
const TrackT: React.FC<{t: number}> = ({t}) => {
  const L = 3253;
  const lanes = [0, 1, 2, 3, 4];
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
        {lanes.map((k) => {
          const d = (k - 2) * 430;
          const delay = k * 0.03;
          const pin = ramp(t, delay, delay + 0.3);
          const pout = ramp(t, 0.5 + delay, 0.8 + delay);
          const off = pout > 0 ? -L * pout : L * (1 - pin);
          return <line key={k} x1={-600 + d} y1={2100 + d} x2={1700 + d} y2={-200 + d} stroke={k % 2 ? INK : BRAND} strokeWidth={650}
            strokeDasharray={`${L} ${L * 2}`} strokeDashoffset={off} />;
        })}
      </svg>
    </AbsoluteFill>
  );
};

/** Facto 2 → 3: uma multidão de bolas que cresce (a comunidade). */
const DotsT: React.FC<{t: number}> = ({t}) => {
  const cols = 9, rows = 16, cell = 120;
  return (
    <AbsoluteFill>
      {new Array(rows * cols).fill(0).map((_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const d = random(`d${i}`) * 0.2;
        const pin = ramp(t, d, d + 0.25, outExpo);
        const pout = ramp(t, 0.5 + d, 0.75 + d);
        const s = (pout > 0 ? 1 - pout : pin) * 1.75;
        return <div key={i} style={{position: "absolute", left: c * cell, top: r * cell, width: cell, height: cell, borderRadius: cell, transform: `scale(${s})`,
          background: random(`c${i}`) > 0.72 ? INK : BRAND}} />;
      })}
    </AbsoluteFill>
  );
};

/** Facto 3 → 4: explosão rosa (Outubro Rosa). */
const BurstT: React.FC<{t: number}> = ({t}) => {
  const pin = ramp(t, 0, 0.5, outExpo);
  const pout = ramp(t, 0.5, 1);
  const s = pout > 0 ? 1 - pout : pin;
  const rot = pout > 0 ? pout * 110 : (1 - pin) * -110;
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", overflow: "hidden"}}>
      <div style={{width: 3000, height: 3000, flex: "none", transform: `rotate(${rot}deg) scale(${s})`,
        background: `repeating-conic-gradient(${PINK} 0deg 12deg, #ff9cc5 12deg 24deg)`}} />
      <Label t={t} text={"Outubro\nRosa"} />
    </AbsoluteFill>
  );
};

/** Facto 4 → 5: o sol nasce e pinta o ecrã (Ao amanhecer). */
const SunriseT: React.FC<{t: number}> = ({t}) => {
  const sky = t < 0.5 ? ramp(t, 0, 0.45) : 1 - ramp(t, 0.55, 1);
  const y = interpolate(t, [0, 0.5, 1], [2500, 1100, -900], {...clamp, easing: inOut});
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      <AbsoluteFill style={{opacity: sky, background: "linear-gradient(180deg, #ffd36b 0%, #ff9a2a 55%, #c2410c 100%)"}} />
      <div style={{position: "absolute", left: 540 - 520, top: y - 520, width: 1040, height: 1040, borderRadius: 1040,
        background: "radial-gradient(circle, #fff7c2 0%, #ffd23f 40%, #ff8a1f 100%)", boxShadow: "0 0 260px 80px rgba(255,170,40,0.7)"}} />
    </AbsoluteFill>
  );
};

/** Facto 5 → 6: o café sobe e enche o ecrã (Coffee Party). */
const CoffeeT: React.FC<{t: number}> = ({t}) => {
  const f = useCurrentFrame();
  const wave = (y: number, ph: number, amp = 30) => {
    let d = "";
    for (let x = 0; x <= 1080; x += 30) d += `${x === 0 ? "M" : "L"}${x},${y + Math.sin((x / 1080) * Math.PI * 3 + ph) * amp} `;
    return d;
  };
  const top = interpolate(t, [0, 0.5], [2060, -130], {...clamp, easing: inOut});
  const bottom = t < 0.5 ? 2200 : interpolate(t, [0.5, 1], [2060, -130], {...clamp, easing: inOut});
  const ph = f * 0.5;
  const topPath = wave(top, ph), botPath = wave(bottom, ph + 1.3);
  const botRev = botPath.split(" ").filter(Boolean).reverse().map((p, i) => (i === 0 ? "L" : "L") + p.slice(1)).join(" ");
  return (
    <AbsoluteFill>
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{position: "absolute", inset: 0}}>
        <path d={`${topPath.replace("M", "M")} ${botRev} Z`} fill={COFFEE} />
        <path d={wave(top - 34, ph - 0.6, 26)} fill="none" stroke={CARAMEL} strokeWidth={22} strokeLinecap="round" />
        <path d={wave(bottom, ph + 1.3)} fill="none" stroke={CARAMEL} strokeWidth={22} strokeLinecap="round" />
      </svg>
    </AbsoluteFill>
  );
};

/** Facto 6 → fecho: linha de meta axadrezada. */
const CheckerT: React.FC<{t: number}> = ({t}) => {
  const cols = 8, rows = 15, cell = 135;
  return (
    <AbsoluteFill style={{overflow: "hidden"}}>
      {new Array(rows * cols).fill(0).map((_, i) => {
        const r = Math.floor(i / cols), c = i % cols;
        const d = (r + c) * 0.012;
        const pin = ramp(t, d, d + 0.22, outExpo);
        const pout = ramp(t, 0.5 + d, 0.5 + d + 0.22);
        const s = (pout > 0 ? 1 - pout : pin) * 1.05;
        return <div key={i} style={{position: "absolute", left: c * cell, top: r * cell, width: cell, height: cell, background: (r + c) % 2 ? INK : "#fff", transform: `scale(${s})`}} />;
      })}
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: interpolate(t, [0.35, 0.5, 0.62], [0, 1, 0], clamp)}}>
        <Img src={staticFile("wordmark-yellow.png")} style={{width: 640, filter: "drop-shadow(0 0 30px rgba(0,0,0,0.7))"}} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Transition: React.FC<{kind: TKind}> = ({kind}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / (T_LEN - 1));
  switch (kind) {
    case "sparkle": return <SparkleT t={t} />;
    case "track": return <TrackT t={t} />;
    case "dots": return <DotsT t={t} />;
    case "burst": return <BurstT t={t} />;
    case "sunrise": return <SunriseT t={t} />;
    case "coffee": return <CoffeeT t={t} />;
    default: return <CheckerT t={t} />;
  }
};

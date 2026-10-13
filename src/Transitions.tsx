import React from "react";
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from "remotion";
import {BRAND, INK, clamp, inOut} from "./theme";

export type TKind = "wipe" | "stripes" | "iris" | "slats";
export const T_LEN = 20; // frames; o corte da cena acontece a meio (t = 0.5), tapado pelo painel

const Mark: React.FC<{t: number}> = ({t}) => {
  const o = interpolate(t, [0.3, 0.45, 0.58, 0.72], [0, 1, 1, 0], clamp);
  const s = interpolate(t, [0.3, 0.5, 0.72], [0.7, 1, 1.12], clamp);
  return (
    <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: o}}>
      <Img src={staticFile("wordmark-ink.png")} style={{width: 640, transform: `scale(${s})`}} />
    </AbsoluteFill>
  );
};

const Bars: React.FC<{t: number; n: number; vertical: boolean}> = ({t, n, vertical}) => (
  <AbsoluteFill style={{flexDirection: vertical ? "row" : "column"}}>
    {new Array(n).fill(0).map((_, i) => {
      const inP = interpolate(t, [i * 0.035, i * 0.035 + 0.26], [0, 1], {...clamp, easing: inOut});
      const outP = interpolate(t, [0.5 + i * 0.035, 0.76 + i * 0.035], [0, 1], {...clamp, easing: inOut});
      const s = outP > 0 ? 1 - outP : inP;
      const origin = outP > 0 ? (vertical ? "bottom" : "right") : (vertical ? "top" : "left");
      return (
        <div key={i} style={{flex: 1, margin: vertical ? "0 -1px" : "-1px 0", background: i % 2 ? INK : BRAND, transformOrigin: origin,
          transform: vertical ? `scaleY(${s})` : `scaleX(${s})`}} />
      );
    })}
  </AbsoluteFill>
);

export const Transition: React.FC<{kind: TKind}> = ({kind}) => {
  const f = useCurrentFrame();
  const t = Math.min(1, f / (T_LEN - 1));

  if (kind === "wipe") {
    const x = interpolate(t, [0, 1], [-2.4, 1], {easing: inOut}) * 1080;
    const panel = (dx: number, color: string) => (
      <div style={{position: "absolute", top: -200, height: 2320, width: 2.4 * 1080, left: x + dx, background: color, transform: "skewX(-14deg)"}} />
    );
    return (
      <AbsoluteFill style={{overflow: "hidden"}}>
        {panel(130, INK)}
        {panel(0, BRAND)}
        <Mark t={t} />
      </AbsoluteFill>
    );
  }
  if (kind === "stripes") return <Bars t={t} n={6} vertical={false} />;
  if (kind === "slats") return <Bars t={t} n={8} vertical />;

  // iris
  const R = 1300;
  const grow = interpolate(t, [0, 0.5], [0, R], {...clamp, easing: inOut});
  const hole = interpolate(t, [0.5, 1], [0, R], {...clamp, easing: inOut});
  const mask = `radial-gradient(circle at 50% 55%, transparent ${hole}px, #000 ${hole + 1}px)`;
  return (
    <AbsoluteFill style={{WebkitMaskImage: mask, maskImage: mask}}>
      <AbsoluteFill style={{background: INK, clipPath: `circle(${grow}px at 50% 55%)`}} />
      <AbsoluteFill style={{background: BRAND, clipPath: `circle(${Math.max(0, grow - 70)}px at 50% 55%)`}} />
      <Mark t={t} />
    </AbsoluteFill>
  );
};

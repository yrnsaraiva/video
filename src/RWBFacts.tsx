import React from "react";
import {AbsoluteFill, Img, OffthreadVideo, Sequence, interpolate, random, spring, staticFile, useCurrentFrame, useVideoConfig} from "remotion";
import {BRAND, INK, INTER, OSWALD, clamp, inOut, outExpo} from "./theme";
import {FACTS, FACT_LEN, INTRO, OUTRO, PROMPT} from "./facts";
import {Badge, Body, Ghost, Photo, Punch, Route, Sparks, Stat, StoryBar, Ticker, TitleLine, Vignette} from "./Elements";
import {T_LEN, TKind, Transition} from "./Transitions";

const TICKER = "RUNWITHBROTO  •  WE RUN TOGETHER  •  WE GROW TOGETHER  •  ";

const Sparkle: React.FC<{size: number; spin: number}> = ({size, spin}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${spin}deg)`}}>
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff5a4d" /><stop offset=".5" stopColor={BRAND} /><stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0Z" fill="url(#g)" />
  </svg>
);

const Rain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {new Array(90).fill(0).map((_, i) => {
        const y = ((random(`y${i}`) * 2200 + f * (10 + random(`s${i}`) * 18)) % 2200) - 140;
        const x = random(`x${i}`) * 1080 - f * 1.5;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: 2.5, height: 14 + random(`h${i}`) * 36, borderRadius: 2, background: "rgba(255,255,255,0.35)", transform: "rotate(6deg)"}} />;
      })}
    </AbsoluteFill>
  );
};

// ───────────────────────── Abertura: pergunta à IA ─────────────────────────
const Intro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = spring({frame: f, fps, config: {damping: 14, stiffness: 110}});
  const typed = Math.floor(interpolate(f, [22, 100], [0, PROMPT.length], clamp));
  const text = PROMPT.slice(0, typed);
  const pressed = f >= 118;
  const sendPulse = f > 104 && !pressed ? 1 + 0.12 * Math.sin((f - 104) * 0.5) : 1;
  const press = interpolate(f, [118, 124, 134], [1, 0.84, 1], clamp);
  const ring = interpolate(f, [118, 136], [0, 1], clamp);
  const cursorOn = Math.floor(f / 12) % 2 === 0 && typed < PROMPT.length;
  const textO = interpolate(f, [118, 128], [1, 0], clamp);
  const dotsO = interpolate(f, [126, 132], [0, 1], clamp);
  const zoom = interpolate(f, [0, INTRO], [1.02, 1.14], clamp);
  const pillShrink = interpolate(f, [136, 150], [1, 0.9], {...clamp, easing: inOut});
  const render = (t: string) => t.split(/(Gemini,|factos mais interessantes|RUNWITHBROTO)/).map((p, i) =>
    p === "Gemini," || p === "factos mais interessantes" || p === "RUNWITHBROTO"
      ? <b key={i} style={{fontWeight: 700, color: p === "RUNWITHBROTO" ? BRAND : "#fff"}}>{p}</b>
      : <span key={i}>{p}</span>);
  return (
    <AbsoluteFill>
      <AbsoluteFill style={{background: INK}}>
        <AbsoluteFill style={{transform: `scale(${zoom})`}}>
          <OffthreadVideo src={staticFile("videos/01.mp4")} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
        </AbsoluteFill>
        <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0.15) 45%, rgba(11,11,11,0.5) 100%)"}} />
      </AbsoluteFill>
      <Rain />
      <div style={{position: "absolute", left: 60, right: 60, top: 190, transform: `translateY(${(1 - enter) * -140}px) scale(${(0.92 + enter * 0.08) * pillShrink})`, opacity: enter}}>
        <div style={{background: "rgba(11,11,11,0.94)", borderRadius: 80, padding: "64px 64px 52px", boxShadow: `0 0 0 3px rgba(255,255,255,0.18), 0 0 90px rgba(250,187,0,${pressed ? 0.5 : 0.3})`, minHeight: 440, position: "relative"}}>
          <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 64, lineHeight: 1.25, color: "#e8e8e8", minHeight: 240, opacity: textO}}>
            {render(text)}
            {cursorOn && <span style={{display: "inline-block", width: 5, height: 64, background: BRAND, marginLeft: 6, verticalAlign: "middle"}} />}
          </div>
          <div style={{position: "absolute", left: 64, top: 90, display: "flex", gap: 18, opacity: dotsO}}>
            {[0, 1, 2].map((i) => <div key={i} style={{width: 26, height: 26, borderRadius: 13, background: BRAND, transform: `translateY(${-Math.abs(Math.sin((f - i * 4) * 0.35)) * 26}px)`}} />)}
          </div>
          <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 30}}>
            <Sparkle size={78} spin={f * (pressed ? 7 : 1.6)} />
            <div style={{position: "relative"}}>
              <div style={{position: "absolute", inset: 0, borderRadius: 60, border: `5px solid ${BRAND}`, opacity: pressed ? 1 - ring : 0, transform: `scale(${1 + ring * 1.8})`}} />
              <div style={{width: 104, height: 104, borderRadius: 52, background: BRAND, display: "grid", placeItems: "center", transform: `scale(${pressed ? press : sendPulse})`}}>
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ───────────────────────── Cena de facto ─────────────────────────
const FactScene: React.FC<{i: number}> = ({i}) => {
  const fact = FACTS[i];
  const lines = fact.title.split("\n");
  const size = fact.stat ? 104 : 112;
  return (
    <AbsoluteFill style={{background: INK}}>
      <Punch>
        {fact.video ? (
          <AbsoluteFill style={{background: INK}}>
            <OffthreadVideo src={staticFile(fact.video)} muted style={{width: "100%", height: "100%", objectFit: "cover"}} />
            <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,11,11,0.4) 0%, rgba(11,11,11,0.15) 40%, rgba(11,11,11,0.8) 100%)"}} />
          </AbsoluteFill>
        ) : (
          <Photo src={fact.photo} len={FACT_LEN} dir={i % 2 === 0 ? 1 : -1} dark={0.4} pos={fact.pos} />
        )}
      </Punch>
      <Vignette />
      <Sparks seed={i} />
      <Ghost n={i + 1} />
      {fact.route && <Route from={fact.route[0]} to={fact.route[1]} />}
      {fact.badge && <Badge center={fact.badge.center} ring={fact.badge.ring} />}
      <AbsoluteFill style={{justifyContent: "flex-end", padding: "0 70px 250px"}}>
        <div style={{alignSelf: "flex-start"}}><Kicker text={fact.kicker} /></div>
        {fact.stat && <Stat {...fact.stat} />}
        {lines.map((l, k) => <TitleLine key={k} text={l} k={k} hl={k === lines.length - 1} size={size} />)}
        <Body text={fact.body} />
      </AbsoluteFill>
      <Ticker text={TICKER} y={1795} dir={i % 2 === 0 ? 1 : -1} />
      <StoryBar index={i} total={FACTS.length} len={FACT_LEN} />
      <Img src={staticFile("wordmark-yellow.png")} style={{position: "absolute", left: 70, top: 78, height: 60}} />
    </AbsoluteFill>
  );
};

const Kicker: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const k = spring({frame: f - 4, fps, config: {damping: 14}});
  const bar = interpolate(f, [6, 26], [0, 1], {...clamp, easing: outExpo});
  return (
    <div style={{marginBottom: 26}}>
      <div style={{display: "inline-flex", background: BRAND, color: INK, fontFamily: OSWALD, fontWeight: 700, fontSize: 44, letterSpacing: 6, padding: "10px 28px", borderRadius: 10, opacity: k, transform: `translateY(${(1 - k) * 30}px) scale(${0.9 + k * 0.1})`}}>{text}</div>
      <div style={{height: 10, width: bar * 220, background: BRAND, marginTop: 24}} />
    </div>
  );
};

// ───────────────────────── Fecho ─────────────────────────
const Outro: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: f - 4, fps, config: {damping: 11, stiffness: 100}});
  const rays = interpolate(f, [0, 24], [0, 1], clamp);
  const glow = 0.5 + 0.5 * Math.sin(f * 0.18);
  const words = [["Corre.", BRAND], ["Convive.", "#fff"], ["Repete.", BRAND]] as const;
  return (
    <AbsoluteFill style={{background: INK}}>
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 38%, rgba(250,187,0,${0.28 + glow * 0.1}) 0%, rgba(11,11,11,0) 60%)`}} />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", opacity: rays * 0.9, pointerEvents: "none"}}>
        <div style={{width: 2600, height: 2600, borderRadius: 2600, transform: `rotate(${f * 0.7}deg)`, marginTop: -420,
          background: "repeating-conic-gradient(rgba(250,187,0,0.2) 0deg 7.5deg, rgba(250,187,0,0) 7.5deg 15deg)",
          WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 62%)", maskImage: "radial-gradient(circle, #000 0%, transparent 62%)"}} />
      </AbsoluteFill>
      <Sparks seed={99} count={34} />
      <Confetti />
      <AbsoluteFill style={{alignItems: "center", justifyContent: "center", textAlign: "center", padding: 70}}>
        <Img src={staticFile("logo-yellow.png")} style={{width: 780, transform: `scale(${0.5 + logo * 0.5}) rotate(${(1 - logo) * -8}deg)`, opacity: Math.min(1, logo * 2), filter: `drop-shadow(0 0 ${30 + glow * 30}px rgba(250,187,0,0.55))`}} />
        <div style={{marginTop: 60, display: "flex", flexDirection: "column", alignItems: "center"}}>
          <OutLine text="Junta-te" at={22} color="#fff" />
          <OutLine text="ao clube" at={30} color={INK} hl />
        </div>
        <div style={{display: "flex", justifyContent: "center", gap: 26, marginTop: 52, fontFamily: INTER, fontWeight: 600, fontSize: 52}}>
          {words.map(([w, c], k) => {
            const p = spring({frame: f - (56 + k * 9), fps, config: {damping: 8, stiffness: 180}});
            return <div key={w} style={{color: c, opacity: Math.min(1, p * 2), transform: `translateY(${(1 - p) * 40}px) scale(${0.6 + p * 0.4})`}}>{w}</div>;
          })}
        </div>
      </AbsoluteFill>
      <Ticker text={TICKER} y={1795} dir={-1} speed={6} />
    </AbsoluteFill>
  );
};

const OutLine: React.FC<{text: string; at: number; color: string; hl?: boolean}> = ({text, at, color, hl}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: f - at, fps, config: {damping: 14, stiffness: 120}});
  const sweep = hl ? interpolate(f, [at + 10, at + 26], [0, 1], {...clamp, easing: outExpo}) : 0;
  return (
    <div style={{overflow: "hidden", padding: "48px 24px 0", marginTop: -48}}>
      <div style={{position: "relative", display: "inline-block", transform: `translateY(${(1 - p) * 140}px)`, opacity: p}}>
        {hl && <div style={{position: "absolute", inset: "-2px -20px 0px -20px", background: BRAND, transformOrigin: "left", transform: `scaleX(${sweep})`}} />}
        <div style={{position: "relative", fontFamily: OSWALD, fontWeight: 700, fontSize: 124, lineHeight: 1.2, textTransform: "uppercase", color: hl && sweep < 0.5 ? "#fff" : color}}>{text}</div>
      </div>
    </div>
  );
};

const Confetti: React.FC = () => {
  const f = useCurrentFrame();
  const start = 6;
  const t = Math.max(0, f - start);
  return (
    <AbsoluteFill style={{pointerEvents: "none"}}>
      {new Array(46).fill(0).map((_, i) => {
        const a = random(`a${i}`) * Math.PI * 2;
        const v = 14 + random(`v${i}`) * 26;
        const x = 540 + Math.cos(a) * v * t * 0.9 * Math.min(1, 28 / Math.max(t, 1));
        const y = 760 + Math.sin(a) * v * Math.min(t, 28) * 0.9 + 0.5 * 1.1 * t * t - 0;
        const o = interpolate(t, [0, 4, 70, 100], [0, 1, 1, 0], clamp);
        const w = 12 + random(`w${i}`) * 16;
        return <div key={i} style={{position: "absolute", left: x, top: y, width: w, height: w * 0.55, background: [BRAND, "#fff", "#ff5a4d", "#3b82f6"][i % 4], opacity: o, transform: `rotate(${t * (6 + random(`r${i}`) * 14)}deg)`}} />;
      })}
    </AbsoluteFill>
  );
};

// ───────────────────────── Montagem ─────────────────────────
const KINDS: TKind[] = ["wipe", "stripes", "iris", "slats", "wipe", "stripes", "iris"];

export const RWBFacts: React.FC = () => (
  <AbsoluteFill style={{background: INK}}>
    <Sequence from={0} durationInFrames={INTRO + T_LEN}><Intro /></Sequence>
    {FACTS.map((_, i) => (
      <Sequence key={i} from={INTRO + i * FACT_LEN} durationInFrames={FACT_LEN + T_LEN}><FactScene i={i} /></Sequence>
    ))}
    <Sequence from={INTRO + FACTS.length * FACT_LEN} durationInFrames={OUTRO}><Outro /></Sequence>
    {KINDS.map((kind, k) => (
      <Sequence key={`t${k}`} from={INTRO + k * FACT_LEN - T_LEN / 2} durationInFrames={T_LEN}><Transition kind={kind} /></Sequence>
    ))}
  </AbsoluteFill>
);

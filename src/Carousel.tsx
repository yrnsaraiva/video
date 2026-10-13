import React from "react";
import {AbsoluteFill, Img, staticFile} from "remotion";
import {BRAND, INK, INTER, OSWALD} from "./theme";
import {FactSlide, H, HANDLE, SLIDES, W} from "./carousel";

const PAD = 64;
const TOTAL = SLIDES.length;

const Sparkle: React.FC<{size: number}> = ({size}) => (
  <svg width={size} height={size} viewBox="0 0 100 100">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#ff5a4d" /><stop offset=".5" stopColor={BRAND} /><stop offset="1" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
    <path d="M50 0 C54 30 70 46 100 50 C70 54 54 70 50 100 C46 70 30 54 0 50 C30 46 46 30 50 0Z" fill="url(#g)" />
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

const Cover: React.FC<{prompt: string; photo: string; pos: string}> = ({prompt, photo, pos}) => {
  const parts = prompt.split(/(Gemini,|factos mais interessantes|RUNWITHBROTO)/);
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile(photo)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: pos}} />
      <AbsoluteFill style={{background: "linear-gradient(180deg, rgba(11,11,11,0.55) 0%, rgba(11,11,11,0.05) 38%, rgba(11,11,11,0.15) 55%, rgba(11,11,11,0.92) 100%)"}} />
      <div style={{position: "absolute", left: PAD, right: PAD, top: 150, background: "rgba(11,11,11,0.94)", borderRadius: 64, padding: "52px 52px 44px",
        boxShadow: "0 0 0 3px rgba(255,255,255,0.16), 0 0 80px rgba(250,187,0,0.28)"}}>
        <div style={{fontFamily: INTER, fontWeight: 500, fontSize: 56, lineHeight: 1.25, color: "#e8e8e8"}}>
          {parts.map((p, i) => p === "Gemini," || p === "factos mais interessantes" || p === "RUNWITHBROTO"
            ? <b key={i} style={{fontWeight: 700, color: p === "RUNWITHBROTO" ? BRAND : "#fff"}}>{p}</b>
            : <span key={i}>{p}</span>)}
        </div>
        <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 28}}>
          <Sparkle size={64} />
          <div style={{width: 88, height: 88, borderRadius: 44, background: BRAND, display: "grid", placeItems: "center"}}>
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
          </div>
        </div>
      </div>
      <div style={{position: "absolute", left: PAD, right: PAD, bottom: 150}}>
        <div style={{fontFamily: OSWALD, fontWeight: 700, fontSize: 250, lineHeight: 0.95, color: BRAND, textTransform: "uppercase"}}>6 factos</div>
        <div style={{fontFamily: OSWALD, fontWeight: 500, fontSize: 64, letterSpacing: 4, color: "#fff", textTransform: "uppercase", marginTop: 6}}>sobre o RUNWITHBROTO</div>
      </div>
    </AbsoluteFill>
  );
};

const Fact: React.FC<{s: FactSlide}> = ({s}) => {
  const lines = s.title.split("\n");
  const stat = s.stat;
  return (
    <AbsoluteFill style={{background: INK}}>
      <Img src={staticFile(s.photo)} style={{width: "100%", height: "100%", objectFit: "cover", objectPosition: s.pos, filter: s.cut ? "blur(4px) brightness(0.8)" : undefined}} />
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
              <div style={{position: "relative", fontFamily: OSWALD, fontWeight: 700, fontSize: stat ? 100 : 112, lineHeight: 1.18, textTransform: "uppercase", color: hl ? INK : "#fff"}}>{l}</div>
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
      {s.kind === "cover" && <Cover prompt={s.prompt} photo={s.photo} pos={s.pos} />}
      {s.kind === "fact" && <Fact s={s} />}
      {s.kind === "cta" && <Cta />}
      <Chrome index={index} accent={accent} />
    </AbsoluteFill>
  );
};

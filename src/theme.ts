import {Easing, continueRender, delayRender, staticFile} from "remotion";

export const BRAND = "#fabb00";
export const INK = "#0b0b0b";
export const clamp = {extrapolateLeft: "clamp", extrapolateRight: "clamp"} as const;
export const outExpo = Easing.bezier(0.16, 1, 0.3, 1);
export const inOut = Easing.inOut(Easing.cubic);

// Fontes locais (public/fonts), para o render não depender da rede.
export const OSWALD = "RWB Oswald";
export const INTER = "RWB Inter";
const fontFaces = [
  ["RWB Oswald", 500, "oswald-latin-500-normal"], ["RWB Oswald", 700, "oswald-latin-700-normal"],
  ["RWB Inter", 500, "inter-latin-500-normal"], ["RWB Inter", 600, "inter-latin-600-normal"],
] as const;
if (typeof document !== "undefined") {
  fontFaces.forEach(([family, weight, file]) => {
    const handle = delayRender(`font ${file}`);
    new FontFace(family, `url(${staticFile(`fonts/${file}.woff2`)})`, {weight: String(weight)})
      .load().then((ff) => { document.fonts.add(ff); continueRender(handle); }).catch((e) => { console.error(e); continueRender(handle); });
  });
}

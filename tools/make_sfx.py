"""Gera os efeitos sonoros da capa em vídeo, sincronizados com a animação (30 fps).
Tudo é sintetizado aqui (sem ficheiros de terceiros). Uso: python3 tools/make_sfx.py out.wav"""
import sys, wave
import numpy as np

SR = 44100
FPS = 30
DUR = 10.0
rng = np.random.default_rng(7)
mix = np.zeros((int(SR * DUR), 2))

def add(sig, t, pan=0.0, gain=1.0):
    i = int(t * SR)
    n = min(len(sig), mix.shape[0] - i)
    if n <= 0: return
    l = gain * (1 - max(pan, 0)); r = gain * (1 + min(pan, 0))
    mix[i:i + n, 0] += sig[:n] * l
    mix[i:i + n, 1] += sig[:n] * r

def env(n, attack=0.002, decay=0.02):
    t = np.arange(n) / SR
    return np.minimum(t / attack, 1) * np.exp(-t / decay)

def lowpass(x, a):  # filtro simples de 1 polo
    y = np.zeros_like(x); s = 0.0
    for k in range(len(x)):
        s += a * (x[k] - s); y[k] = s
    return y

def keyclick(pitch=1.0):
    n = int(0.05 * SR); t = np.arange(n) / SR
    noise = rng.standard_normal(n) * env(n, 0.0005, 0.004)
    thump = np.sin(2 * np.pi * 170 * pitch * t) * env(n, 0.001, 0.012)
    tick = np.sin(2 * np.pi * 2400 * pitch * t) * env(n, 0.0003, 0.002)
    return 0.55 * noise + 0.9 * thump + 0.25 * tick

def softtick(pitch=1.0):
    n = int(0.03 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * 1500 * pitch * t) * env(n, 0.0005, 0.006) * 0.8

def whoosh(dur=0.45):
    n = int(dur * SR)
    x = lowpass(rng.standard_normal(n), 0.12)
    t = np.linspace(0, 1, n)
    return x * np.sin(np.pi * t) ** 2 * 1.6

def pop():
    n = int(0.22 * SR); t = np.arange(n) / SR
    f = 420 + 700 * (1 - np.exp(-t / 0.03))
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.002, 0.06) * 0.9 + rng.standard_normal(n) * env(n, 0.0005, 0.004) * 0.15

def blip(freq=660):
    n = int(0.09 * SR); t = np.arange(n) / SR
    return np.sin(2 * np.pi * freq * t) * env(n, 0.004, 0.03) * 0.5

def chime():
    out = np.zeros(int(1.1 * SR))
    for k, (f, dt, g) in enumerate([(880.0, 0.0, 1.0), (1318.5, 0.11, 0.9), (1760.0, 0.22, 0.6)]):
        n = int(0.9 * SR); t = np.arange(n) / SR
        s = (np.sin(2 * np.pi * f * t) + 0.25 * np.sin(2 * np.pi * 2 * f * t)) * env(n, 0.004, 0.22) * g
        i = int(dt * SR); out[i:i + n] += s[:len(out) - i]
    return out * 0.55

PROMPT_LEN = 65                      # len("Gemini, diz-me os factos mais interessantes sobre o RUNWITHBROTO.")
RESP_LEN = 65                        # len("Aqui estão 8 factos sobre o RUNWITHBROTO. Desliza para descobrir.")
fr = lambda f: f / FPS

add(whoosh(), fr(14), gain=0.35)                         # a caixa da pergunta aparece
prev = 0
for f in range(26, 157):                                 # pergunta escrita (frames 26 → 156)
    k = int((f - 26) / 130 * PROMPT_LEN)
    if k != prev:
        add(keyclick(rng.uniform(0.9, 1.15)), fr(f), pan=rng.uniform(-0.25, 0.25), gain=0.5)
        prev = k
add(pop(), fr(160), gain=0.7)                            # botão premido
for i, f in enumerate([164, 170, 176]):                  # a pensar
    add(blip(620 + 90 * i), fr(f), gain=0.35)
add(chime(), fr(180), gain=0.65)                         # ele sorri → resposta
prev = 0
for f in range(182, 246):                                # resposta escrita (frames 180 → 245), mais suave
    k = int((f - 180) / 65 * RESP_LEN)
    if k != prev:
        add(softtick(rng.uniform(0.9, 1.1)), fr(f), pan=rng.uniform(-0.2, 0.2), gain=0.22)
        prev = k

peak = np.abs(mix).max()
mix = mix / peak * 0.7                                   # pico a ~ -3 dBFS
fade = int(0.4 * SR); mix[-fade:] *= np.linspace(1, 0, fade)[:, None]
pcm = (mix * 32767).astype("<i2")
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print("ok", sys.argv[1], round(peak, 3))

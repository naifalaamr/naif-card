// يولّد صورة المعاينة docs/og.png (1200×630) لروابط واتساب وX ولينكدإن
// الاستخدام: node scripts/og.mjs > /tmp/og.html  ثم تُصوَّر الصفحة بمتصفح بمقاس 1200×630
import { QR_SVG } from "../src/qr.js";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const dir = require.resolve("@fontsource/ibm-plex-sans-arabic/package.json").replace("package.json", "files/");
const font = (s, w) => `@font-face{font-family:P;font-weight:${w};src:url(data:font/woff2;base64,${readFileSync(`${dir}ibm-plex-sans-arabic-${s}-${w}-normal.woff2`).toString("base64")}) format("woff2")}`;
const fonts = ["arabic", "latin"].flatMap((s) => [400, 600, 700].map((w) => font(s, w))).join("");
process.stdout.write(`<!DOCTYPE html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><style>${fonts}
*{margin:0;padding:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;font-family:P,sans-serif;color:#E6F4F7;
  background:radial-gradient(60% 80% at 85% 10%,#0E5566 0,transparent 60%),radial-gradient(55% 70% at 10% 95%,#3A2216 0,transparent 65%),radial-gradient(70% 90% at 40% 60%,#0B3440 0,transparent 70%),#06141B;
  display:flex;align-items:center;gap:56px;padding:0 72px;position:relative}
.card{flex:1;height:470px;border-radius:40px;background:rgb(8 28 36 / .55);box-shadow:inset 0 0 0 1.5px rgb(255 255 255 / .12),0 30px 60px -30px #000;
  display:flex;flex-direction:column;justify-content:center;padding:0 56px;position:relative}
.ph{width:132px;height:132px;border-radius:50%;background:linear-gradient(140deg,#0E7490,#164E63);display:grid;place-items:center;font-size:62px;font-weight:700;color:#fff;
  box-shadow:0 0 0 6px #0B2730,0 20px 40px -18px rgb(14 116 144 / .9);margin-bottom:30px}
h1{font-size:62px;font-weight:700;line-height:1.2}
.en{font-size:26px;font-weight:600;color:#A9C2CA;direction:ltr;text-align:right;margin-top:6px}
.role{font-size:30px;font-weight:600;color:#67D4E6;margin-top:18px}
.side{width:300px;display:flex;flex-direction:column;align-items:center;gap:18px}
.qr{width:270px;height:270px;border-radius:30px;background:#0A222B;padding:24px;box-shadow:inset 0 0 0 1.5px rgb(127 221 235 / .2)}
.qr svg{width:100%;height:100%;display:block}
.qd{fill:#7FDDEB}.qe{stroke:#A5ECF5}.qi{fill:#E6F4F7}.qb{fill:#0A222B}.ql{fill:#67D4E6}.qt{fill:#0A222B}
.cap{font-size:22px;font-weight:600;color:#A9C2CA}
.url{font-size:20px;color:#67D4E6;direction:ltr;font-weight:600}
.brand{position:absolute;top:34px;left:72px;font-size:22px;font-weight:700;letter-spacing:.04em;color:#E6F4F7;direction:ltr}
.brand i{font-style:normal;color:#67D4E6}
</style></head><body>
<div class="brand">Naif<i>.</i>Card</div>
<div class="card"><div class="ph">ن</div><h1>نايف بن سعيد الزهراني</h1><div class="en">Naif Saeed Alzahrani</div>
<div class="role">متخصص في القطاع غير الربحي والتنمية المجتمعية</div></div>
<div class="side"><div class="qr">${QR_SVG}</div><div class="cap">امسح الرمز لحفظ البطاقة</div><div class="url">naifalaamr.github.io/naif-card</div></div>
</body></html>`);

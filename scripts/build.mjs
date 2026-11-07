// يبني البطاقة في ملف واحد: docs/index.html (+ ملفات جهة الاتصال)
import { build } from "esbuild";
import QRCode from "qrcode";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const CARD_URL = "https://naifalaamr.github.io/naif-card/";

// 1) رمز QR حقيقي يشير إلى رابط البطاقة
const qr = await QRCode.toString(CARD_URL, { type: "svg", errorCorrectionLevel: "M", margin: 0, color: { dark: "#0B2730", light: "#FFFFFF" } });
writeFileSync("src/qr.js", `// مُولَّد تلقائيًا من scripts/build.mjs\nexport const CARD_URL = ${JSON.stringify(CARD_URL)};\nexport const QR_SVG = ${JSON.stringify(qr.replace(/<\?xml[^>]*>/, "").trim())};\n`);

// 2) تجميع الكود
const out = await build({
  entryPoints: ["src/main.jsx"], bundle: true, minify: true, format: "iife", write: false,
  jsx: "automatic", loader: { ".svg": "text", ".js": "jsx" }, outdir: "out",
  define: { "process.env.NODE_ENV": '"production"' }, logLevel: "warning",
});
const js = out.outputFiles.find((f) => f.path.endsWith(".js")).text.replace(/<\/script/g, "<\\/script");
const css = out.outputFiles.find((f) => f.path.endsWith(".css")).text;

// 3) خط IBM Plex Sans Arabic مضمَّن (عربي + لاتيني)
const fontDir = require.resolve("@fontsource/ibm-plex-sans-arabic/package.json").replace("package.json", "files/");
let fonts = "";
for (const [subset, range] of [["arabic", "U+0600-06FF,U+0750-077F,U+0870-08FF,U+FB50-FDFF,U+FE70-FEFF,U+200C-200E"], ["latin", "U+0000-00FF,U+2000-206F"]]) {
  for (const w of [400, 500, 600, 700]) {
    const b64 = readFileSync(`${fontDir}ibm-plex-sans-arabic-${subset}-${w}-normal.woff2`).toString("base64");
    fonts += `@font-face{font-family:"IBM Plex Sans Arabic";font-weight:${w};font-display:swap;src:url(data:font/woff2;base64,${b64}) format("woff2");unicode-range:${range}}\n`;
  }
}

const favicon = `data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="32" fill="#0E7490"/><text x="32" y="44" font-size="34" text-anchor="middle" fill="#fff" font-family="sans-serif" font-weight="700">ن</text></svg>')}`;

const html = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#E0F7FA">
<title>نايف سعيد الزهراني</title>
<meta name="description" content="متخصص في القطاع غير الربحي والتنمية المجتمعية">
<meta property="og:title" content="نايف سعيد الزهراني">
<meta property="og:description" content="متخصص في القطاع غير الربحي والتنمية المجتمعية">
<meta property="og:url" content="${CARD_URL}">
<meta property="og:type" content="profile">
<link rel="icon" href="${favicon}">
<style>${fonts}${css}</style>
</head>
<body><div id="root"></div><script>${js}</script></body>
</html>`;

mkdirSync("docs", { recursive: true });
writeFileSync("docs/index.html", html);
writeFileSync("docs/.nojekyll", "");

// 4) ملفات جهة الاتصال (vCard) بالعربي والإنجليزي
const PHONE = "+966500383626", EMAIL = "n4if.017@gmail.com";
const URLS = ["https://www.linkedin.com/in/naif-al-amer-2b200b192/", "https://x.com/naifalaamr", CARD_URL];
const vcards = {
  ar: { n: "الزهراني;نايف سعيد;;;", fn: "نايف سعيد الزهراني", title: "متخصص في القطاع غير الربحي والتنمية المجتمعية", note: "مهتم بالإدارة غير الربحية، والتنمية المجتمعية، والتقنية والذكاء الاصطناعي." },
  en: { n: "Alzahrani;Naif Saeed;;;", fn: "Naif Saeed Alzahrani", title: "Nonprofit Sector & Community Development Specialist", note: "Interested in nonprofit management, community development, technology, and AI." },
};
for (const [lang, v] of Object.entries(vcards)) {
  const lines = ["BEGIN:VCARD", "VERSION:3.0", `N;CHARSET=UTF-8:${v.n}`, `FN;CHARSET=UTF-8:${v.fn}`, `TITLE;CHARSET=UTF-8:${v.title}`,
    `TEL;TYPE=CELL:${PHONE}`, `EMAIL;TYPE=INTERNET:${EMAIL}`, ...URLS.map((u) => `URL:${u}`), `NOTE;CHARSET=UTF-8:${v.note}`, "END:VCARD"];
  writeFileSync(`docs/naif-alzahrani-${lang}.vcf`, lines.join("\r\n") + "\r\n");
}

console.log(`✓ docs/index.html (${(html.length / 1024).toFixed(0)} KB)`);

import React from "react";
import { createRoot } from "react-dom/client";
import { createPortal } from "react-dom";
import { Glass } from "glisse";
import { MeshGradient } from "@paper-design/shaders-react";
import "glisse/styles.css";
import "./card.css";
import { LANG_AR, LANG_EN } from "./langicons.js";
import { QR_SVG, CARD_URL } from "./qr.js";

// أيقونات Tabler Icons (MIT)
import icPhone from "@tabler/icons/outline/phone.svg";
import icWa from "@tabler/icons/outline/brand-whatsapp.svg";
import icMail from "@tabler/icons/outline/mail.svg";
import icIn from "@tabler/icons/outline/brand-linkedin.svg";
import icX from "@tabler/icons/outline/brand-x.svg";
import icSave from "@tabler/icons/outline/user-plus.svg";
import icQr from "@tabler/icons/outline/qrcode.svg";
import icBack from "@tabler/icons/outline/arrow-back-up.svg";
import icCopy from "@tabler/icons/outline/copy.svg";
import icCheck from "@tabler/icons/outline/check.svg";
import icSun from "@tabler/icons/outline/sun.svg";
import icMoon from "@tabler/icons/outline/moon.svg";
import icAuto from "@tabler/icons/filled/contrast.svg";

const PHONE = "+966500383626";
const PHONE_TXT = "+966 50 038 3626";
const EMAIL = "n4if.017@gmail.com";
const LINKEDIN = "https://www.linkedin.com/in/naif-al-amer-2b200b192/";
const X_URL = "https://x.com/naifalaamr";
const WA = "https://wa.me/966500383626";

const T = {
  ar: {
    dir: "rtl", name: "نايف بن سعيد الزهراني", initial: "ن",
    role: "متخصص في القطاع غير الربحي والتنمية المجتمعية",
    bio: "مهتم بالإدارة غير الربحية، والتنمية المجتمعية، والتقنية والذكاء الاصطناعي.",
    phoneLbl: "الجوال", emailLbl: "البريد", showQr: "عرض رمز QR", back: "رجوع",
    qrNote: "امسح الرمز لفتح البطاقة",
    devBy: "تم التطوير بواسطة", dev: "نايف آل عامر",
    deskQrTitle: "احفظ البطاقة في جوالك", deskQrSub: "امسح الرمز بكاميرا الجوال لفتح البطاقة وحفظ جهة الاتصال", save: "حفظ جهة الاتصال",
    call: "اتصال", wa: "واتساب", mail: "البريد", nav: "وسائل التواصل",
    copiedPhone: "تم نسخ رقم الجوال", copiedEmail: "تم نسخ البريد", copy: "نسخ",
    photo: "الصورة الشخصية (بديل مؤقت)", langBtn: "English", langAria: "Switch to English",
    modeLbl: "المظهر", modes: { auto: "تلقائي", light: "فاتح", dark: "داكن" }, modeHint: "اضغط للتغيير",
    vN: "الزهراني;نايف;بن سعيد;;",
  },
  en: {
    // ⚠️ التهجئة الإنجليزية للاسم بانتظار تأكيد نايف
    dir: "ltr", name: "Naif Saeed Alzahrani", initial: "N",
    role: "Nonprofit Sector & Community Development Specialist",
    bio: "Interested in nonprofit management, community development, technology, and AI.",
    phoneLbl: "Mobile", emailLbl: "Email", showQr: "Show QR code", back: "Back",
    qrNote: "Scan to open this card",
    devBy: "Developed by", dev: "Naif Al-Amer",
    deskQrTitle: "Take this card to your phone", deskQrSub: "Scan with your phone camera to open the card and save the contact", save: "Save Contact",
    call: "Call", wa: "WhatsApp", mail: "Email", nav: "Contact options",
    copiedPhone: "Phone number copied", copiedEmail: "Email copied", copy: "Copy",
    photo: "Profile photo (placeholder)", langBtn: "عربي", langAria: "التبديل إلى العربية",
    modeLbl: "Appearance", modes: { auto: "Automatic", light: "Light", dark: "Dark" }, modeHint: "Tap to change",
    vN: "Alzahrani;Naif;Saeed;;",
  },
};

const qs = new URLSearchParams(location.search);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* ignore */ } },
};
const initialLang = qs.get("lang") || window.__LANG || store.get("nc-lang") || ((navigator.language || "ar").toLowerCase().startsWith("ar") ? "ar" : "en");
const initialMode = qs.get("theme") || window.__THEME || store.get("nc-theme") || "auto";
const sysDark = window.matchMedia("(prefers-color-scheme: dark)");

function Icon({ svg, size = 24, stroke = 1.6 }) {
  const html = svg.replace(/width="24"/, `width="${size}"`).replace(/height="24"/, `height="${size}"`).replace(/stroke-width="2"/, `stroke-width="${stroke}"`);
  return <span className="tic" aria-hidden="true" dangerouslySetInnerHTML={{ __html: html }} />;
}

// ملف جهة الاتصال ملف حقيقي على الاستضافة: يفتح شاشة «إضافة جهة اتصال» مباشرة في آيفون وأندرويد
function saveContact(lang) {
  window.location.href = `./naif-alzahrani-${lang}.vcf`;
}

function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
  const el = document.createElement("textarea"); el.value = text; el.setAttribute("readonly", ""); el.style.position = "fixed"; el.style.opacity = "0";
  document.body.appendChild(el); el.select(); try { document.execCommand("copy"); } finally { el.remove(); }
  return Promise.resolve();
}

const press = (fn) => ({
  role: "button", tabIndex: 0, onClick: fn,
  onKeyDown: (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); fn(e); } },
});

// الخلفية الحية: Mesh Gradient من Paper Shaders (Apache 2.0)
const MESH = {
  light: ["#F4FBFC", "#BFEAF2", "#7DD3E3", "#FBE3D2"],
  dark: ["#06141B", "#0B3440", "#0E5566", "#3A2216"],
};

function FlipCard({ t }) {
  const [back, setBack] = React.useState(false);
  const [turning, setTurning] = React.useState(false);
  const [copied, setCopied] = React.useState("");
  const reduce = React.useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const flip = () => {
    if (turning) return;
    if (reduce) { setBack((b) => !b); return; }
    setTurning(true);
    setTimeout(() => { setBack((b) => !b); setTurning(false); }, 190);
  };
  const doCopy = (e, text, msg) => {
    e.stopPropagation();
    copyText(text).then(() => { setCopied(msg); clearTimeout(window.__ct); window.__ct = setTimeout(() => setCopied(""), 1800); });
  };
    const items = [
    { k: "p", label: t.phoneLbl, value: PHONE_TXT, raw: PHONE, msg: t.copiedPhone },
    { k: "e", label: t.emailLbl, value: EMAIL, raw: EMAIL, msg: t.copiedEmail },
  ];
  return (
    <div className="flipzone">
      <div className={`flipper${turning ? " turning" : ""}`}>
        <Glass className="panel id">
          <div className="ph" role="img" aria-label={t.photo}>{t.initial}</div>
          <div className="faces">
            <div className={`face front${back ? " off" : ""}`} aria-hidden={back}>
              <h1 className="name">{t.name}</h1>
              <p className="role">{t.role}</p>
              <p className="bio">{t.bio}</p>
              <div className="ct ct-lines">
                {items.map((it) => (
                  <button key={it.k} type="button" className="copy" tabIndex={back ? -1 : 0}
                    onClick={(e) => doCopy(e, it.raw, it.msg)} aria-label={`${t.copy} ${it.label} ${it.value}`}>
                    <small>{it.label}</small><span className="ltr">{it.value}</span>
                    <span className="cp"><Icon svg={copied === it.msg ? icCheck : icCopy} size={13} stroke={1.8} /></span>
                  </button>
                ))}
              </div>
            </div>
            <div className={`face back${back ? "" : " off"}`} aria-hidden={!back}>
              <Glass className="qrbox"><span className="qr" role="img" aria-label={`QR: ${CARD_URL}`} dangerouslySetInnerHTML={{ __html: QR_SVG }} /></Glass>
              <small className="qrnote">{t.qrNote}</small>
            </div>
          </div>
          <Glass className="flipbtn">
            <button type="button" className="hit" aria-pressed={back} onClick={(e) => { e.stopPropagation(); flip(); }}>
              <Icon svg={back ? icBack : icQr} size={15} stroke={1.8} />{back ? t.back : t.showQr}
            </button>
          </Glass>
        </Glass>
      </div>
      <span className="sr" role="status" aria-live="polite">{copied}</span>
      {copied && createPortal(<div key={copied + Date.now()} className="toast" aria-hidden="true"><Icon svg={icCheck} size={16} stroke={2} />{copied}</div>, document.body)}
    </div>
  );
}

function Card() {
  const [lang, setLang] = React.useState(T[initialLang] ? initialLang : "ar");
  const [mode, setMode] = React.useState(["auto", "light", "dark"].includes(initialMode) ? initialMode : "auto");
  const [sys, setSys] = React.useState(sysDark.matches ? "dark" : "light");
  React.useEffect(() => { const f = (e) => setSys(e.matches ? "dark" : "light"); sysDark.addEventListener("change", f); return () => sysDark.removeEventListener("change", f); }, []);
  const theme = mode === "auto" ? sys : mode;
  const reduceMotion = React.useMemo(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches, []);
  const [visible, setVisible] = React.useState(!document.hidden);
  React.useEffect(() => { const f = () => setVisible(!document.hidden); document.addEventListener("visibilitychange", f); return () => document.removeEventListener("visibilitychange", f); }, []);
  const meshSpeed = reduceMotion || !visible ? 0 : 0.35;
  const t = T[lang];
  React.useEffect(() => {
    const h = document.documentElement;
    h.lang = lang; h.dir = t.dir; h.dataset.theme = theme;
    h.style.colorScheme = theme;
    document.title = t.name;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", theme === "dark" ? "#081C24" : "#EAF6F8");
  }, [lang, theme]);
  const toggleLang = () => { const n = lang === "ar" ? "en" : "ar"; setLang(n); store.set("nc-lang", n); };
  const NEXT = { auto: "light", light: "dark", dark: "auto" };
  const cycleMode = () => { const n = NEXT[mode]; setMode(n); store.set("nc-theme", n); };
  const MODE_ICON = { auto: icAuto, light: icSun, dark: icMoon };
  const acts = [
    { k: "call", label: t.call, href: `tel:${PHONE}`, icon: icPhone },
    { k: "wa", label: t.wa, href: WA, icon: icWa, ext: true },
    { k: "mail", label: t.mail, href: `mailto:${EMAIL}`, icon: icMail },
    { k: "in", label: "LinkedIn", href: LINKEDIN, icon: icIn, ext: true },
    { k: "x", label: "X", href: X_URL, icon: icX, ext: true },
  ];
  return (
    <>
      <div className={`wall wall-${theme}`} aria-hidden="true">
        <MeshGradient style={{ width: "100%", height: "100%" }} colors={MESH[theme]} distortion={0.8} swirl={0.25} speed={meshSpeed} />
      </div>
    <main className={`app theme-${theme}`} dir={t.dir} lang={lang}>

      <div className="topbar" dir="rtl">
        <Glass className="tbtn round lang">
          <button type="button" className="hit" aria-label={t.langAria} title={t.langAria} onClick={toggleLang}>
            <span key={lang} className="lg" aria-hidden="true" dangerouslySetInnerHTML={{ __html: `<svg viewBox="0 0 24 24" width="24" height="24">${lang === "ar" ? LANG_EN : LANG_AR}</svg>` }} />
          </button>
        </Glass>
        <Glass className="tbtn round mode">
          <button type="button" className="hit" aria-label={`${t.modeLbl}: ${t.modes[mode]}. ${t.modeHint}`} title={`${t.modeLbl}: ${t.modes[mode]}`} onClick={cycleMode}>
            <span key={mode} className="mi"><Icon svg={MODE_ICON[mode]} size={20} stroke={1.8} /></span>
          </button>
        </Glass>
      </div>

      <div className="layout">
      <FlipCard key={lang} t={t} />
      <div className="side">
      <Glass className="panel qrside" aria-hidden="false">
        <div className="qrplate" role="img" aria-label={`QR: ${CARD_URL}`} dangerouslySetInnerHTML={{ __html: QR_SVG }} />
        <div className="qrtext"><b>{t.deskQrTitle}</b><small>{t.deskQrSub}</small></div>
      </Glass>

      <Glass className="cta"><button type="button" className="hit" onClick={() => saveContact(lang)}><Icon svg={icSave} size={22} stroke={1.9} />{t.save}</button></Glass>

      <nav className="acts" dir="rtl" aria-label={t.nav}>
        {acts.map((a) => (
          <a key={a.k} className="act" href={a.href} aria-label={a.label} {...(a.ext ? { target: "_blank", rel: "noopener" } : {})}>
            <Glass className="ic"><Icon svg={a.icon} size={30} stroke={1.75} /></Glass>
            <span>{a.label}</span>
          </a>
        ))}
      </nav>
      </div>
      </div>
    </main>
    <footer className={`app-foot theme-${theme} foot-wrap`} dir={t.dir} lang={lang}>
      <div className="foot"><div className="fl" /><p>{t.devBy} <b>{t.dev}</b></p><small>Naif Card © 2026</small></div>
    </footer>
    </>
  );
}

createRoot(document.getElementById("root")).render(<Card />);

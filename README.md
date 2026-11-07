# Naif Card

بطاقة تعارف شخصية رقمية لـ **نايف سعيد الزهراني**، تُفتح عبر NFC أو رمز QR في المعارض والمؤتمرات.

**الرابط:** https://naifalaamr.github.io/naif-card/

## المزايا

- صفحة واحدة للجوال، كل المحتوى ظاهر بلا تمرير (من 320×500 فأكبر).
- عربي وإنجليزي بزر واحد، والبطاقة تفتح بلغة جوال الزائر تلقائيًا.
- مظهر تلقائي / فاتح / داكن.
- زر «حفظ جهة الاتصال» يفتح ملف vCard حقيقي (`docs/naif-alzahrani-ar.vcf` و`-en.vcf`).
- نسخ الرقم والبريد بضغطة، وقلب البطاقة لعرض رمز QR.
- زجاج سائل (Glisse) وخلفية حية (Mesh Gradient).

## البناء

```bash
npm install
npm run build
```

يُنتج `docs/index.html` (ملف واحد مستقل بالخط مضمَّنًا) وملفات جهة الاتصال ورمز QR.
GitHub Pages ينشر مجلد `docs/` من فرع `main`.

لتعديل البيانات: `src/main.jsx` (النصوص) و`scripts/build.mjs` (ملفات جهة الاتصال ورابط QR).

## مكونات مفتوحة المصدر

| المكوّن | الاستخدام | الرخصة |
|---|---|---|
| [Glisse](https://github.com/0kzh/glisse) | الزجاج السائل | MIT |
| [Paper Shaders](https://github.com/paper-design/shaders) | خلفية Mesh Gradient | Apache-2.0 |
| [Tabler Icons](https://github.com/tabler/tabler-icons) | الأيقونات | MIT |
| [Material Design Icons](https://github.com/Templarian/MaterialDesign) | أيقونتا اللغة | Apache-2.0 |
| [IBM Plex Sans Arabic](https://github.com/IBM/plex) | الخط | OFL-1.1 |
| [React](https://react.dev) | الواجهة | MIT |
| [node-qrcode](https://github.com/soldair/node-qrcode) | توليد رمز QR | MIT |

فكرة قلب البطاقة مستوحاة من Card Flip في [Kokonut UI](https://github.com/kokonut-labs/kokonutui) (MIT).

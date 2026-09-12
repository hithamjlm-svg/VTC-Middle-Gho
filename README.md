# VTC - Middle Gho

بوابة تسجيل الطلاب لمعهد تدريب مهني الغور الأوسط.

هذا المشروع مبني باستخدام Next.js ويدعم التسجيل، الاستعلام عن الطلبات، ولوحة متابعة مرتبطة بقاعدة PostgreSQL عبر Drizzle ORM.

## التشغيل المحلي

```bash
pnpm install
cp .env.example .env
# ضع DATABASE_URL في ملف .env
pnpm dev
```

## البناء والتحقق

```bash
pnpm typecheck
pnpm lint
pnpm build
```

## النشر

يحتاج المشروع إلى استضافة تدعم Node.js وNext.js وقاعدة PostgreSQL. GitHub يحفظ الكود ويجعله عامًا، لكنه لا يشغّل واجهات API وقاعدة البيانات عبر GitHub Pages وحده.

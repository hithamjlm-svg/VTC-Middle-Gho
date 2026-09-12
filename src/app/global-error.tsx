"use client";

export default function GlobalError() {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0, fontFamily: "Arial, sans-serif", background: "#f8fafc", color: "#0f172a" }}>
        <main style={{ maxWidth: 720, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
          <h1>حدث خطأ غير متوقع</h1>
          <p>يرجى إعادة تحميل الصفحة والمحاولة مرة أخرى.</p>
          <a href="/" style={{ color: "#b91c1c", fontWeight: 700 }}>العودة إلى الصفحة الرئيسية</a>
        </main>
      </body>
    </html>
  );
}

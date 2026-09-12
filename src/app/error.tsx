"use client";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main style={{ maxWidth: 720, margin: "0 auto", padding: "96px 24px", textAlign: "center" }}>
      <h1>تعذر تحميل الصفحة</h1>
      <p>حدث خطأ مؤقت. يمكنك إعادة المحاولة الآن.</p>
      <button type="button" onClick={() => reset()} style={{ padding: "12px 20px", cursor: "pointer" }}>
        إعادة المحاولة
      </button>
    </main>
  );
}

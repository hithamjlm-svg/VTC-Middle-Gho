import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "بوابة تسجيل الطلاب | معهد تدريب مهني الغور الأوسط",
  description:
    "صفحة واحدة متكاملة للتسجيل والاستعلام في معهد تدريب مهني الغور الأوسط — مؤسسة التدريب المهني الأردنية: التخصصات، المزايا، الوثائق المطلوبة، استمارة التسجيل الإلكترونية، والاستعلام عن حالة الطلب.",
  keywords: [
    "معهد الغور الأوسط",
    "مؤسسة التدريب المهني",
    "تسجيل معهد الغور الأوسط",
    "تدريب مهني الأردن",
    "الطاقة الشمسية",
    "ميكانيك مركبات",
    "كهرباء مركبات",
    "تكييف وتبريد",
    "دهان مركبات",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-slate-50 text-slate-900 antialiased selection:bg-red-700 selection:text-white">
        {children}
      </body>
    </html>
  );
}

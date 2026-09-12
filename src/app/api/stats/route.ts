import { NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";

export async function GET() {
  try {
    const all = await db.select().from(applications);

    const total = all.length;
    const byStatus: Record<string, number> = {
      "قيد المراجعة": 0,
      "بانتظار المقابلة": 0,
      "مقبول مبدئياً": 0,
      "مقبول نهائياً": 0,
      "مرفوض": 0,
    };

    const bySpecialization: Record<string, number> = {
      "الطاقة الشمسية": 0,
      "ميكانيك مركبات": 0,
      "كهرباء مركبات": 0,
      "تكييف وتبريد": 0,
      "دهان مركبات": 0,
      "مدخل بيانات": 0,
    };

    let femalesCount = 0;
    let malesCount = 0;

    let aidBeneficiariesCount = 0;
    let jordaniansCount = 0;
    let nonJordaniansCount = 0;

    for (const app of all) {
      if (app.status && byStatus[app.status] !== undefined) {
        byStatus[app.status]++;
      } else {
        byStatus["قيد المراجعة"]++;
      }

      if (app.primarySpecialization && bySpecialization[app.primarySpecialization] !== undefined) {
        bySpecialization[app.primarySpecialization]++;
      }

      if (app.isAidBeneficiary) aidBeneficiariesCount++;
      if (app.nationality === "أردني") jordaniansCount++;
      else nonJordaniansCount++;
      if (app.gender === "أنثى") femalesCount++;
      else if (app.gender === "ذكر") malesCount++;
    }

    return NextResponse.json({
      success: true,
      stats: {
        total,
        byStatus,
        bySpecialization,
        aidBeneficiariesCount,
        jordaniansCount,
        nonJordaniansCount,
        femalesCount,
        malesCount,
      },
    });
  } catch (error) {
    console.error("Error generating stats:", error);
    return NextResponse.json(
      { success: false, error: "تعذر احتساب الإحصائيات" },
      { status: 500 }
    );
  }
}

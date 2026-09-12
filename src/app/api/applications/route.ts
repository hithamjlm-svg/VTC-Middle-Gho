import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { desc, eq, or, ilike, and } from "drizzle-orm";
import { assertFemaleOnlyRespected, normalizeGender } from "@/lib/specializationRules";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();
    const status = searchParams.get("status")?.trim();
    const specialization = searchParams.get("specialization")?.trim();
    const nationality = searchParams.get("nationality")?.trim();

    const conditions = [];

    if (search) {
      conditions.push(
        or(
          ilike(applications.fullName, `%${search}%`),
          ilike(applications.nationalId, `%${search}%`),
          ilike(applications.applicationNumber, `%${search}%`),
          ilike(applications.phoneNumber, `%${search}%`)
        )
      );
    }

    if (status && status !== "ALL") {
      conditions.push(eq(applications.status, status));
    }

    if (specialization && specialization !== "ALL") {
      conditions.push(eq(applications.primarySpecialization, specialization));
    }

    if (nationality && nationality !== "ALL") {
      conditions.push(eq(applications.nationality, nationality));
    }

    const query = conditions.length > 0
      ? db.select().from(applications).where(and(...conditions)).orderBy(desc(applications.createdAt))
      : db.select().from(applications).orderBy(desc(applications.createdAt));

    const records = await query;
    return NextResponse.json({ success: true, applications: records });
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { success: false, error: "فشل استرجاع بيانات الطلبات" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      fullName,
      nationality = "أردني",
      nationalId,
      birthDate,
      age,
      gender = "ذكر",
      birthPlace = "داخل المملكة",
      isAidBeneficiary = false,
      phoneNumber,
      whatsappNumber,
      emergencyPhone,
      governorate = "البلقاء",
      district = "الغور الأوسط",
      detailedAddress,
      iban,
      guarantorName,
      guarantorPhone,
      educationLevel,
      schoolName,
      graduationYear,
      isPhysicallyFit = true,
      primarySpecialization,
      secondarySpecialization,
      motivation,
      documentsSubmitted = "[]",
    } = body;

    // Validation
    if (!fullName || !nationalId || !phoneNumber || !primarySpecialization || !educationLevel) {
      return NextResponse.json(
        { success: false, error: "يرجى تعبئة جميع الحقول الإلزامية المطلوبة" },
        { status: 400 }
      );
    }

    // دورة «مدخل بيانات» للإناث فقط — يُرفض أي متدرب ذكر (كرغبة أولى أو ثانية)
    const guard = assertFemaleOnlyRespected({
      gender,
      primarySpecialization,
      secondarySpecialization,
    });
    if (!guard.ok) {
      return NextResponse.json({ success: false, error: guard.error }, { status: 400 });
    }

    const calculatedAge = Number(age) || 16;
    if (calculatedAge < 16) {
      return NextResponse.json(
        {
          success: false,
          error: "شروط القبول تنص على ألا يقل عمر المتدرب عن 16 عاماً",
        },
        { status: 400 }
      );
    }

    // Check if nationalId already registered
    const existing = await db
      .select()
      .from(applications)
      .where(eq(applications.nationalId, nationalId.trim()))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `يوجد طلب مسجل مسبقاً لهذا الرقم الوطني/الجواز (${nationalId}). يمكنك متابعة حالة الطلب برقم الطلب: ${existing[0].applicationNumber}`,
          applicationNumber: existing[0].applicationNumber,
        },
        { status: 409 }
      );
    }

    // Generate readable professional application number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const datePrefix = new Date().getFullYear();
    const appNumber = `VTC-GHR-${datePrefix}-${randomSuffix}`;

    const [newRecord] = await db
      .insert(applications)
      .values({
        applicationNumber: appNumber,
        fullName: fullName.trim(),
        nationality,
        nationalId: nationalId.trim(),
        birthDate: birthDate || "",
        age: calculatedAge,
        gender: normalizeGender(gender),
        birthPlace,
        isAidBeneficiary: Boolean(isAidBeneficiary),
        phoneNumber: phoneNumber.trim(),
        whatsappNumber: whatsappNumber ? whatsappNumber.trim() : phoneNumber.trim(),
        emergencyPhone: emergencyPhone ? emergencyPhone.trim() : null,
        governorate,
        district,
        detailedAddress: detailedAddress || null,
        iban: iban ? iban.trim() : null,
        guarantorName: guarantorName ? guarantorName.trim() : null,
        guarantorPhone: guarantorPhone ? guarantorPhone.trim() : null,
        educationLevel,
        schoolName: schoolName || null,
        graduationYear: graduationYear || null,
        isPhysicallyFit: Boolean(isPhysicallyFit),
        primarySpecialization: String(primarySpecialization).trim(),
        secondarySpecialization: secondarySpecialization ? String(secondarySpecialization).trim() : null,
        motivation: motivation || null,
        status: "قيد المراجعة",
        interviewDate: "سيتم تحديده لاحقاً بعد تدقيق الوثائق",
        supervisorNotes: isAidBeneficiary ? "المتقدم مستفيد من صندوق المعونة الوطنية - مؤهل للإعفاء والبدل الشهري" : "طلب جديد بانتظار استكمال الوثائق الورقية",
        documentsSubmitted: typeof documentsSubmitted === "string" ? documentsSubmitted : JSON.stringify(documentsSubmitted),
      })
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم تسجيل طلبك بنجاح في معهد تدريب مهني الغور الأوسط",
      application: newRecord,
    });
  } catch (error) {
    console.error("Error creating application:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء حفظ الطلب. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

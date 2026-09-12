import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { applications } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { assertFemaleOnlyRespected, normalizeGender } from "@/lib/specializationRules";

interface Params {
  params: Promise<{ idOrNumber: string }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { idOrNumber } = await params;
    const decoded = decodeURIComponent(idOrNumber).trim();

    const isNumeric = /^\d+$/.test(decoded);

    let records;
    if (isNumeric && Number(decoded) < 100000) {
      records = await db
        .select()
        .from(applications)
        .where(
          or(
            eq(applications.id, Number(decoded)),
            eq(applications.nationalId, decoded),
            eq(applications.applicationNumber, decoded)
          )
        )
        .limit(1);
    } else {
      records = await db
        .select()
        .from(applications)
        .where(
          or(
            eq(applications.applicationNumber, decoded),
            eq(applications.nationalId, decoded)
          )
        )
        .limit(1);
    }

    if (!records || records.length === 0) {
      return NextResponse.json(
        { success: false, error: "لم يتم العثور على طلب مطابق للرقم المدخل" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, application: records[0] });
  } catch (error) {
    console.error("Error retrieving application:", error);
    return NextResponse.json(
      { success: false, error: "حدث خطأ أثناء البحث عن الطلب" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const { idOrNumber } = await params;
    const decoded = decodeURIComponent(idOrNumber).trim();
    const body = await request.json();

    const isNumeric = /^\d+$/.test(decoded) && Number(decoded) < 100000;
    const condition = isNumeric
      ? eq(applications.id, Number(decoded))
      : eq(applications.applicationNumber, decoded);

    const existing = await db.select().from(applications).where(condition).limit(1);

    if (existing.length === 0) {
      return NextResponse.json(
        { success: false, error: "الطلب غير موجود للتحديث" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (body.status !== undefined) updateData.status = body.status;
    if (body.interviewDate !== undefined) updateData.interviewDate = body.interviewDate;
    if (body.supervisorNotes !== undefined) updateData.supervisorNotes = body.supervisorNotes;
    if (body.documentsSubmitted !== undefined) {
      updateData.documentsSubmitted =
        typeof body.documentsSubmitted === "string"
          ? body.documentsSubmitted
          : JSON.stringify(body.documentsSubmitted);
    }
    if (body.primarySpecialization !== undefined) {
      updateData.primarySpecialization = body.primarySpecialization;
    }
    if (body.secondarySpecialization !== undefined) {
      updateData.secondarySpecialization = body.secondarySpecialization;
    }
    if (body.gender !== undefined) {
      updateData.gender = normalizeGender(body.gender);
    }
    if (body.iban !== undefined) updateData.iban = body.iban;

    // دورة «مدخل بيانات» للإناث فقط — يُمنع تعيين أي متدرب ذكر فيها
    const guard = assertFemaleOnlyRespected({
      gender: body.gender !== undefined ? body.gender : existing[0].gender,
      primarySpecialization:
        body.primarySpecialization !== undefined
          ? body.primarySpecialization
          : existing[0].primarySpecialization,
      secondarySpecialization:
        body.secondarySpecialization !== undefined
          ? body.secondarySpecialization
          : existing[0].secondarySpecialization,
    });
    if (!guard.ok) {
      return NextResponse.json({ success: false, error: guard.error }, { status: 400 });
    }

    const [updated] = await db
      .update(applications)
      .set(updateData)
      .where(condition)
      .returning();

    return NextResponse.json({
      success: true,
      message: "تم تحديث حالة الطلب بنجاح",
      application: updated,
    });
  } catch (error) {
    console.error("Error updating application:", error);
    return NextResponse.json(
      { success: false, error: "فشل تحديث الطلب" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const { idOrNumber } = await params;
    const decoded = decodeURIComponent(idOrNumber).trim();
    const isNumeric = /^\d+$/.test(decoded) && Number(decoded) < 100000;

    const condition = isNumeric
      ? eq(applications.id, Number(decoded))
      : eq(applications.applicationNumber, decoded);

    await db.delete(applications).where(condition);

    return NextResponse.json({ success: true, message: "تم حذف الطلب بنجاح" });
  } catch (error) {
    console.error("Error deleting application:", error);
    return NextResponse.json(
      { success: false, error: "فشل حذف الطلب" },
      { status: 500 }
    );
  }
}

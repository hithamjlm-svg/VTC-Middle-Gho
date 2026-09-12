/**
 * قواعد التخصصات — معهد تدريب مهني الغور الأوسط
 *
 * القاعدة الحاكمة: دورة «مدخل بيانات» للإناث فقط.
 * لا يُقبل أي متدرب ذكر في هذا التخصص — لا كرغبة أولى ولا كرغبة بديلة.
 * تُطبّق هذه القاعدة في الواجهة، وفي مسارات الـ API (إنشاء + تعديل)،
 * وعلى مستوى قاعدة البيانات عبر قيد CHECK في src/db/schema.ts.
 */

export const FEMALE_ONLY_SPECIALIZATION = "مدخل بيانات";

export const FEMALE_ONLY_ERROR =
  "دورة «مدخل بيانات» مخصصة للإناث فقط — لا يُقبل أي متدرب ذكر في هذا التخصص. يرجى اختيار تخصص آخر.";

export const FEMALE_ONLY_SECONDARY_ERROR =
  "دورة «مدخل بيانات» للإناث فقط، ولا يمكن اختيارها كرغبة ثانية للمتدرب الذكر.";

const FEMALE_VARIANTS = ["أنثى", "انثى", "أنثي", "انثي", "female", "f"];

/** توحيد صيغة الجنس لتفادي الاختلافات في الكتابة أو الفراغات */
export function normalizeGender(value: unknown): string {
  const raw = String(value ?? "").trim().toLowerCase();
  if (FEMALE_VARIANTS.includes(raw)) return "أنثى";
  return "ذكر";
}

export function isFemale(value: unknown): boolean {
  return normalizeGender(value) === "أنثى";
}

/** هل القيمة تشير إلى تخصص مدخل البيانات؟ (مع تجاهل الفراغات) */
export function isDataEntry(value: unknown): boolean {
  return String(value ?? "").trim() === FEMALE_ONLY_SPECIALIZATION;
}

export type GuardInput = {
  gender: unknown;
  primarySpecialization?: unknown;
  secondarySpecialization?: unknown;
};

export type GuardResult = { ok: true } | { ok: false; error: string };

/**
 * التحقق المركزي: يُرجع خطأً إذا كان المتدرب ذكراً مقيّماً في مدخل البيانات.
 * يُستخدم في POST (تسجيل جديد) و PATCH (تعديل الطلب من لوحة المعهد).
 */
export function assertFemaleOnlyRespected(input: GuardInput): GuardResult {
  if (isFemale(input.gender)) return { ok: true };

  if (isDataEntry(input.primarySpecialization)) {
    return { ok: false, error: FEMALE_ONLY_ERROR };
  }
  if (isDataEntry(input.secondarySpecialization)) {
    return { ok: false, error: FEMALE_ONLY_SECONDARY_ERROR };
  }
  return { ok: true };
}

/** التخصصات المتاحة للعرض بحسب جنس المتدرب */
export function filterSpecializationsForGender<T extends { femaleOnly?: boolean }>(
  list: T[],
  gender: unknown
): T[] {
  return isFemale(gender) ? list : list.filter((s) => !s.femaleOnly);
}

import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  integer,
  timestamp,
  check,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const applications = pgTable(
  "applications",
  {
    id: serial("id").primaryKey(),
    applicationNumber: varchar("application_number", { length: 50 }).notNull().unique(),
    fullName: varchar("full_name", { length: 255 }).notNull(),
    nationality: varchar("nationality", { length: 50 }).notNull().default("أردني"),
    nationalId: varchar("national_id", { length: 50 }).notNull(),
    birthDate: varchar("birth_date", { length: 50 }).notNull(),
    age: integer("age").notNull(),
    gender: varchar("gender", { length: 20 }).notNull().default("ذكر"),
    birthPlace: varchar("birth_place", { length: 100 }).default("داخل المملكة"),
    isAidBeneficiary: boolean("is_aid_beneficiary").default(false),
    phoneNumber: varchar("phone_number", { length: 50 }).notNull(),
    whatsappNumber: varchar("whatsapp_number", { length: 50 }),
    emergencyPhone: varchar("emergency_phone", { length: 50 }),
    governorate: varchar("governorate", { length: 100 }).default("البلقاء"),
    district: varchar("district", { length: 100 }).default("الغور الأوسط"),
    detailedAddress: text("detailed_address"),
    iban: varchar("iban", { length: 50 }),
    guarantorName: varchar("guarantor_name", { length: 255 }),
    guarantorPhone: varchar("guarantor_phone", { length: 255 }),
    educationLevel: varchar("education_level", { length: 100 }).notNull(),
    schoolName: varchar("school_name", { length: 255 }),
    graduationYear: varchar("graduation_year", { length: 20 }),
    isPhysicallyFit: boolean("is_physically_fit").default(true),
    primarySpecialization: varchar("primary_specialization", { length: 100 }).notNull(),
    secondarySpecialization: varchar("secondary_specialization", { length: 100 }),
    motivation: text("motivation"),
    status: varchar("status", { length: 50 }).default("قيد المراجعة").notNull(),
    interviewDate: varchar("interview_date", { length: 100 }),
    supervisorNotes: text("supervisor_notes"),
    documentsSubmitted: text("documents_submitted").default("[]"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    /**
     * قاعدة صارمة على مستوى قاعدة البيانات:
     * لا يُقبل أي متدرب ذكر في تخصص «مدخل بيانات» — لا كرغبة أولى ولا كرغبة ثانية.
     * حتى لو تجاوزت المحاولة مسارات الـ API، سيرفض PostgreSQL الإدخال.
     */
    check(
      "no_male_data_entry",
      sql`NOT (trim(${table.gender}) = 'ذكر' AND (
            trim(coalesce(${table.primarySpecialization}, '')) = 'مدخل بيانات'
         OR trim(coalesce(${table.secondarySpecialization}, '')) = 'مدخل بيانات'
      ))`
    ),
  ]
);

export type Application = typeof applications.$inferSelect;
export type NewApplication = typeof applications.$inferInsert;

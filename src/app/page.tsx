"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import type { Application } from "@/db/schema";
import {
  assertFemaleOnlyRespected,
  filterSpecializationsForGender,
  FEMALE_ONLY_SPECIALIZATION,
} from "@/lib/specializationRules";
import {
  Sun,
  Wrench,
  Zap,
  Snowflake,
  Paintbrush,
  Database as DbIcon,
  Phone,
  MessageSquare,
  MapPin,
  Clock,
  Menu,
  X,
  FileText,
  Search,
  Shield,
  ShieldCheck,
  Award,
  Bus,
  CheckCircle2,
  AlertCircle,
  Printer,
  ArrowUp,
  ChevronDown,
  Download,
  Database,
  RefreshCw,
  Edit,
  Trash2,
  Sparkles,
  User,
  GraduationCap,
  Briefcase,
  Users,
  Keyboard,
} from "lucide-react";

/* ============================================================
   SINGLE-PAGE DATA
   ============================================================ */

type Spec = {
  id: string;
  name: string;
  sub: string;
  icon: React.ElementType;
  ring: string;
  chip: string;
  desc: string;
  skills: string[];
  jobs: string[];
  femaleOnly?: boolean;
};

const SPECIALIZATIONS: Spec[] = [
  {
    id: "solar",
    name: "الطاقة الشمسية",
    sub: "تركيب وصيانة أنظمة الطاقة الشمسية",
    icon: Sun,
    ring: "from-amber-500 to-yellow-600",
    chip: "bg-amber-50 text-amber-800 border-amber-200",
    desc: "تأهيل فنيين لتركيب وتشغيل وصيانة الأنظمة الكهروضوئية ومضخات الري الشمسية المنتشرة في مزارع وادي الأردن.",
    skills: [
      "تركيب مصفوفات الألواح الشمسية وتوجيهها",
      "توصيل وبرمجة محولات التيار (Inverters)",
      "صيانة مضخات الآبار وأنظمة الري الشمسية",
      "حساب الأحمال وفحص كفاءة الخلايا",
    ],
    jobs: [
      "شركات الطاقة المتجددة والمقاولات",
      "المزارع ومشاريع الري في الأغوار",
      "عمل حر في تركيب وصيانة الأنظمة",
    ],
  },
  {
    id: "mech",
    name: "ميكانيك مركبات",
    sub: "صيانة وإصلاح أنظمة المركبات",
    icon: Wrench,
    ring: "from-blue-600 to-indigo-700",
    chip: "bg-blue-50 text-blue-800 border-blue-200",
    desc: "تشخيص وإصلاح المحركات ونقل الحركة والتعليق والمكابح للمركبات الخفيفة والآليات الزراعية.",
    skills: [
      "صيانة محركات البنزين والديزل",
      "أنظمة نقل الحركة العادية والأوتوماتيك",
      "المكابح ونظام مانع الانغلاق ABS",
      "معايرة العجلات وأنظمة التعليق",
    ],
    jobs: [
      "وكالات ومراكز صيانة السيارات",
      "ورش الميكانيك في المحافظات",
      "شركات النقل والآليات الزراعية",
    ],
  },
  {
    id: "elec",
    name: "كهرباء مركبات",
    sub: "فحص وصيانة الأنظمة الكهربائية",
    icon: Zap,
    ring: "from-emerald-600 to-teal-700",
    chip: "bg-emerald-50 text-emerald-800 border-emerald-200",
    desc: "فحص الدوائر الكهربائية وتشخيص الأعطال بالكمبيوتر وصيانة أنظمة الإشعال والإنارة والسيارات الهايبرد.",
    skills: [
      "فحص وبرمجة كمبيوتر السيارات (OBD)",
      "قراءة المخططات والدوائر الكهربائية",
      "صيانة السلف والدينامو والبطاريات",
      "مبادئ فحص أنظمة الهايبرد",
    ],
    jobs: [
      "مراكز الفحص بالكمبيوتر",
      "ورش كهرباء وإلكترونيات السيارات",
      "محطات الفحص الدوري المعتمدة",
    ],
  },
  {
    id: "ac",
    name: "تكييف وتبريد",
    sub: "تركيب وصيانة أجهزة التكييف",
    icon: Snowflake,
    ring: "from-cyan-600 to-blue-700",
    chip: "bg-cyan-50 text-cyan-800 border-cyan-200",
    desc: "تركيب وصيانة المكيفات المنفصلة والمركزية وغرف تبريد المحاصيل الزراعية في منطقة الأغوار.",
    skills: [
      "تركيب وحدات التكييف المنفصلة والمركزية",
      "لحام وتشكيل مواسير النحاس",
      "كشف التسريب وشحن وسائط التبريد",
      "صيانة غرف تبريد المحاصيل الزراعية",
    ],
    jobs: [
      "مزارع ومحطات التعبئة والتخزين المبرد",
      "شركات التكييف والمنشآت الحكومية",
      "عمل حر في صيانة المكيفات",
    ],
  },
  {
    id: "paint",
    name: "دهان مركبات",
    sub: "دهان وإصلاح أنظمة المركبات",
    icon: Paintbrush,
    ring: "from-rose-600 to-red-700",
    chip: "bg-rose-50 text-rose-800 border-rose-200",
    desc: "معالجة هياكل السيارات وخلط الألوان محوسباً والرش بأفران التجفيف الحراري الحديثة.",
    skills: [
      "معالجة الصدمات وتحضير الأسطح",
      "طبقات الأساس والمعجون والصنفرة",
      "خلط ومطابقة درجات الألوان بالكمبيوتر",
      "الرش بالمسدسات الهوائية والتلميع",
    ],
    jobs: [
      "مراكز دهان وتصليح الهياكل",
      "مراكز العناية الفائقة بالسيارات",
      "تأسيس مشغل دهان خاص",
    ],
  },
  {
    id: "data-entry",
    name: "مدخل بيانات",
    sub: "دورة مخصصة للإناث فقط — إدخال بيانات احترافية",
    icon: DbIcon,
    ring: "from-pink-500 to-fuchsia-700",
    chip: "bg-pink-50 text-pink-800 border-pink-200",
    desc: "تدريب مكثف للإناث على إدخال البيانات، معالجة النصوص، إنشاء الجداول والتقارير، وأرشفة الملفات محوسباً، تماشياً مع احتياجات سوق العمل المكتبي والخدمي.",
    skills: [
      "سرعة ودقة عالية في الطباعة بالعربية والإنجليزية",
      "إتقان Microsoft Word و Excel و Outlook",
      "إنشاء قواعد البيانات وإدخال السجلات بدقة",
      "تنظيم وأرشفة الملفات الإلكترونية والورقية",
    ],
    jobs: [
      "البنوك وشركات التأمين والمؤسسات الحكومية",
      "المستشفيات ومراكز الخدمة والشركات الخاصة",
      "مكاتب الخدمات والأرشفة الإلكترونية",
      "العمل الحر عن بُعد (Freelance) في إدخال البيانات",
    ],
    femaleOnly: true,
  },
];

const DOCS_JORDANIAN = [
  "صورة مصدقة عن هوية الأحوال المدنية",
  "صورة مصدقة عن شهادة الصف العاشر أو آخر مؤهل علمي",
  "ثلاث صور شخصية حديثة (4×6)",
  "صورة مصدقة عن دفتر العائلة (الأب + الأم + الصفحة الأولى والثانية وصفحة التأجيل)",
  "صورة عن شهادة الميلاد الأصلية للمولودين خارج المملكة",
  "قبول المتدرب من حيث اللياقة المهنية والصحية وموافقة المشرف (المستوى العام)",
  "إحضار رقم الحساب البنكي (IBAN) لاستلام بدل المواصلات (إن وجد)",
];

const DOCS_NON_JORDANIAN = [
  "صورة عن جواز السفر ساري المفعول",
  "صورة عن الإقامة السارية المفعول",
  "صورة مصدقة عن شهادة الصف العاشر أو آخر مؤهل علمي",
  "ثلاث صور شخصية حديثة (4×6)",
  "صورة عن شهادة الميلاد الأصلية",
  "صورة عن شهادة الميلاد الأصلية مصدقة",
  "قبول المتدرب من حيث اللياقة وموافقة المشرف (المستوى العام)",
  "إحضار كفيل داخل المملكة الأردنية الهاشمية",
  "إحضار رقم الحساب البنكي (IBAN) لاستلام بدل المواصلات (إن وجد)",
];

const BENEFITS = [
  { icon: Bus, title: "بدل مواصلات شهري", text: "مخصص مالي شهري لكل متدرب لتغطية تنقله من وإلى المعهد طوال فترة التدريب." },
  { icon: ShieldCheck, title: "ملابس مهنية لكل متدرب", text: "تسليم زي العمل ومهمات السلامة الشخصية مجاناً لكل مقبول في المعهد." },
  { icon: Award, title: "شهادات مرتبطة بمستوى", text: "شهادات تدريب رسمية معترف بها لدى ديوان الخدمة المدنية ويمكن استبدالها بمزاولة المهنة." },
  { icon: Sparkles, title: "مزايا مستحقي المعونة", text: "من يثبت اسمه لدى صندوق المعونة الوطنية يُسدد عنه بدل الخدمات ويُصرف له بدل المواصلات." },
];

const CONDITIONS = [
  "إنهاء الصف العاشر أو أي مؤهل علمي أعلى",
  "ألا يقل عمر المتدرب عن 16 عاماً",
  "أن يكون لائقاً للمهنة التي سيتم تدريبه عليها",
];

const FAQS = [
  {
    q: "كيف أستلم بدل المواصلات الشهري؟",
    a: "يُحوَّل بدل المواصلات شهرياً إلى الحساب البنكي (IBAN) باسم المتدرب، لذلك يُفضل إحضار شهادة الآيبان عند مراجعة المعهد.",
  },
  {
    q: "ما امتيازات مستحقي صندوق المعونة الوطنية؟",
    a: "يُسدد عنهم بدل الخدمات وأجور التدريب بالكامل، ويُصرف لهم بدل المواصلات الشهري دون أي رسوم.",
  },
  {
    q: "هل الشهادة معترف بها للتوظيف؟",
    a: "نعم، الشهادة مرتبطة بمستوى ومعترف بها لدى ديوان الخدمة المدنية، ويمكن استبدالها بشهادة مزاولة مهنة من هيئة تنمية وتطوير المهارات (TVSDC).",
  },
  {
    q: "ما هو الحد الأدنى للقبول؟",
    a: "إنهاء الصف العاشر الأساسي وألا يقل عمر المتدرب عن 16 عاماً، مع اللياقة المهنية والصحية للمهنة.",
  },
];

const GOVERNORATES = ["البلقاء", "العاصمة عمان", "الزرقاء", "إربد", "مادبا", "جرش", "عجلون", "الكرك", "المفرق", "الطفيلة", "معان", "العقبة"];
const GHOR_DISTRICTS = [
  "الغور الأوسط - دير علا",
  "الغور الأوسط - الشونة الجنوبية",
  "الغور الأوسط - الكرامة",
  "الغور الأوسط - معدي",
  "الغور الأوسط - الروضة",
  "الغور الأوسط - فنوش",
  "الغور الأوسط - ظهرة الرمل",
  "منطقة أخرى",
];

const STATUSES = ["قيد المراجعة", "بانتظار المقابلة", "مقبول مبدئياً", "مقبول نهائياً", "مرفوض"];

/* ============================================================
   WELCOME DATA — تحيات حسب وقت اليوم + عبارات متحركة
   ============================================================ */

const WELCOME_STORAGE_KEY = "vtc-ghor-welcome-seen";

type Greeting = { text: string; emoji: string; line: string };

/** تحية ترحيبية تتغير تلقائياً بحسب ساعة زيارة الموقع */
function getGreeting(): Greeting {
  const h = new Date().getHours();
  if (h >= 5 && h < 12)
    return { text: "صباح الخير", emoji: "☀️", line: "يومك يبدأ بخطوة نحو مهنة تصنع مستقبلك" };
  if (h >= 12 && h < 16)
    return { text: "طاب نهارك", emoji: "🌤️", line: "أهلاً بك — فرصتك المهنية تبدأ من هذه الصفحة" };
  if (h >= 16 && h < 21)
    return { text: "مساء الخير", emoji: "🌆", line: "سعداء بزيارتك — مهنتك القادمة تبدأ اليوم" };
  return { text: "ليلة سعيدة", emoji: "🌙", line: "أهلاً بك في أي وقت — التسجيل مفتوح دائماً" };
}

/** العبارات التي تُكتب حرفاً بحرف في الواجهة الرئيسية */
const WELCOME_PHRASES = [
  "أهلاً وسهلاً بك في معهد تدريب مهني الغور الأوسط",
  "مستقبلك المهني يبدأ من هنا",
  "ستة برامج مهنية معتمدة بانتظارك",
  "تدرّب على أيدي خبراء واكتسب مهارة مطلوبة",
  "سجّل الآن ولا تفوّت الفرصة",
];

const NAV = [
  { id: "home", label: "الرئيسية" },
  { id: "specializations", label: "التخصصات" },
  { id: "benefits", label: "المزايا والشروط" },
  { id: "documents", label: "الوثائق" },
  { id: "register", label: "التسجيل" },
  { id: "track", label: "استعلام" },
  { id: "admin", label: "لوحة المعهد" },
  { id: "contact", label: "اتصل بنا" },
];

/* ============================================================
   LOGO (inline, single-file)
   ============================================================ */

function VtcMark({ size = "md", withText = false }: { size?: "sm" | "md" | "lg"; withText?: boolean }) {
  const box = size === "sm" ? "w-8 h-8" : size === "lg" ? "w-14 h-14" : "w-11 h-11";
  const svg = size === "sm" ? "w-5 h-5" : size === "lg" ? "w-9 h-9" : "w-7 h-7";
  return (
    <div className="flex items-center gap-2.5 shrink-0">
      {/* 50 years emblem - matches official flyer */}
      <div className="hidden sm:flex items-end leading-none">
        <span className={`font-black bg-gradient-to-br from-amber-500 via-amber-600 to-yellow-700 bg-clip-text text-transparent ${size === "sm" ? "text-xl" : size === "lg" ? "text-4xl" : "text-3xl"}`}>
          50
        </span>
        <span className={`mb-1 mr-0.5 font-extrabold text-amber-700 ${size === "sm" ? "text-[7px]" : "text-[8px]"} tracking-wider`}>
          YEARS
        </span>
      </div>

      {/* Red VTC Figure symbol - matches official flyer */}
      <div className={`${box} bg-red-700 text-white flex items-center justify-center rounded-sm shadow-sm relative`}>
        <svg viewBox="0 0 100 120" className={`${svg} fill-current`} aria-hidden="true">
          {/* Stylized human figure representing "Training/Vocation" */}
          <circle cx="50" cy="20" r="13" />
          <path d="M50 35 C36 35 25 44 22 58 C20 70 22 86 30 92 L40 92 L42 70 C42 64 47 60 50 60 C53 60 58 64 58 70 L60 92 L70 92 C78 86 80 70 78 58 C75 44 64 35 50 35 Z" />
          {/* White horizontal line accent */}
          <rect x="22" y="100" width="56" height="3" fill="white" opacity="0.9" />
        </svg>
      </div>

      {withText && (
        <div className="flex flex-col leading-tight">
          <span className={`font-black text-slate-900 ${size === "sm" ? "text-sm" : "text-base"} tracking-tight`}>
            مؤسَّسَة التَّدْرِيب المِهْنِيّ
          </span>
          <span className={`text-[10px] font-bold tracking-widest text-red-700`}>
            VOCATIONAL TRAINING CORPORATION
          </span>
        </div>
      )}
    </div>
  );
}

/* ============================================================
   PAGE — ONE SINGLE PAGE
   ============================================================ */

export default function InstituteOnePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSpec, setOpenSpec] = useState<string | null>(null);
  const [docTab, setDocTab] = useState<"jordanian" | "nonJordanian">("jordanian");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  /* ---------- Welcome / الترحيب التفاعلي ---------- */
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [welcomeClosing, setWelcomeClosing] = useState(false);
  const [greeting, setGreeting] = useState<Greeting | null>(null);

  //Typewriter: يكتب العبارة حرفاً بحرف ثم يكمل إلى العبارة التالية
  const [typed, setTyped] = useState("");
  const [phraseIndex, setPhraseIndex] = useState(0);

  // تُفتح شاشة الترحيب مرة واحدة في كل جلسة زيارة
  useEffect(() => {
    setGreeting(getGreeting());
    let seen = true;
    try {
      seen = sessionStorage.getItem(WELCOME_STORAGE_KEY) === "1";
    } catch {
      seen = false;
    }
    if (!seen) {
      setWelcomeOpen(true);
      document.body.classList.add("welcome-locked");
      try {
        sessionStorage.setItem(WELCOME_STORAGE_KEY, "1");
      } catch {
        /* ignore */
      }
    }
    return () => document.body.classList.remove("welcome-locked");
  }, []);

  const closeWelcome = (target?: string) => {
    setWelcomeClosing(true);
    document.body.classList.remove("welcome-locked");
    window.setTimeout(() => {
      setWelcomeOpen(false);
      setWelcomeClosing(false);
      if (target) go(target);
    }, 480);
  };

  // إغلاق شاشة الترحيب بمفتاح Escape
  useEffect(() => {
    if (!welcomeOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeWelcome();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [welcomeOpen]);

  // إغلاق تلقائي بعد انتهاء شريط التقدّم
  useEffect(() => {
    if (!welcomeOpen) return;
    const t = window.setTimeout(() => closeWelcome(), 3600);
    return () => window.clearTimeout(t);
  }, [welcomeOpen]);

  // تأثير الكتابة الحرفية للعبارات الترحيبية
  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(WELCOME_PHRASES[0]);
      return;
    }

    const full = WELCOME_PHRASES[phraseIndex];
    let i = 0;
    let holdTimer: number | undefined;

    const typeTimer = window.setInterval(() => {
      i += 1;
      setTyped(full.slice(0, i));
      if (i >= full.length) {
        window.clearInterval(typeTimer);
        holdTimer = window.setTimeout(
          () => setPhraseIndex((p) => (p + 1) % WELCOME_PHRASES.length),
          2400
        );
      }
    }, 55);

    return () => {
      window.clearInterval(typeTimer);
      if (holdTimer) window.clearTimeout(holdTimer);
    };
  }, [phraseIndex]);

  // تحديث التحية إذا بقي الزائر عبر تغيّر الوقت (مثل من الصباح إلى المساء)
  useEffect(() => {
    const t = window.setInterval(() => setGreeting(getGreeting()), 60_000);
    return () => window.clearInterval(t);
  }, []);

  /* ---------- Registration form state ---------- */
  const emptyForm = {
    fullName: "",
    nationality: "أردني",
    nationalId: "",
    birthDate: "2007-01-01",
    gender: "ذكر",
    birthPlace: "داخل المملكة",
    isAidBeneficiary: false,
    phoneNumber: "",
    whatsappNumber: "",
    emergencyPhone: "",
    governorate: "البلقاء",
    district: GHOR_DISTRICTS[0],
    detailedAddress: "",
    iban: "",
    guarantorName: "",
    guarantorPhone: "",
    educationLevel: "إنهاء الصف العاشر الأساسي",
    schoolName: "",
    graduationYear: "2024",
    isPhysicallyFit: true,
    primarySpecialization: SPECIALIZATIONS[0].name,
    secondarySpecialization: SPECIALIZATIONS[1].name,
    motivation: "",
    agreementChecked: false,
  };

  const [form, setForm] = useState(emptyForm);
  const [docsPrepared, setDocsPrepared] = useState<string[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<Application | null>(null);

  const age = useMemo(() => {
    if (!form.birthDate) return 0;
    const b = new Date(form.birthDate);
    const t = new Date();
    let a = t.getFullYear() - b.getFullYear();
    const m = t.getMonth() - b.getMonth();
    if (m < 0 || (m === 0 && t.getDate() < b.getDate())) a--;
    return a > 0 ? a : 0;
  }, [form.birthDate]);

  const docsList = docTab === "jordanian" ? DOCS_JORDANIAN : DOCS_NON_JORDANIAN;

  const go = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const field = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? target.checked : value }));
  };

  const toggleDoc = (d: string) =>
    setDocsPrepared((prev) => (prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]));

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!form.fullName.trim()) return setFormError("يرجى إدخال الاسم الرباعي للمتدرب.");
    if (!form.nationalId.trim())
      return setFormError("يرجى إدخال الرقم الوطني أو رقم جواز السفر / الإقامة.");
    if (age < 16) return setFormError("لا يمكن القبول قبل إتمام 16 عاماً بحسب شروط القبول.");
    // دورة «مدخل بيانات» للإناث فقط — منع تام لأي متدرب ذكر (كرغبة أولى أو ثانية)
    const guard = assertFemaleOnlyRespected({
      gender: form.gender,
      primarySpecialization: form.primarySpecialization,
      secondarySpecialization: form.secondarySpecialization,
    });
    if (!guard.ok) return setFormError(guard.error);
    if (!form.phoneNumber.trim()) return setFormError("يرجى إدخال رقم الهاتف للتواصل.");
    if (form.nationality === "غير أردني" && !form.guarantorName.trim())
      return setFormError("يرجى إدخال اسم الكفيل داخل المملكة الأردنية الهاشمية.");
    if (!form.isPhysicallyFit)
      return setFormError("يجب التأكيد على اللياقة المهنية والصحية للتدريب العملي.");
    if (!form.agreementChecked) return setFormError("يرجى الموافقة على التعهد بصحة البيانات.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          age,
          whatsappNumber: form.whatsappNumber || form.phoneNumber,
          documentsSubmitted: JSON.stringify(docsPrepared),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setFormError(data.error || "تعذر إرسال الطلب، يرجى المحاولة مرة أخرى.");
      } else {
        setCreated(data.application);
        setTimeout(() => document.getElementById("register")?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch {
      setFormError("فشل الاتصال بالخادم. تحقق من الإنترنت وأعد المحاولة.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ---------- Tracker state ---------- */
  const [trackQuery, setTrackQuery] = useState("");
  const [tracking, setTracking] = useState(false);
  const [tracked, setTracked] = useState<Application | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  const runTrack = async (q?: string) => {
    const value = (q ?? trackQuery).trim();
    if (!value) return setTrackError("يرجى إدخال رقم الطلب أو الرقم الوطني.");
    setTracking(true);
    setTrackError(null);
    setTracked(null);
    try {
      const res = await fetch(`/api/applications/${encodeURIComponent(value)}`);
      const data = await res.json();
      if (!res.ok || !data.success) setTrackError(data.error || "لا يوجد طلب مطابق للرقم المدخل.");
      else setTracked(data.application);
    } catch {
      setTrackError("تعذر الاتصال بالنظام، أعد المحاولة.");
    } finally {
      setTracking(false);
    }
  };

  const stageOf = (status: string) =>
    status === "مقبول نهائياً" ? 4
      : status === "مقبول مبدئياً" ? 3
      : status === "بانتظار المقابلة" ? 2
      : status === "مرفوض" ? 0 : 1;

  const STAGES = ["استلام الطلب", "المقابلة واللياقة", "القبول المبدئي", "القبول النهائي"];

  /* ---------- Admin state ---------- */
  const [apps, setApps] = useState<Application[]>([]);
  const [loadingApps, setLoadingApps] = useState(true);
  const [adminSearch, setAdminSearch] = useState("");
  const [adminStatus, setAdminStatus] = useState("ALL");
  const [editing, setEditing] = useState<Application | null>(null);
  const [editStatus, setEditStatus] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const loadApps = async () => {
    setLoadingApps(true);
    try {
      const params = new URLSearchParams();
      if (adminSearch.trim()) params.set("search", adminSearch.trim());
      if (adminStatus !== "ALL") params.set("status", adminStatus);
      const res = await fetch(`/api/applications?${params.toString()}`);
      const data = await res.json();
      if (data.success) setApps(data.applications);
    } catch {
      /* ignore */
    } finally {
      setLoadingApps(false);
    }
  };

  useEffect(() => {
    fetch("/api/seed", { method: "POST" }).catch(() => {});
  }, []);

  useEffect(() => {
    loadApps();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adminStatus]);

  const saveEdit = async () => {
    if (!editing) return;
    // منع تام: لا يُقبل أي متدرب ذكر في دورة «مدخل بيانات»
    const guard = assertFemaleOnlyRespected({
      gender: editing.gender,
      primarySpecialization: editing.primarySpecialization,
      secondarySpecialization: editing.secondarySpecialization,
    });
    if (!guard.ok) {
      alert(guard.error);
      return;
    }
    await fetch(`/api/applications/${editing.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: editStatus, interviewDate: editDate, supervisorNotes: editNotes }),
    });
    setEditing(null);
    loadApps();
  };

  const removeApp = async (id: number) => {
    if (!confirm("تأكيد حذف هذا الطلب من سجلات المعهد؟")) return;
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    loadApps();
  };

  const exportCsv = () => {
    const head = ["رقم الطلب", "الاسم", "الجنسية", "الرقم الوطني", "العمر", "التخصص", "الهاتف", "المنطقة", "المعونة", "الحالة"];
    const rows = apps.map((a) => [
      a.applicationNumber,
      `"${a.fullName}"`,
      a.nationality,
      a.nationalId,
      a.age,
      `"${a.primarySpecialization}"`,
      a.phoneNumber,
      `"${a.district}"`,
      a.isAidBeneficiary ? "نعم" : "لا",
      a.status,
    ]);
    const csv = "data:text/csv;charset=utf-8,\uFEFF" + [head.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const link = document.createElement("a");
    link.href = encodeURI(csv);
    link.download = "طلبات_معهد_الغور_الأوسط.csv";
    link.click();
  };

  const counts = {
    total: apps.length,
    review: apps.filter((a) => a.status === "قيد المراجعة").length,
    interview: apps.filter((a) => a.status === "بانتظار المقابلة").length,
    accepted: apps.filter((a) => a.status.includes("مقبول")).length,
  };

  const createdDocs = (() => {
    try {
      return typeof created?.documentsSubmitted === "string"
        ? (JSON.parse(created.documentsSubmitted) as string[])
        : [];
    } catch {
      return [] as string[];
    }
  })();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ================= WELCOME OVERLAY ================= */}
      {welcomeOpen && greeting && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="شاشة الترحيب"
          onClick={() => closeWelcome()}
          className={`no-print fixed inset-0 z-[100] flex items-center justify-center px-4 overflow-hidden bg-slate-950 ${
            welcomeClosing ? "welcome-exit" : "welcome-enter"
          }`}
        >
          {/* خلفية متحركة */}
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.12]" />
          <div className="drift absolute -top-24 -start-24 w-80 h-80 rounded-full bg-red-700/25 blur-3xl" />
          <div className="drift-slow absolute -bottom-24 -end-24 w-96 h-96 rounded-full bg-amber-500/20 blur-3xl" />

          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-white/[0.06] backdrop-blur-xl p-7 sm:p-10 text-center shadow-2xl"
          >
            {/* الشعار مع حلقات نابضة */}
            <div className="relative mx-auto w-fit mb-5">
              <span className="welcome-ring absolute inset-0 rounded-2xl border-2 border-amber-400/60" />
              <span className="welcome-ring welcome-ring-delay absolute inset-0 rounded-2xl border-2 border-red-500/50" />
              <div className="relative w-20 h-20 rounded-2xl bg-white flex items-center justify-center shadow-xl mx-auto">
                <VtcMark size="lg" />
              </div>
            </div>

            {/* التحية حسب وقت اليوم */}
            <div className="pop-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black mb-3">
              <span className="text-base leading-none">{greeting.emoji}</span>
              <span>{greeting.text}</span>
            </div>

            {/* الاسم الرسمي */}
            <div className="welcome-word text-[11px] font-bold text-slate-400 tracking-[0.2em] mb-1" style={{ animationDelay: "120ms" }}>
              المملكة الأردنية الهاشمية
            </div>

            <h2 className="welcome-word welcome-shimmer text-2xl sm:text-4xl font-black leading-snug" style={{ animationDelay: "240ms" }}>
              مؤسَّسَة التَّدْرِيب المِهْنِيّ
            </h2>

            <div
              className="welcome-word mt-2 text-lg sm:text-2xl font-black text-white"
              style={{ animationDelay: "340ms" }}
            >
              معهد تدريب مهني الغور الأوسط
            </div>

            <p
              className="welcome-word mt-4 text-sm sm:text-base text-slate-300 leading-relaxed"
              style={{ animationDelay: "460ms" }}
            >
              {greeting.line}
            </p>

            {/* شريط التقدّم */}
            <div className="mt-6 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
              <div className="welcome-bar h-full rounded-full bg-gradient-to-l from-amber-400 via-yellow-300 to-red-500" />
            </div>

            {/* الأزرار */}
            <div className="welcome-word mt-6 flex flex-wrap items-center justify-center gap-2.5" style={{ animationDelay: "580ms" }}>
              <button
                onClick={() => closeWelcome("register")}
                className="px-6 py-3 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-black flex items-center gap-2 shadow-lg shadow-red-900/40 active:scale-95 cursor-pointer"
              >
                <FileText className="w-4 h-4" /> ابدأ التسجيل الآن
              </button>
              <button
                onClick={() => closeWelcome("specializations")}
                className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-bold cursor-pointer"
              >
                تصفّح التخصصات
              </button>
              <button
                onClick={() => closeWelcome()}
                className="px-4 py-3 rounded-xl text-slate-400 hover:text-white text-xs font-bold cursor-pointer"
              >
                الدخول للموقع
              </button>
            </div>

            <p className="mt-4 text-[10px] text-slate-500">اضغط في أي مكان أو مفتاح Escape للمتابعة</p>
          </div>
        </div>
      )}

      {/* ================= HEADER ================= */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 no-print">
        <div className="bg-slate-900 text-slate-300 text-[11px]">
          <div className="max-w-7xl mx-auto px-4 py-1.5 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
              <span className="font-bold text-white">المملكة الأردنية الهاشمية</span>
              <span className="text-slate-600">|</span>
              <span>مؤسسة التدريب المهني / إقليم الوسط</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-bold">معهد تدريب مهني الغور الأوسط</span>
            </div>
            <div className="flex items-center gap-3 font-mono">
              <a href="tel:053584316" className="hover:text-white flex items-center gap-1">
                <Phone className="w-3 h-3 text-red-500" />
                <span dir="ltr">05 / 35 843 16</span>
              </a>
              <a href="https://wa.me/962799769904" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
                <MessageSquare className="w-3 h-3" />
                <span dir="ltr">0799769904</span>
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-4">
          <button onClick={() => go("home")} className="flex items-center gap-2.5 text-right cursor-pointer">
            <VtcMark size="md" withText />
            <div className="leading-tight border-r border-slate-200 pr-3 mr-1 hidden md:block">
              <div className="text-[10px] font-bold text-slate-500">المملكة الأردنية الهاشمية</div>
              <div className="text-[10px] font-black text-red-700">معهد تدريب مهني الغور الأوسط</div>
            </div>
          </button>

          <nav className="hidden lg:flex items-center gap-1 text-xs font-bold">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                  n.id === "register"
                    ? "bg-red-700 text-white hover:bg-red-800"
                    : "text-slate-600 hover:text-red-700 hover:bg-slate-100"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button onClick={() => go("register")} className="lg:hidden px-3 py-1.5 rounded-lg bg-red-700 text-white text-xs font-bold cursor-pointer">
              سجّل الآن
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 cursor-pointer" aria-label="القائمة">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-2 grid grid-cols-2 gap-1.5">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => go(n.id)}
                className={`text-right px-3 py-2 rounded-lg text-xs font-bold cursor-pointer ${
                  n.id === "register" ? "bg-red-700 text-white col-span-2" : "hover:bg-slate-100 text-slate-700"
                }`}
              >
                {n.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ================= HERO ================= */}
      <section id="home" className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:26px_26px] opacity-10" />

        {/* Banner image featuring the official Institute gate (matches the flyer) */}
        <div className="relative">
          <div className="relative h-[420px] sm:h-[480px] lg:h-[560px]">
            <Image
              src="/images/institute-gate.jpg"
              alt="بوابة معهد تدريب مهني الغور الأوسط"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-slate-950/30" />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent via-slate-950/40 to-slate-950/80" />

            {/* Top-left ribbon: institution name in Arabic + English */}
            <div className="absolute top-4 right-4 left-4 flex items-center justify-between gap-2 flex-wrap">
              <div className="flex items-center gap-2 bg-white/95 text-slate-900 rounded-lg px-3 py-1.5 shadow-lg">
                <VtcMark size="sm" />
                <div className="leading-tight">
                  <div className="text-[11px] font-black">مؤسَّسَة التَّدْرِيب المِهْنِيّ</div>
                  <div className="text-[9px] font-bold text-red-700 tracking-wider">VOCATIONAL TRAINING CORPORATION</div>
                </div>
              </div>
              <div className="bg-amber-400 text-slate-900 px-3 py-1 rounded-md text-[11px] font-black shadow-lg">
                اليوبيل الذهبي 50
              </div>
            </div>

            {/* Bottom-right main slogan (matches official flyer exactly) */}
            <div className="absolute inset-0 flex items-center justify-start">
              <div className="max-w-2xl px-6 sm:px-10 lg:px-14 py-6">
                {/* التحية التفاعلية حسب وقت اليوم */}
                {greeting && (
                  <div className="pop-badge inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/95 text-slate-900 text-[11px] sm:text-xs font-black shadow-lg mb-3">
                    <span className="text-base leading-none">{greeting.emoji}</span>
                    <span>{greeting.text}،</span>
                    <span className="text-red-700">أهلاً بك في معهدنا</span>
                  </div>
                )}

                <div className="inline-block px-3 py-1 rounded-full bg-red-700/90 text-white text-[11px] font-bold mb-3 ms-2">
                  المملكة الأردنية الهاشمية · مديرية تدريب مهني / إقليم الوسط
                </div>
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] text-white">
                  سجّل الآن!
                </h1>
                <h2 className="mt-2 text-2xl sm:text-3xl lg:text-4xl font-extrabold bg-gradient-to-l from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                  وابدأ مستقبلك المهني بثقة
                </h2>
                <p className="mt-4 text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl">
                  تدرّب على أيدي مدربين مؤهلين واكتسب مهارات مطلوبة في سوق العمل ضمن بيئة تدريبية حديثة ومجهزة في معهد تدريب مهني الغور الأوسط.
                </p>

                {/* عبارة ترحيبية تُكتب حرفاً بحرف */}
                <div className="mt-4 min-h-[2rem] flex items-center gap-1 text-amber-300 text-sm sm:text-lg font-black">
                  <span className="text-amber-400">✦</span>
                  <span>{typed}</span>
                  <span className="caret inline-block w-[2px] h-[1.1em] bg-amber-300 align-middle" />
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2.5">
                  <button onClick={() => go("register")} className="px-6 py-3 rounded-xl bg-red-700 hover:bg-red-600 font-bold text-sm flex items-center gap-2 shadow-lg shadow-red-900/40 active:scale-95 cursor-pointer">
                    <FileText className="w-4 h-4" /> تقديم طلب التسجيل
                  </button>
                  <button onClick={() => go("specializations")} className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/30 font-bold text-sm flex items-center gap-2 cursor-pointer">
                    التخصصات المتاحة (6)
                  </button>
                  <button onClick={() => go("track")} className="px-4 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm flex items-center gap-2 cursor-pointer">
                    <Search className="w-4 h-4" /> استعلام عن طلب
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits grid below the hero image */}
        <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10 pb-10">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="flex items-center gap-2.5 p-3.5 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-lg">
                  <div className="w-10 h-10 rounded-lg bg-red-50 text-red-700 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black">{b.title}</div>
                    <div className="text-[11px] text-slate-500 leading-snug">{b.text}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= SPECIALIZATIONS ================= */}      {/* ================= SPECIALIZATIONS ================= */}
      <section id="specializations" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              التخصصات المتاحة
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3">ستة برامج مهنية معتمدة في المعهد</h2>
            <p className="text-slate-600 text-sm mt-2">تشمل خمسة تخصصات تقنية ودورة <span className="font-bold text-pink-700">«مدخل بيانات»</span> المخصصة للإناث فقط — اضغط على «التفاصيل» لعرض المهارات وفرص العمل.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPECIALIZATIONS.map((s) => {
              const Icon = s.icon;
              const open = openSpec === s.id;
              const isFemaleOnly = !!s.femaleOnly;
              return (
                <div
                  key={s.id}
                  className={`rounded-2xl border bg-white p-5 hover:shadow-lg transition-shadow flex flex-col ${
                    isFemaleOnly
                      ? "border-pink-300 ring-2 ring-pink-100"
                      : "border-slate-200"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.ring} text-white flex items-center justify-center shadow-sm`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-full border ${s.chip}`}>مطلوب في السوق</span>
                      {isFemaleOnly && (
                        <span className="text-[10px] font-black px-2 py-1 rounded-full bg-pink-600 text-white flex items-center gap-1">
                          <Users className="w-3 h-3" /> للإناث فقط
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="text-lg font-black">{s.name}</h3>
                  <p className="text-xs font-bold text-red-600">{s.sub}</p>
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{s.desc}</p>

                  {open && (
                    <div className="mt-3 space-y-2 text-[11px]">
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="font-bold text-slate-800 mb-1">المهارات المكتسبة:</div>
                        <ul className="space-y-1 text-slate-600">
                          {s.skills.map((k) => (
                            <li key={k} className="flex gap-1.5"><span className="text-emerald-600">✓</span><span>{k}</span></li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                        <div className="font-bold text-slate-800 mb-1 flex items-center gap-1"><Briefcase className="w-3.5 h-3.5 text-blue-600" /> فرص العمل:</div>
                        <ul className="space-y-1 text-slate-600">
                          {s.jobs.map((j) => (
                            <li key={j} className="flex gap-1.5"><span className="text-blue-600">•</span><span>{j}</span></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      onClick={() => { setForm((p) => ({ ...p, primarySpecialization: s.name })); go("register"); }}
                      className="flex-1 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer"
                    >
                      سجّل في هذا التخصص
                    </button>
                    <button
                      onClick={() => setOpenSpec(open ? null : s.id)}
                      className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center gap-1 cursor-pointer"
                    >
                      {open ? "إخفاء" : "التفاصيل"}
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= BENEFITS + CONDITIONS + DOCUMENTS ================= */}
      <section id="benefits" className="py-14 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-12 gap-8">
          {/* Benefits & Conditions */}
          <div className="lg:col-span-7 space-y-5">
            <h2 className="text-2xl sm:text-3xl font-black">مزايا التدريب وشروط القبول</h2>

            <div className="grid sm:grid-cols-2 gap-3">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <div key={b.title} className="p-4 rounded-2xl bg-white border border-slate-200">
                    <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center mb-2">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="text-sm font-bold">{b.title}</div>
                    <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">{b.text}</p>
                  </div>
                );
              })}
            </div>

            <div className="rounded-2xl bg-gradient-to-l from-red-700 to-red-800 text-white p-5">
              <h3 className="font-black mb-3">شروط القبول</h3>
              <ul className="space-y-2 text-xs">
                {CONDITIONS.map((c, i) => (
                  <li key={c} className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
                    <span className="w-6 h-6 rounded-full bg-amber-400 text-slate-900 font-black flex items-center justify-center text-[11px]">{i + 1}</span>
                    <span>{c}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Documents */}
          <div id="documents" className="lg:col-span-5">
            <div className="rounded-2xl bg-white border border-slate-200 p-5 h-full">
              <h3 className="text-lg font-black mb-1">الوثائق المطلوبة</h3>
              <p className="text-[11px] text-slate-500 mb-3">يجب أن تكون جميع الوثائق سارية ومصدقة حسب الأصول.</p>

              <div className="grid grid-cols-2 gap-2 mb-4 p-1 rounded-xl bg-slate-100">
                <button
                  onClick={() => setDocTab("jordanian")}
                  className={`py-2 rounded-lg text-[11px] font-bold cursor-pointer ${docTab === "jordanian" ? "bg-white shadow-sm text-red-700" : "text-slate-600"}`}
                >
                  للأردنيين ({DOCS_JORDANIAN.length})
                </button>
                <button
                  onClick={() => setDocTab("nonJordanian")}
                  className={`py-2 rounded-lg text-[11px] font-bold cursor-pointer ${docTab === "nonJordanian" ? "bg-white shadow-sm text-red-700" : "text-slate-600"}`}
                >
                  لغير الأردنيين ({DOCS_NON_JORDANIAN.length})
                </button>
              </div>

              <ol className="space-y-2">
                {docsList.map((d, i) => (
                  <li key={d} className="flex items-start gap-2 text-[11px] text-slate-700 p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="w-5 h-5 rounded-full bg-red-100 text-red-700 font-bold text-[10px] flex items-center justify-center shrink-0">{i + 1}</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ================= REGISTRATION (single-step) ================= */}
      <section id="register" className="py-14 bg-slate-100/70 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-8">
            <span className="text-[11px] font-bold text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full">
              استمارة التسجيل الإلكتروني
            </span>
            <h2 className="text-2xl sm:text-3xl font-black mt-3">طلب الالتحاق بمعهد الغور الأوسط</h2>
            <p className="text-slate-600 text-xs mt-2">املأ الحقول بدقة ثم اضغط تأكيد التسجيل لإصدار بطاقة المراجعة.</p>
          </div>

          {created ? (
            /* ---------- Success + printable slip ---------- */
            <div className="space-y-5">
              <div className="no-print rounded-2xl bg-white border border-emerald-200 p-6 text-center space-y-3">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-black">تم تسجيل طلبك بنجاح</h3>
                <div className="inline-block px-5 py-2 rounded-xl bg-slate-900 text-amber-400 font-mono font-black text-lg" dir="ltr">
                  {created.applicationNumber}
                </div>
                <p className="text-xs text-slate-600">
                  احفظ رقم الطلب لمتابعة حالتك. يرجى طباعة بطاقة المراجعة وإحضارها مع أصل الوثائق إلى المعهد.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  <button onClick={() => window.print()} className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold flex items-center gap-2 cursor-pointer">
                    <Printer className="w-4 h-4" /> طباعة بطاقة المراجعة
                  </button>
                  <button onClick={() => { setCreated(null); setDocsPrepared([]); setForm(emptyForm); }} className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold cursor-pointer">
                    تسجيل متدرب آخر
                  </button>
                </div>
              </div>

              {/* printable card */}
              <div className="print-area rounded-2xl border-2 border-slate-800 bg-white p-6 text-slate-900">
                <div className="flex items-start justify-between border-b-2 border-slate-800 pb-3 mb-4">
                  <div>
                    <div className="text-sm font-black">المملكة الأردنية الهاشمية</div>
                    <div className="text-xs font-bold">مؤسسة التدريب المهني — مديرية تدريب مهني إقليم الوسط</div>
                    <div className="text-xs font-bold text-red-700">معهد تدريب مهني الغور الأوسط</div>
                  </div>
                  <div className="text-left">
                    <VtcMark size="sm" />
                    <div className="mt-1 font-mono text-[11px] font-bold bg-slate-100 border border-slate-300 rounded px-2 py-0.5" dir="ltr">
                      {created.applicationNumber}
                    </div>
                  </div>
                </div>

                <div className="text-center bg-slate-100 border border-slate-300 rounded-lg py-1.5 mb-4 text-sm font-black">
                  بطاقة مراجعة طلب تسجيل متدرب — العام التدريبي 2025/2026
                </div>

                <div className="grid sm:grid-cols-3 gap-2 text-[11px]">
                  {[
                    ["اسم المتدرب", created.fullName],
                    ["الرقم الوطني / الجواز", created.nationalId],
                    ["الجنسية", created.nationality],
                    ["العمر / الميلاد", `${created.age} عاماً — ${created.birthDate}`],
                    ["الهاتف", created.phoneNumber],
                    ["السكن", `${created.governorate} — ${created.district}`],
                    ["التخصص المطلوب", created.primarySpecialization],
                    ["حالة الطلب", created.status],
                    ["المعونة الوطنية", created.isAidBeneficiary ? "مستفيد" : "غير مستفيد"],
                  ].map(([k, v]) => (
                    <div key={k as string} className="p-2 rounded-lg bg-slate-50 border border-slate-200">
                      <div className="text-slate-500 text-[10px]">{k}</div>
                      <div className="font-bold">{v}</div>
                    </div>
                  ))}
                </div>

                {createdDocs.length > 0 && (
                  <div className="mt-3 text-[11px]">
                    <span className="font-bold">الوثائق المؤكدة إحضارها: </span>
                    <span className="text-slate-600">{createdDocs.join(" • ")}</span>
                  </div>
                )}

                <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <b>تعليمات المراجعة:</b> يرجى الحضور شخصياً إلى مقر المعهد مصطحباً هذه البطاقة مع أصل الوثائق لإجراء مقابلة المشرف وفحص اللياقة واعتماد القبول النهائي. هاتف المعهد <span className="font-mono">05/3584316</span> — واتساب <span className="font-mono">0799769904</span>.
                </div>

                <div className="mt-4 pt-3 border-t-2 border-slate-800 flex items-end justify-between text-[10px] text-slate-600">
                  <div>تاريخ التقديم: {new Date(created.createdAt).toLocaleDateString("ar-JO")}</div>
                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <div className="mb-6">توقيع مدقق القبول</div>
                      <div className="border-t border-dashed border-slate-400 w-28">الاسم والتاريخ</div>
                    </div>
                    <div>
                      <div className="mb-6">خاتم المعهد</div>
                      <div className="w-20 h-12 border border-slate-300 rounded flex items-center justify-center text-slate-400">ختم المؤسسة</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ---------- Single-step form ---------- */
            <form onSubmit={submitForm} className="rounded-3xl bg-white border border-slate-200 shadow-sm p-5 sm:p-7 space-y-7">
              {formError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" /> {formError}
                </div>
              )}

              {/* Personal */}
              <div>
                <h3 className="text-sm font-black flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                  <User className="w-4 h-4 text-red-700" /> البيانات الشخصية
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="الاسم الرباعي *" className="sm:col-span-2">
                    <input name="fullName" value={form.fullName} onChange={field} placeholder="مثال: أحمد محمد محمود الفاعوري" className={inputCls} required />
                  </Field>

                  <Field label="الجنسية *">
                    <select name="nationality" value={form.nationality} onChange={field} className={inputCls}>
                      <option value="أردني">أردني</option>
                      <option value="غير أردني">غير أردني</option>
                    </select>
                  </Field>

                  <Field label={form.nationality === "أردني" ? "الرقم الوطني *" : "رقم الجواز / الإقامة *"}>
                    <input name="nationalId" value={form.nationalId} onChange={field} placeholder={form.nationality === "أردني" ? "2006123456" : "رقم الوثيقة"} className={`${inputCls} font-mono`} required />
                  </Field>

                  <Field label="تاريخ الميلاد *">
                    <input type="date" name="birthDate" value={form.birthDate} onChange={field} className={`${inputCls} font-mono`} required />
                  </Field>

                  <Field label="العمر">
                    <div className={`${inputCls} flex items-center justify-between`}>
                      <span className="font-bold">{age} عاماً</span>
                      {age >= 16 ? (
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">مستوفٍ للشرط ✓</span>
                      ) : (
                        <span className="text-[10px] bg-red-100 text-red-800 px-2 py-0.5 rounded font-bold">أقل من 16 ✕</span>
                      )}
                    </div>
                  </Field>

                  <Field label="الجنس">
                    <select
                      name="gender"
                      value={form.gender}
                      onChange={(e) => {
                        const g = e.target.value;
                        setForm((p) => {
                          const next = { ...p, gender: g };
                          // منع تام: إن تحوّل المتدرب إلى ذكر وهو مقيّم في مدخل البيانات، يُعاد التخصص تلقائياً
                          if (g === "ذكر" && p.primarySpecialization === FEMALE_ONLY_SPECIALIZATION) {
                            next.primarySpecialization = SPECIALIZATIONS.find((s) => !s.femaleOnly)!.name;
                          }
                          if (g === "ذكر" && p.secondarySpecialization === FEMALE_ONLY_SPECIALIZATION) {
                            const alt = SPECIALIZATIONS.find((s) => !s.femaleOnly && s.name !== next.primarySpecialization);
                            next.secondarySpecialization = alt ? alt.name : next.primarySpecialization;
                          }
                          return next;
                        });
                      }}
                      className={inputCls}>
                      <option value="ذكر">ذكر</option>
                      <option value="أنثى">أنثى</option>
                    </select>
                  </Field>

                  <Field label="مكان الولادة">
                    <select name="birthPlace" value={form.birthPlace} onChange={field} className={inputCls}>
                      <option value="داخل المملكة">داخل المملكة</option>
                      <option value="خارج المملكة">خارج المملكة</option>
                    </select>
                  </Field>

                  <label className="sm:col-span-2 flex items-start gap-2.5 p-3 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
                    <input type="checkbox" name="isAidBeneficiary" checked={form.isAidBeneficiary} onChange={field} className="mt-0.5 w-4 h-4 cursor-pointer" />
                    <span className="text-[11px] font-bold text-amber-950">
                      مستفيد من صندوق المعونة الوطنية
                      <span className="block font-normal text-amber-800">يُسدد عنه بدل الخدمات وأجور التدريب ويُصرف له بدل المواصلات الشهري.</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-black flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                  <Phone className="w-4 h-4 text-red-700" /> الاتصال والإقامة
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="رقم الهاتف *">
                    <input name="phoneNumber" value={form.phoneNumber} onChange={field} placeholder="0791234567" dir="ltr" className={`${inputCls} font-mono`} required />
                  </Field>
                  <Field label="رقم الواتساب">
                    <input name="whatsappNumber" value={form.whatsappNumber} onChange={field} placeholder="0791234567" dir="ltr" className={`${inputCls} font-mono`} />
                  </Field>
                  <Field label="هاتف ولي الأمر / الطوارئ">
                    <input name="emergencyPhone" value={form.emergencyPhone} onChange={field} placeholder="0781234567" dir="ltr" className={`${inputCls} font-mono`} />
                  </Field>
                  <Field label="المحافظة">
                    <select name="governorate" value={form.governorate} onChange={field} className={inputCls}>
                      {GOVERNORATES.map((g) => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </Field>
                  <Field label="اللواء / المنطقة">
                    <select name="district" value={form.district} onChange={field} className={inputCls}>
                      {GHOR_DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </Field>
                  <Field label="العنوان التفصيلي">
                    <input name="detailedAddress" value={form.detailedAddress} onChange={field} placeholder="البلدة، الحي، قرب معلم معروف" className={inputCls} />
                  </Field>
                  <Field label="رقم الحساب البنكي (IBAN)" className="sm:col-span-2">
                    <input name="iban" value={form.iban} onChange={field} placeholder="JO94ARBK00000001234567890123" dir="ltr" className={`${inputCls} font-mono uppercase`} />
                    <span className="text-[10px] text-slate-500">لاستلام بدل المواصلات الشهري — يفضل إحضاره إن وجد.</span>
                  </Field>

                  {form.nationality === "غير أردني" && (
                    <>
                      <Field label="اسم الكفيل داخل المملكة *">
                        <input name="guarantorName" value={form.guarantorName} onChange={field} className={inputCls} required />
                      </Field>
                      <Field label="هاتف الكفيل *">
                        <input name="guarantorPhone" value={form.guarantorPhone} onChange={field} dir="ltr" className={`${inputCls} font-mono`} required />
                      </Field>
                    </>
                  )}
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="text-sm font-black flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                  <GraduationCap className="w-4 h-4 text-red-700" /> المؤهل واللياقة
                </h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  <Field label="آخر مؤهل علمي *" className="sm:col-span-1">
                    <select name="educationLevel" value={form.educationLevel} onChange={field} className={inputCls}>
                      <option value="إنهاء الصف العاشر الأساسي">إنهاء الصف العاشر</option>
                      <option value="أول ثانوي (أكاديمي)">أول ثانوي (أكاديمي)</option>
                      <option value="أول ثانوي (مهني)">أول ثانوي (مهني)</option>
                      <option value="شهادة الثانوية العامة (ناجح)">ثانوية عامة (ناجح)</option>
                      <option value="شهادة الثانوية العامة (غير مستكمل)">ثانوية عامة (غير مستكمل)</option>
                      <option value="مؤهل علمي آخر">مؤهل آخر</option>
                    </select>
                  </Field>
                  <Field label="اسم آخر مدرسة">
                    <input name="schoolName" value={form.schoolName} onChange={field} placeholder="مدرسة دير علا الثانوية" className={inputCls} />
                  </Field>
                  <Field label="سنة التخرج">
                    <select name="graduationYear" value={form.graduationYear} onChange={field} className={inputCls}>
                      {["2025", "2024", "2023", "2022", "2021", "2020 أو قبل"].map((y) => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </Field>

                  <label className="sm:col-span-3 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 cursor-pointer">
                    <input type="checkbox" name="isPhysicallyFit" checked={form.isPhysicallyFit} onChange={field} className="mt-0.5 w-4 h-4 cursor-pointer" />
                    <span className="text-[11px] font-bold text-emerald-950">
                      أقر بأنني لائق صحياً وبدنياً للتدريب العملي في المشاغل
                      <span className="block font-normal text-emerald-800">(شرط القبول: اللياقة وموافقة المشرف بالمعهد).</span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Specialization */}
              <div>
                <h3 className="text-sm font-black flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                  <Wrench className="w-4 h-4 text-red-700" /> التخصص المطلوب
                </h3>

                {/* Female-only notice shown when gender=أنثى to highlight the dedicated program */}
                {form.gender === "أنثى" && (
                  <div className="mb-3 p-3 rounded-xl bg-pink-50 border border-pink-200 text-pink-900 text-[11px] font-bold flex items-center gap-2">
                    <Users className="w-4 h-4 text-pink-700 shrink-0" />
                    <span>دورة «مدخل بيانات» متاحة للإناث فقط ضمن تخصصات هذا العام.</span>
                  </div>
                )}
                {form.gender === "ذكر" && form.primarySpecialization === "مدخل بيانات" && (
                  <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-[11px] font-bold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>دورة «مدخل بيانات» مخصصة للإناث فقط — يرجى اختيار تخصص آخر.</span>
                  </div>
                )}

                <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-3">
                  {filterSpecializationsForGender(SPECIALIZATIONS, form.gender).map((s) => {
                    const Icon = s.icon;
                    const on = form.primarySpecialization === s.name;
                    return (
                      <button
                        type="button"
                        key={s.id}
                        onClick={() => setForm((p) => ({ ...p, primarySpecialization: s.name }))}
                        className={`relative p-2.5 rounded-xl border-2 text-right cursor-pointer transition-colors ${
                          on ? "border-red-600 bg-red-50" : "border-slate-200 hover:border-slate-300"
                        } ${s.femaleOnly ? "border-pink-200" : ""}`}
                      >
                        {s.femaleOnly && (
                          <span className="absolute -top-2 left-1 text-[9px] font-black px-1.5 py-0.5 rounded-full bg-pink-600 text-white flex items-center gap-0.5">
                            <Users className="w-2.5 h-2.5" /> إناث
                          </span>
                        )}
                        <Icon className={`w-5 h-5 mb-1 ${on ? "text-red-700" : "text-slate-500"}`} />
                        <div className="text-[11px] font-bold leading-tight">{s.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{s.sub}</div>
                      </button>
                    );
                  })}
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <Field label="الرغبة الثانية (بديلة)">
                    <select name="secondarySpecialization" value={form.secondarySpecialization} onChange={field} className={inputCls}>
                      {filterSpecializationsForGender(SPECIALIZATIONS, form.gender).map((s) => (
                        <option key={s.id} value={s.name}>{s.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="الدافع المهني (اختياري)">
                    <input name="motivation" value={form.motivation} onChange={field} placeholder="لماذا اخترت هذا التخصص؟" className={inputCls} />
                  </Field>
                </div>
              </div>

              {/* Documents + pledge */}
              <div>
                <h3 className="text-sm font-black flex items-center gap-2 border-b border-slate-100 pb-2 mb-4">
                  <FileText className="w-4 h-4 text-red-700" /> الوثائق والتأكيد
                </h3>
                <div className="grid sm:grid-cols-2 gap-2 mb-4">
                  {docsList.map((d) => {
                    const on = docsPrepared.includes(d);
                    return (
                      <button
                        type="button"
                        key={d}
                        onClick={() => toggleDoc(d)}
                        className={`text-right p-2.5 rounded-xl border text-[11px] cursor-pointer ${on ? "bg-red-50 border-red-300 font-bold text-red-950" : "bg-slate-50 border-slate-200 text-slate-700"}`}
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className={`w-4 h-4 rounded border flex items-center justify-center text-[9px] ${on ? "bg-red-700 border-red-700 text-white" : "bg-white border-slate-300"}`}>
                            {on ? "✓" : ""}
                          </span>
                          {d}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <label className="flex items-start gap-2.5 p-3.5 rounded-xl bg-slate-900 text-white cursor-pointer">
                  <input type="checkbox" name="agreementChecked" checked={form.agreementChecked} onChange={field} className="mt-0.5 w-4 h-4 cursor-pointer" />
                  <span className="text-[11px] font-semibold text-slate-200">
                    أتعهد بأن جميع البيانات والوثائق المدخلة صحيحة ومطابقة للواقع، وألتزم بأنظمة مؤسسة التدريب المهني والمواظبة على دوام المشاغل.
                  </span>
                </label>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                <span className="text-[11px] text-slate-500">جميع الحقول المعلمة بـ (<span className="text-red-600">*</span>) إلزامية.</span>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-black shadow-md flex items-center gap-2 disabled:opacity-60 active:scale-95 cursor-pointer"
                >
                  {submitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-amber-300" /> تأكيد التسجيل وإصدار البطاقة
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ================= TRACK ================= */}
      <section id="track" className="py-14 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-7">
            <h2 className="text-2xl sm:text-3xl font-black">استعلام عن حالة الطلب</h2>
            <p className="text-slate-600 text-xs mt-2">أدخل رقم الطلب أو الرقم الوطني / رقم الجواز.</p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row gap-2.5">
            <input
              value={trackQuery}
              onChange={(e) => setTrackQuery(e.target.value)}
              placeholder="VTC-GHR-2025-1082 أو 2006123456"
              className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white text-sm font-semibold"
            />
            <button onClick={() => runTrack()} disabled={tracking} className="px-6 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer">
              {tracking ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search className="w-4 h-4" />}
              استعلام
            </button>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
            <span>نماذج سريعة:</span>
            {["2006123456", "2007654321"].map((q) => (
              <button key={q} onClick={() => { setTrackQuery(q); runTrack(q); }} className="px-2 py-0.5 rounded bg-white border border-slate-200 font-mono hover:text-red-700 cursor-pointer" dir="ltr">
                {q}
              </button>
            ))}
          </div>

          {trackError && (
            <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" /> {trackError}
            </div>
          )}

          {tracked && (
            <div className="mt-5 rounded-2xl border border-slate-200 overflow-hidden">
              <div className="bg-slate-900 text-white p-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] font-mono text-amber-400" dir="ltr">{tracked.applicationNumber}</div>
                  <div className="text-lg font-black">{tracked.fullName}</div>
                  <div className="text-[11px] text-slate-300">التخصص: <b className="text-white">{tracked.primarySpecialization}</b></div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold">{tracked.status}</span>
                  <button onClick={() => window.print()} className="no-print px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-bold cursor-pointer">طباعة</button>
                </div>
              </div>

              <div className="p-4 bg-slate-50 grid grid-cols-2 sm:grid-cols-4 gap-2">
                {STAGES.map((s, i) => {
                  const cur = stageOf(tracked.status);
                  const done = cur >= i + 1;
                  return (
                    <div key={s} className={`p-2.5 rounded-xl border text-[11px] ${cur === i + 1 ? "bg-amber-50 border-amber-300 text-amber-950" : done ? "bg-emerald-50 border-emerald-200 text-emerald-900" : "bg-white border-slate-200 text-slate-400"}`}>
                      <div className="font-bold">{`المرحلة ${i + 1}: ${s}`}</div>
                      <div className="mt-0.5">{done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : "—"} </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 grid sm:grid-cols-2 gap-3 text-[11px]">
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200">
                  <div className="font-bold text-amber-900">موعد المقابلة:</div>
                  <div className="text-slate-700 mt-0.5">{tracked.interviewDate || "سيتم إعلامكم لاحقاً"}</div>
                  {tracked.supervisorNotes && <div className="mt-1.5 pt-1.5 border-t border-amber-200 text-slate-600"><b>ملاحظات المشرف:</b> {tracked.supervisorNotes}</div>}
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                  <div className="font-bold text-emerald-900">الحوافز والدعم:</div>
                  <div className="text-slate-700 mt-0.5">{tracked.isAidBeneficiary ? "مستفيد من صندوق المعونة الوطنية (إعفاء + بدل مواصلات)" : "مستحق لبدل المواصلات الشهري"}</div>
                  <div className="mt-1.5 pt-1.5 border-t border-emerald-200 text-slate-600">
                    <b>IBAN:</b> <span className="font-mono" dir="ltr">{tracked.iban || "لم يُزود بعد"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ================= ADMIN ================= */}
      <section id="admin" className="py-14 bg-slate-100 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <span className="text-[11px] font-bold bg-slate-900 text-amber-400 px-3 py-1 rounded-full inline-flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" /> لوحة المعهد
              </span>
              <h2 className="text-2xl sm:text-3xl font-black mt-2">إدارة طلبات التسجيل</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={exportCsv} className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer">
                <Download className="w-3.5 h-3.5" /> تصدير CSV
              </button>
              <button
                onClick={async () => { await fetch("/api/seed", { method: "POST" }); loadApps(); }}
                className="px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-[11px] font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Database className="w-3.5 h-3.5" /> بيانات تجريبية
              </button>
              <button onClick={loadApps} className="p-2 rounded-xl bg-white border border-slate-300 hover:bg-slate-50 cursor-pointer">
                <RefreshCw className={`w-4 h-4 ${loadingApps ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              ["إجمالي المتقدمين", counts.total, "text-slate-900"],
              ["قيد المراجعة", counts.review, "text-amber-600"],
              ["بانتظار المقابلة", counts.interview, "text-blue-600"],
              ["المقبولون", counts.accepted, "text-emerald-600"],
            ].map(([label, value, color]) => (
              <div key={label as string} className="p-4 rounded-2xl bg-white border border-slate-200">
                <div className="text-[11px] font-bold text-slate-500">{label}</div>
                <div className={`text-2xl font-black ${color}`}>{value}</div>
              </div>
            ))}
          </div>

          <div className="bg-white p-3 rounded-2xl border border-slate-200 flex flex-col sm:flex-row gap-2">
            <input
              value={adminSearch}
              onChange={(e) => setAdminSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadApps()}
              placeholder="بحث بالاسم أو الرقم الوطني أو رقم الطلب..."
              className="flex-1 px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs"
            />
            <select value={adminStatus} onChange={(e) => setAdminStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
              <option value="ALL">جميع الحالات</option>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <button onClick={loadApps} className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer">بحث</button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-[11px]">
                <thead className="bg-slate-900 text-white font-bold">
                  <tr>
                    <th className="py-2.5 px-3">رقم الطلب</th>
                    <th className="py-2.5 px-3">المتدرب</th>
                    <th className="py-2.5 px-3">الرقم الوطني</th>
                    <th className="py-2.5 px-3">العمر</th>
                    <th className="py-2.5 px-3">التخصص</th>
                    <th className="py-2.5 px-3">المنطقة</th>
                    <th className="py-2.5 px-3">الهاتف</th>
                    <th className="py-2.5 px-3">الحالة</th>
                    <th className="py-2.5 px-3 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {loadingApps ? (
                    <tr><td colSpan={9} className="py-10 text-center text-slate-500">جاري التحميل...</td></tr>
                  ) : apps.length === 0 ? (
                    <tr><td colSpan={9} className="py-10 text-center text-slate-500">لا توجد طلبات مطابقة.</td></tr>
                  ) : (
                    apps.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50">
                        <td className="py-2.5 px-3 font-mono font-bold" dir="ltr">{a.applicationNumber}</td>
                        <td className="py-2.5 px-3 font-bold">{a.fullName}</td>
                        <td className="py-2.5 px-3 font-mono">{a.nationalId}</td>
                        <td className="py-2.5 px-3">{a.age}</td>
                        <td className="py-2.5 px-3"><span className="bg-red-50 text-red-700 px-2 py-0.5 rounded font-bold">{a.primarySpecialization}</span></td>
                        <td className="py-2.5 px-3 text-slate-600 max-w-[140px] truncate">{a.district}</td>
                        <td className="py-2.5 px-3 font-mono" dir="ltr">{a.phoneNumber}</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full font-bold ${a.status === "مقبول نهائياً" ? "bg-emerald-100 text-emerald-800" : a.status === "مرفوض" ? "bg-red-100 text-red-800" : a.status === "بانتظار المقابلة" ? "bg-blue-100 text-blue-800" : "bg-amber-100 text-amber-800"}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => { setEditing(a); setEditStatus(a.status); setEditDate(a.interviewDate || ""); setEditNotes(a.supervisorNotes || ""); }}
                              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 cursor-pointer"
                              title="تحديث"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => removeApp(a.id)} className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-600 cursor-pointer" title="حذف">
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {editing && (
            <div className="rounded-2xl bg-white border border-slate-300 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black">تحديث الطلب: {editing.fullName}</h3>
                <button onClick={() => setEditing(null)} className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer">إلغاء ✕</button>
              </div>
              <div className="grid sm:grid-cols-3 gap-3">
                <select value={editStatus} onChange={(e) => setEditStatus(e.target.value)} className="px-3 py-2 rounded-xl border border-slate-300 text-xs bg-white">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <input value={editDate} onChange={(e) => setEditDate(e.target.value)} placeholder="موعد المقابلة" className="px-3 py-2 rounded-xl border border-slate-300 text-xs" />
                <input value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="ملاحظات المشرف" className="px-3 py-2 rounded-xl border border-slate-300 text-xs" />
              </div>
              <button onClick={saveEdit} className="px-5 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white text-xs font-bold cursor-pointer">حفظ التغييرات</button>
            </div>
          )}
        </div>
      </section>

      {/* ================= CONTACT + FAQ ================= */}
      <section id="contact" className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-8">
          <div className="space-y-5">
            <h2 className="text-2xl sm:text-3xl font-black">اتصل بمعهد الغور الأوسط</h2>
            <p className="text-slate-600 text-sm">المملكة الأردنية الهاشمية — مديرية تدريب مهني إقليم الوسط.</p>

            <div className="grid sm:grid-cols-2 gap-3">
              <a href="tel:053584316" className="p-4 rounded-2xl bg-slate-50 border border-slate-200 hover:border-red-400 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0"><Phone className="w-4.5 h-4.5" /></div>
                <div>
                  <div className="text-[11px] text-slate-500">الهاتف الأرضي</div>
                  <div className="font-bold font-mono" dir="ltr">05 / 35 843 16</div>
                </div>
              </a>
              <a href="https://wa.me/962799769904" target="_blank" rel="noreferrer" className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 hover:border-emerald-400 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0"><MessageSquare className="w-4.5 h-4.5" /></div>
                <div>
                  <div className="text-[11px] text-emerald-800">الواتساب</div>
                  <div className="font-bold font-mono text-emerald-950" dir="ltr">0799769904</div>
                </div>
              </a>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0"><MapPin className="w-4.5 h-4.5" /></div>
                <div>
                  <div className="text-[11px] text-slate-500">الموقع</div>
                  <div className="font-bold text-sm">الأغوار — محافظة البلقاء</div>
                </div>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0"><Clock className="w-4.5 h-4.5" /></div>
                <div>
                  <div className="text-[11px] text-slate-500">الدوام الرسمي</div>
                  <div className="font-bold text-sm">الأحد — الخميس (8:00 ص - 3:00 م)</div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gradient-to-l from-red-700 to-slate-900 text-white p-5 flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm font-black">لا تفوّت الفرصة — سجّل اليوم وابدأ مهارتك!</div>
              <button onClick={() => go("register")} className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 text-xs font-black cursor-pointer">التسجيل الإلكتروني</button>
            </div>
          </div>

          <div className="space-y-2.5">
            <h3 className="text-lg font-black mb-2">الأسئلة الشائعة</h3>
            {FAQS.map((f, i) => {
              const open = openFaq === i;
              return (
                <div key={f.q} className="border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => setOpenFaq(open ? null : i)} className="w-full text-right p-3.5 flex items-center justify-between gap-3 text-sm font-bold hover:bg-slate-50 cursor-pointer">
                    <span>{f.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? "rotate-180" : ""}`} />
                  </button>
                  {open && <div className="px-3.5 pb-3.5 text-[11px] text-slate-600 border-t border-slate-100 pt-2.5 bg-slate-50">{f.a}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px]">
          <div className="flex items-center gap-2.5">
            <VtcMark size="sm" />
            <div>
              <div className="text-white font-bold">مؤسسة التدريب المهني — معهد الغور الأوسط</div>
              <div>جميع الحقوق محفوظة © {new Date().getFullYear()}</div>
            </div>
          </div>
          {/* إعادة عرض شاشة الترحيب التفاعلية */}
          <button
            onClick={() => {
              setWelcomeClosing(false);
              setWelcomeOpen(true);
              document.body.classList.add("welcome-locked");
            }}
            className="no-print px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-amber-400 flex items-center gap-1.5 cursor-pointer transition-colors"
            title="إعادة عرض شاشة الترحيب"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-sans">شاشة الترحيب</span>
          </button>
          <div className="flex items-center gap-3 font-mono">
            <a href="tel:053584316" dir="ltr">05/3584316</a>
            <a href="https://wa.me/962799769904" dir="ltr" className="text-emerald-400">0799769904</a>
            <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} className="px-2.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 flex items-center gap-1 cursor-pointer">
              <ArrowUp className="w-3.5 h-3.5" /> للأعلى
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ============================================================
   SMALL UI HELPERS
   ============================================================ */

const inputCls =
  "w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-red-600 text-sm bg-white";

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-[11px] font-bold text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

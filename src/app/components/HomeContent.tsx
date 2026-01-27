"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
    Lock,
    Loader2,
    Sparkles,
    Library,
    BookOpen,
    Calculator,
    Atom,
    Globe,
    Languages,
    Heart,
    Palette,
    Briefcase,
    Compass,
    MoreHorizontal,
    Download,
    ArrowDown,
    ArrowUp,
    Database,
    ChevronDown,
    ChevronRight,
    Lightbulb,
} from "lucide-react";
import { AppData } from "./AppCard";
import AdminLoginModal from "./AdminLoginModal";
import { getApps, AppDocument, SubjectCategory, CATEGORY_NAMES, initializeDatabase } from "@/lib/firestore";

type Zone = "student" | "teacher";

// Icon mapping for each category
const CATEGORY_ICONS: Record<SubjectCategory, React.ElementType> = {
    general: Lightbulb,
    thai: BookOpen,
    math: Calculator,
    science: Atom,
    social: Globe,
    foreign: Languages,
    guidance: Compass,
    health: Heart,
    arts: Palette,
    career: Briefcase,
};

// Order of categories for display
const CATEGORY_ORDER: SubjectCategory[] = [
    "general",
    "science",
    "arts",
    "thai",
    "social",
    "math",
    "foreign",
    "guidance",
    "health",
    "career",
];

// Convert Firestore AppDocument to AppData format
function toAppData(doc: AppDocument): AppData {
    return {
        id: doc.id || "",
        name: doc.name,
        url: doc.url,
        iconUrl: doc.iconUrl,
        zone: doc.zone,
        category: doc.category,
        color: doc.color,
        isEnabled: doc.isEnabled !== false,
    };
}

// E-Book Card Component - สื่อการเรียนรู้แต่ละรายการ
function EBookCard({ app, priority = false }: { app: AppData; priority?: boolean }) {
    const isEnabled = app.isEnabled !== false;

    const handleClick = () => {
        if (!isEnabled) {
            alert("สื่อการเรียนรู้นี้ยังไม่เปิดให้บริการ");
            return;
        }
        window.open(app.url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleClick}
            className={`group flex flex-col items-center p-1 sm:p-5 rounded-3xl transition-all duration-300 hover:scale-105 active:scale-98 min-w-150px] ${isEnabled
                ? "bg-white/70 hover:bg-white/90 hover:shadow-xl cursor-pointer"
                : "bg-gray-100/50 cursor-not-allowed opacity-60"
                }`}
            style={{
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255, 255, 255, 0.7)",
                boxShadow: "0 2px 12px rgba(0, 0, 0, 0.04), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
            }}
            disabled={!isEnabled}
        >
            {/* Image/Icon Container - Adjusted for Full Cover Look */}
            <div className="w-full aspect-[1/1] mb-3 rounded-xl relative overflow-hidden bg-emerald-50/50 border border-emerald-100/50 transition-all duration-300 group-hover:shadow-md">
                {app.iconUrl && (app.iconUrl.startsWith("http") || app.iconUrl.startsWith("/") || app.iconUrl.startsWith("data:")) ? (
                    <Image
                        src={app.iconUrl}
                        alt={app.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        priority={priority}
                        sizes="(max-width: 768px) 50vw, 20vw"
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full">
                        <BookOpen className="w-8 h-8 sm:w-8 sm:h-8 text-emerald-300/50" />
                    </div>
                )}
            </div>

            {/* Title */}
            <span
                className="text-xs sm:text-sm font-medium text-slate-700 text-center line-clamp-2 leading-relaxed w-full px-1"
                dangerouslySetInnerHTML={{ __html: app.name }}
            />
        </button>
    );
}

// Category Colors Map - Cozy & Distinct Palette
const CATEGORY_COLORS: Record<SubjectCategory, {
    bg: string;
    text: string;
    border: string;
    iconBg: string;
    iconColor: string;
    lightBg: string;
}> = {
    general: { // Warm Amber/Yellow
        bg: "bg-amber-50",
        text: "text-amber-800",
        border: "border-amber-200",
        iconBg: "bg-amber-100",
        iconColor: "text-amber-600",
        lightBg: "bg-amber-50/50"
    },
    thai: { // Cozy Coral/Pink
        bg: "bg-rose-50",
        text: "text-rose-800",
        border: "border-rose-200",
        iconBg: "bg-rose-100",
        iconColor: "text-rose-600",
        lightBg: "bg-rose-50/50"
    },
    math: { // Calm Blue
        bg: "bg-blue-50",
        text: "text-blue-800",
        border: "border-blue-200",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
        lightBg: "bg-blue-50/50"
    },
    science: { // Fresh Teal/Cyan
        bg: "bg-cyan-50",
        text: "text-cyan-800",
        border: "border-cyan-200",
        iconBg: "bg-cyan-100",
        iconColor: "text-cyan-600",
        lightBg: "bg-cyan-50/50"
    },
    social: { // Earthy Orange/Terracotta
        bg: "bg-orange-50",
        text: "text-orange-800",
        border: "border-orange-200",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
        lightBg: "bg-orange-50/50"
    },
    foreign: { // Wise Purple
        bg: "bg-purple-50",
        text: "text-purple-800",
        border: "border-purple-200",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
        lightBg: "bg-purple-50/50"
    },
    guidance: { // Gentle Green
        bg: "bg-emerald-50",
        text: "text-emerald-800",
        border: "border-emerald-200",
        iconBg: "bg-emerald-100",
        iconColor: "text-emerald-600",
        lightBg: "bg-emerald-50/50"
    },
    health: { // Soft Red
        bg: "bg-red-50",
        text: "text-red-800",
        border: "border-red-200",
        iconBg: "bg-red-100",
        iconColor: "text-red-600",
        lightBg: "bg-red-50/50"
    },
    arts: { // Creative Indigo
        bg: "bg-indigo-50",
        text: "text-indigo-800",
        border: "border-indigo-200",
        iconBg: "bg-indigo-100",
        iconColor: "text-indigo-600",
        lightBg: "bg-indigo-50/50"
    },
    career: { // Professional Slate/Gray
        bg: "bg-slate-50",
        text: "text-slate-800",
        border: "border-slate-200",
        iconBg: "bg-slate-100",
        iconColor: "text-slate-600",
        lightBg: "bg-slate-50/50"
    },
};

// CategorySection Component - หมวดหมู่กลุ่ม สาระ (Collapsible)
function CategorySection({ category, apps }: { category: SubjectCategory; apps: AppData[] }) {
    const [isOpen, setIsOpen] = useState(false); // Default collapsed
    const IconComponent = CATEGORY_ICONS[category];
    const categoryName = CATEGORY_NAMES[category];
    const colors = CATEGORY_COLORS[category];

    if (apps.length === 0) return null;

    return (
        <div className={`rounded-2xl border transition-all duration-300 hover:shadow-md overflow-hidden ${isOpen
            ? `${colors.bg} ${colors.border} shadow-sm`
            : `${colors.lightBg} ${colors.border}/60 hover:${colors.bg}`
            }`}>
            {/* Category Header (Clickable) */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-3 transition-colors cursor-pointer text-left focus:outline-none group"
            >
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${colors.iconBg} ${colors.border} ${colors.iconColor} ${isOpen ? "shadow-sm scale-100" : "opacity-80 group-hover:opacity-100 group-hover:scale-110"}`}>
                        <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={`font-bold text-lg transition-colors ${colors.text}`}>
                            {categoryName}
                        </h3>
                        {!isOpen && (
                            <p className={`text-xs font-medium opacity-70 ${colors.text}`}>
                                {apps.length} รายการ
                            </p>
                        )}
                    </div>
                </div>
                <div className={`p-2 rounded-full transition-all duration-300 ${colors.iconColor} ${isOpen
                    ? "bg-white/40 rotate-180"
                    : "bg-white/0 group-hover:bg-white/30"
                    }`}>
                    <ChevronDown className="w-5 h-5" />
                </div>
            </button>

            {/* Apps Grid - Collapsible Content */}
            {isOpen && (
                <div className={`p-4 pt-2 border-t ${colors.border} animate-in slide-in-from-top-2 duration-200`}>
                    <div className="flex flex-wrap justify-start gap-4 sm:gap-6">
                        {apps.map((app, index) => (
                            <div
                                key={app.id}
                                className="animate-fade-in-up opacity-0"
                                style={{
                                    animationDelay: `${index * 30}ms`,
                                    animationFillMode: "forwards",
                                }}
                            >
                                <EBookCard app={app} priority={index < 8} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

// Zone Switcher Component - ตัวเลือกคลังครู/นักเรียน
function ZoneSwitcher({ currentZone, onZoneChange }: { currentZone: Zone; onZoneChange: (zone: Zone) => void }) {
    return (
        /* Adjust mb-6 to change spacing between the switcher and the content below */
        <div className="flex justify-center mb-0">
            <div
                className="inline-flex items-center gap-1 p-2 rounded-full"
                style={{
                    background: "rgba(255, 255, 255, 0.75)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    boxShadow: "0 4px 24px rgba(0, 0, 0, 0.06), inset 0 1px 2px rgba(255, 255, 255, 0.9)",
                }}
            >
                {/* Teacher Zone */}
                <button
                    onClick={() => onZoneChange("teacher")}
                    className={`flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 ${currentZone === "teacher"
                        ? "bg-white text-slate-700 shadow-lg"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                    style={{
                        boxShadow: currentZone === "teacher"
                            ? "0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(255, 255, 255, 0.9)"
                            : "none",
                    }}
                >
                    <span className="font-bold text-lg sm:text-xl">คลังครู</span>
                    <ArrowDown className={`w-6 h-6 transition-colors ${currentZone === "teacher" ? "text-emerald-500" : ""}`} />
                </button>

                {/* Student Zone */}
                <button
                    onClick={() => onZoneChange("student")}
                    className={`flex items-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full transition-all duration-300 ${currentZone === "student"
                        ? "bg-emerald-500 text-white shadow-lg"
                        : "text-slate-500 hover:text-slate-700"
                        }`}
                    style={{
                        boxShadow: currentZone === "student"
                            ? "0 6px 20px rgba(16, 185, 129, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3)"
                            : "none",
                    }}
                >
                    <ArrowUp className="w-6 h-6" />
                    <span className="font-bold text-lg sm:text-xl">คลังนักเรียน</span>
                </button>
            </div>
        </div>
    );
}

export default function HomeContent() {
    const [currentZone, setCurrentZone] = useState<Zone>("student");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [apps, setApps] = useState<AppData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSeeding, setIsSeeding] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();

    // Fetch apps from Firestore
    const fetchApps = useCallback(async () => {
        try {
            setError("");
            const fetchedApps = await getApps();
            setApps(fetchedApps.map(toAppData));
        } catch (err) {
            console.error("Failed to fetch apps:", err);
            setError("ไม่สามารถโหลดข้อมูลสื่อการเรียนรู้ได้");
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Load apps on mount
    useEffect(() => {
        fetchApps();
    }, [fetchApps]);

    // Check for showLogin query param
    useEffect(() => {
        if (searchParams.get("showLogin") === "true") {
            setIsLoginModalOpen(true);
            router.replace("/", { scroll: false });
        }
    }, [searchParams, router]);

    // Handle successful login
    const handleLoginSuccess = () => {
        setIsLoginModalOpen(false);
        router.push("/admin/dashboard");
    };

    // Handle data seeding
    const handleSeed = async () => {
        setIsSeeding(true);
        try {
            await initializeDatabase();
            await fetchApps();
        } catch (err) {
            console.error("Seeding failed", err);
            setError("ไม่สามารถติดตั้งข้อมูลตัวอย่างได้");
        } finally {
            setIsSeeding(false);
        }
    };

    // Filter apps based on current zone
    const filteredApps = useMemo(() => {
        return apps.filter(
            (app) => app.zone === currentZone || app.zone === "both"
        );
    }, [apps, currentZone]);

    // Group apps by category
    const appsByCategory = useMemo(() => {
        const grouped: Record<SubjectCategory, AppData[]> = {
            general: [],
            thai: [],
            math: [],
            science: [],
            social: [],
            foreign: [],
            guidance: [],
            health: [],
            arts: [],
            career: [],
        };

        filteredApps.forEach((app) => {
            if (app.category && grouped[app.category]) {
                grouped[app.category].push(app);
            } else {
                // ถ้าไม่มี category ให้ใส่ใน science เป็น default
                grouped.science.push(app);
            }
        });

        return grouped;
    }, [filteredApps]);

    // Get categories that have apps in a 2-column layout pattern
    const categoriesWithApps = useMemo(() => {
        return CATEGORY_ORDER.filter((cat) => appsByCategory[cat].length > 0);
    }, [appsByCategory]);

    return (
        <main
            className="min-h-screen flex flex-col relative"
            style={{
                backgroundImage: "url('/bg-hongson.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            {/* Header with Zone Switcher */}
            <header className="sticky top-0 z-50 py-4 px-4">
                <ZoneSwitcher
                    currentZone={currentZone}
                    onZoneChange={setCurrentZone}
                />
            </header>

            {/* Main Content */}
            <section className="flex-1 px-4 pb-8">
                <div className="max-w-5xl mx-auto">
                    {/* Main Content Card */}
                    <div
                        className="rounded-3xl p-5 sm:p-8"
                        style={{
                            background: "rgba(255, 255, 255, 0.5)",
                            backdropFilter: "blur(24px)",
                            border: "1px solid rgba(255, 255, 255, 0.6)",
                            boxShadow: "0 8px 40px rgba(0, 0, 0, 0.06), inset 0 2px 4px rgba(255, 255, 255, 0.9)",
                        }}
                    >
                        {/* Section Title */}
                        <div className="flex items-center justify-center gap-3 mb-6">
                            <div className="w-16 h-16 relative flex items-center justify-center filter drop-shadow-md">
                                <Image
                                    src="/logo-main.png"
                                    alt="E-Learning Logo"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="inline-flex flex-col items-center justify-center px-8 py-3 rounded-2xl bg-gradient-to-r from-slate-100 via-white to-slate-100 border border-slate-200/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] backdrop-blur-xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-purple-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent text-center relative z-10">
                                        คลังสื่อการเรียนรู้ออนไลน์
                                    </h2>
                                    <span className="text-sm sm:text-base font-medium text-slate-500 mt-1 relative z-10 tracking-wide">
                                        (HONGSON e-Learning)
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Loading State */}
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                        style={{
                                            background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))",
                                            border: "1px solid rgba(255, 255, 255, 0.5)",
                                        }}
                                    >
                                        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl bg-emerald-400 blur-2xl opacity-20" />
                                </div>
                                <p className="text-slate-500 mt-4 font-medium">กำลังโหลดสื่อการเรียนรู้...</p>
                            </div>
                        )}

                        {/* Error State */}
                        {!isLoading && error && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
                                    <BookOpen className="w-8 h-8 text-rose-400" />
                                </div>
                                <p className="text-rose-600 mb-4 font-medium">{error}</p>
                                <button
                                    onClick={fetchApps}
                                    className="px-6 py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 hover:shadow-lg transition-all"
                                >
                                    ลองใหม่อีกครั้ง
                                </button>
                            </div>
                        )}

                        {/* Content Grid - Single Column Layout */}
                        {!isLoading && !error && (
                            <div className="flex flex-col gap-3">
                                {categoriesWithApps.map((category) => (
                                    <CategorySection
                                        key={category}
                                        category={category}
                                        apps={appsByCategory[category]}
                                    />
                                ))}

                                {/* Empty State */}
                                {categoriesWithApps.length === 0 && (
                                    <div className="flex flex-col items-center justify-center py-16">
                                        <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mb-4 border border-emerald-100">
                                            <BookOpen className="w-10 h-10 text-emerald-300" />
                                        </div>
                                        <p className="text-slate-500 text-center mb-2">
                                            ยังไม่มีสื่อการเรียนรู้สำหรับ{currentZone === "student" ? "นักเรียน" : "ครู"}
                                        </p>

                                        {/* Seed Button for Demo */}
                                        <button
                                            onClick={handleSeed}
                                            disabled={isSeeding}
                                            className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-100/50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-medium text-sm transition-all flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isSeeding ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                <Database className="w-4 h-4" />
                                            )}
                                            {isSeeding ? "กำลังติดตั้ง..." : "ติดตั้งข้อมูลตัวอย่าง"}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-6 px-4">
                <div className="max-w-5xl mx-auto flex items-center justify-center">
                    <div className="developer-badge">
                        <div className="developer-badge-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M8 5L3 12L8 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M16 5L21 12L16 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                        <div className="developer-badge-content">
                            <span className="developer-badge-label">DEVELOPER</span>
                            <span className="developer-badge-name">ผู้พัฒนา: นายสาธิต ศิริวัชน์</span>
                        </div>
                        <div className="developer-badge-sparkle">
                            <Sparkles className="w-4 h-4" />
                        </div>
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className="ml-2 p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-black/5 transition-all"
                            title="เข้าสู่ระบบผู้ดูแล"
                        >
                            <Lock className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </footer>

            {/* Admin Login Modal */}
            <AdminLoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onSuccess={handleLoginSuccess}
            />
        </main>
    );
}

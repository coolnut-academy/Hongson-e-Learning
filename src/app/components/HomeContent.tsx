"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
    BookOpen,
    Lock,
    Loader2,
    RefreshCw,
    GraduationCap,
    Search,
    Sparkles,
    Library,
    BookMarked
} from "lucide-react";
import AppGrid from "./AppGrid";
import { AppData } from "./AppCard";
import AdminLoginModal from "./AdminLoginModal";
import { getApps, AppDocument } from "@/lib/firestore";

type Zone = "student" | "teacher";

// Convert Firestore AppDocument to AppData format
function toAppData(doc: AppDocument): AppData {
    return {
        id: doc.id || "",
        name: doc.name,
        url: doc.url,
        iconUrl: doc.iconUrl,
        zone: doc.zone,
        color: doc.color,
        isEnabled: doc.isEnabled !== false,
    };
}

// Decorative Floating Bubble Component
function FloatingBubble({
    size,
    position,
    color,
    delay = 0
}: {
    size: number;
    position: { top?: string; bottom?: string; left?: string; right?: string };
    color: "violet" | "emerald" | "white";
    delay?: number;
}) {
    const colorClasses = {
        violet: "from-violet-300/30 to-purple-400/20",
        emerald: "from-emerald-300/30 to-teal-400/20",
        white: "from-white/40 to-white/20"
    };

    return (
        <div
            className={`absolute rounded-full bg-gradient-to-br ${colorClasses[color]} backdrop-blur-sm border border-white/30 animate-float pointer-events-none`}
            style={{
                width: size,
                height: size,
                ...position,
                animationDelay: `${delay}s`,
            }}
        >
            {/* Inner specular highlight */}
            <div
                className="absolute top-1 left-1 w-1/3 h-1/3 rounded-full bg-white/50 blur-sm"
            />
        </div>
    );
}

// Zone Card Component (New Design)
function ZoneCard({
    zone,
    isActive,
    onClick,
    count
}: {
    zone: Zone;
    isActive: boolean;
    onClick: () => void;
    count: number;
}) {
    const isTeacher = zone === "teacher";

    return (
        <button
            onClick={onClick}
            className={`
                relative flex-1 min-h-[140px] sm:min-h-[160px] p-5 sm:p-6 rounded-3xl
                transition-all duration-500 ease-out
                ${isActive
                    ? 'scale-[1.02] shadow-2xl'
                    : 'hover:scale-[1.01] hover:shadow-xl opacity-80 hover:opacity-100'
                }
                overflow-hidden group
            `}
            style={{
                background: isActive
                    ? isTeacher
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.85) 100%)'
                        : 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.85) 100%)'
                    : 'rgba(255, 255, 255, 0.4)',
                backdropFilter: 'blur(20px)',
                border: isActive
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid rgba(255, 255, 255, 0.5)',
                boxShadow: isActive
                    ? isTeacher
                        ? '0 20px 50px rgba(139, 92, 246, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
                        : '0 20px 50px rgba(16, 185, 129, 0.4), inset 0 1px 1px rgba(255, 255, 255, 0.4)'
                    : '0 8px 32px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.6)',
            }}
        >
            {/* Specular Highlight */}
            <div
                className="absolute top-0 left-0 right-0 h-1/2 rounded-t-3xl pointer-events-none"
                style={{
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 40%, transparent 100%)',
                }}
            />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center gap-3 text-center">
                {/* Icon */}
                <div
                    className={`
                        w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center
                        transition-all duration-300
                        ${isActive
                            ? 'bg-white/25 shadow-lg'
                            : isTeacher
                                ? 'bg-violet-100 group-hover:bg-violet-200'
                                : 'bg-emerald-100 group-hover:bg-emerald-200'
                        }
                    `}
                >
                    {isTeacher ? (
                        <BookOpen className={`w-7 h-7 sm:w-8 sm:h-8 ${isActive ? 'text-white' : 'text-violet-600'}`} />
                    ) : (
                        <GraduationCap className={`w-7 h-7 sm:w-8 sm:h-8 ${isActive ? 'text-white' : 'text-emerald-600'}`} />
                    )}
                </div>

                {/* Title */}
                <div>
                    <h3 className={`text-base sm:text-lg font-bold ${isActive ? 'text-white' : 'text-slate-700'}`}>
                        คลังความรู้
                    </h3>
                    <p className={`text-sm sm:text-base font-semibold ${isActive ? 'text-white/90' : isTeacher ? 'text-violet-600' : 'text-emerald-600'}`}>
                        {isTeacher ? 'สำหรับครู' : 'สำหรับนักเรียน'}
                    </p>
                </div>

                {/* Count Badge */}
                <span
                    className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${isActive
                            ? 'bg-white/25 text-white'
                            : isTeacher
                                ? 'bg-violet-100 text-violet-700'
                                : 'bg-emerald-100 text-emerald-700'
                        }
                    `}
                >
                    {count} รายการ
                </span>
            </div>

            {/* Ambient glow when active */}
            {isActive && (
                <div
                    className="absolute inset-0 -z-10 rounded-3xl blur-3xl opacity-50"
                    style={{
                        background: isTeacher
                            ? 'rgba(139, 92, 246, 0.6)'
                            : 'rgba(16, 185, 129, 0.6)',
                    }}
                />
            )}
        </button>
    );
}

export default function HomeContent() {
    const [currentZone, setCurrentZone] = useState<Zone>("teacher");
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [apps, setApps] = useState<AppData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
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
            setError("ไม่สามารถโหลดข้อมูลแหล่งเรียนรู้ได้");
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

    // Filter apps based on current zone and search
    const filteredApps = useMemo(() => {
        let result = apps.filter(
            (app) => app.zone === currentZone || app.zone === "both"
        );

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            result = result.filter(app =>
                app.name.toLowerCase().includes(query)
            );
        }

        return result;
    }, [apps, currentZone, searchQuery]);

    // Count apps per zone
    const teacherCount = apps.filter(a => a.zone === "teacher" || a.zone === "both").length;
    const studentCount = apps.filter(a => a.zone === "student" || a.zone === "both").length;

    return (
        <main className="min-h-screen flex flex-col relative overflow-hidden">
            {/* Decorative Background Bubbles */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <FloatingBubble size={120} position={{ top: '5%', left: '5%' }} color="violet" delay={0} />
                <FloatingBubble size={80} position={{ top: '15%', right: '10%' }} color="emerald" delay={1} />
                <FloatingBubble size={60} position={{ bottom: '30%', left: '8%' }} color="white" delay={2} />
                <FloatingBubble size={100} position={{ bottom: '10%', right: '5%' }} color="violet" delay={0.5} />
                <FloatingBubble size={50} position={{ top: '40%', right: '3%' }} color="emerald" delay={1.5} />
                <FloatingBubble size={70} position={{ bottom: '20%', left: '15%' }} color="white" delay={2.5} />
            </div>

            {/* Top Navigation Bar */}
            <header className="sticky top-0 z-50 px-4 py-3">
                <div
                    className="max-w-6xl mx-auto flex items-center justify-between gap-4 px-4 py-3 rounded-2xl"
                    style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.5)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                    }}
                >
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Image
                                src="/logo.png"
                                alt="Hongson e-Learning"
                                width={44}
                                height={44}
                                className="w-10 h-10 sm:w-11 sm:h-11 object-contain rounded-xl"
                                priority
                            />
                            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-white shadow-sm" />
                        </div>
                        <span className="hidden sm:block text-lg font-bold text-slate-700">
                            Hongson <span className="text-violet-600">e-Learning</span>
                        </span>
                    </div>

                    {/* Search Bar */}
                    <div className="flex-1 max-w-md mx-4">
                        <div
                            className="relative"
                        >
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="ค้นหาความรู้..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-2.5 rounded-xl bg-white/60 backdrop-blur-sm border border-white/60 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 outline-none text-slate-700 placeholder:text-slate-400 transition-all"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={fetchApps}
                            className="p-2.5 rounded-xl bg-white/50 hover:bg-white/70 border border-white/50 transition-all"
                            title="รีเฟรช"
                        >
                            <RefreshCw className={`w-5 h-5 text-slate-600 ${isLoading ? "animate-spin" : ""}`} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 text-center py-8 sm:py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    {/* Badge */}
                    <div
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                        style={{
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                        }}
                    >
                        <Library className="w-4 h-4 text-violet-600" />
                        <span className="text-sm font-medium text-slate-600">แหล่งรวมทรัพยากรการเรียนรู้เพื่ออนาคตที่ไร้ขีดจำกัด</span>
                        <Sparkles className="w-4 h-4 text-emerald-500" />
                    </div>

                    {/* Title */}
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-800 mb-3">
                        คลังความรู้<span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-emerald-500">ดิจิทัล</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
                        เข้าถึงสื่อการเรียนรู้ E-Book และทรัพยากรดิจิทัลครบครัน
                        <br className="hidden sm:block" />
                        สำหรับครูและนักเรียนโรงเรียนบ้านหงษ์ทอง
                    </p>
                </div>
            </section>

            {/* Zone Selector Cards */}
            <section className="relative z-10 px-4 pb-6">
                <div className="max-w-2xl mx-auto flex gap-4">
                    <ZoneCard
                        zone="teacher"
                        isActive={currentZone === "teacher"}
                        onClick={() => setCurrentZone("teacher")}
                        count={teacherCount}
                    />
                    <ZoneCard
                        zone="student"
                        isActive={currentZone === "student"}
                        onClick={() => setCurrentZone("student")}
                        count={studentCount}
                    />
                </div>
            </section>

            {/* Resources Section */}
            <section className="relative z-10 flex-1 px-4 pb-8">
                <div className="max-w-6xl mx-auto">
                    {/* Section Header */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center ${currentZone === "teacher" ? "bg-violet-100" : "bg-emerald-100"
                                    }`}
                            >
                                <BookMarked className={`w-5 h-5 ${currentZone === "teacher" ? "text-violet-600" : "text-emerald-600"
                                    }`} />
                            </div>
                            <div>
                                <h2 className="text-lg sm:text-xl font-bold text-slate-700">
                                    สื่อการเรียนรู้และ E-Book
                                </h2>
                                <p className="text-sm text-slate-500">
                                    {currentZone === "teacher" ? "สำหรับคุณครู" : "สำหรับนักเรียน"}
                                </p>
                            </div>
                        </div>

                        {searchQuery && (
                            <span className="text-sm text-slate-500">
                                ผลการค้นหา: {filteredApps.length} รายการ
                            </span>
                        )}
                    </div>

                    {/* Content Card */}
                    <div
                        className="rounded-3xl p-4 sm:p-6 md:p-8"
                        style={{
                            background: 'rgba(255, 255, 255, 0.5)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255, 255, 255, 0.5)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), inset 0 1px 1px rgba(255, 255, 255, 0.8)',
                        }}
                    >
                        {isLoading ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="relative">
                                    <div
                                        className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                        style={{
                                            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(16, 185, 129, 0.2))',
                                            border: '1px solid rgba(255, 255, 255, 0.5)',
                                        }}
                                    >
                                        <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                                    </div>
                                    <div className="absolute inset-0 rounded-2xl bg-violet-400 blur-2xl opacity-20" />
                                </div>
                                <p className="text-slate-500 mt-4 font-medium">กำลังโหลดแหล่งเรียนรู้...</p>
                            </div>
                        ) : error ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <div className="w-16 h-16 rounded-2xl bg-rose-100 flex items-center justify-center mb-4">
                                    <BookOpen className="w-8 h-8 text-rose-400" />
                                </div>
                                <p className="text-rose-600 mb-4 font-medium">{error}</p>
                                <button
                                    onClick={fetchApps}
                                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-emerald-500 text-white font-medium hover:shadow-lg transition-all"
                                >
                                    ลองใหม่อีกครั้ง
                                </button>
                            </div>
                        ) : (
                            <AppGrid
                                apps={filteredApps}
                                emptyMessage={
                                    searchQuery
                                        ? `ไม่พบผลลัพธ์สำหรับ "${searchQuery}"`
                                        : `ยังไม่มีแหล่งเรียนรู้สำหรับ${currentZone === "student" ? "นักเรียน" : "ครู"}`
                                }
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative z-10 py-6 px-4">
                <div className="max-w-6xl mx-auto flex items-center justify-center">
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
                            className="ml-2 p-1.5 rounded-lg text-white/60 hover:text-white hover:bg-white/20 transition-all"
                            title="Admin Access"
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

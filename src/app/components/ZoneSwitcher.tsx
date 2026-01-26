"use client";

import { BookOpen, GraduationCap } from "lucide-react";

type Zone = "student" | "teacher";

interface ZoneSwitcherProps {
    currentZone: Zone;
    onZoneChange: (zone: Zone) => void;
}

export default function ZoneSwitcher({
    currentZone,
    onZoneChange,
}: ZoneSwitcherProps) {
    return (
        <div className="w-full max-w-md mx-auto">
            {/* Liquid Glass container */}
            <div className="relative p-1.5 rounded-[24px] glass-zone-switcher">
                {/* Animated sliding Liquid Glass indicator */}
                <div
                    className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] rounded-[18px] transition-all duration-500 ease-out ${currentZone === "teacher"
                        ? "left-1.5"
                        : "left-[calc(50%+3px)]"
                        }`}
                    style={{
                        background: currentZone === "teacher"
                            ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.9) 0%, rgba(124, 58, 237, 0.95) 100%)'
                            : 'linear-gradient(135deg, rgba(16, 185, 129, 0.9) 0%, rgba(5, 150, 105, 0.95) 100%)',
                        boxShadow: currentZone === "teacher"
                            ? `0 8px 32px rgba(139, 92, 246, 0.4),
                               inset 0 1px 1px rgba(255, 255, 255, 0.4),
                               inset 0 -2px 4px rgba(0, 0, 0, 0.1)`
                            : `0 8px 32px rgba(16, 185, 129, 0.4),
                               inset 0 1px 1px rgba(255, 255, 255, 0.4),
                               inset 0 -2px 4px rgba(0, 0, 0, 0.1)`,
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                    }}
                >
                    {/* Specular highlight on indicator */}
                    <div
                        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-[18px] pointer-events-none"
                        style={{
                            background: 'linear-gradient(to bottom, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                        }}
                    />
                    {/* Ambient glow */}
                    <div
                        className="absolute inset-0 rounded-[18px] blur-xl opacity-60 -z-10"
                        style={{
                            background: currentZone === "teacher"
                                ? 'rgba(139, 92, 246, 0.6)'
                                : 'rgba(16, 185, 129, 0.6)',
                        }}
                    />
                </div>

                {/* Buttons container */}
                <div className="relative flex">
                    {/* Teacher Zone Button - Now First */}
                    <button
                        onClick={() => onZoneChange("teacher")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-[18px] transition-all duration-300 relative z-10 ${currentZone === "teacher"
                            ? "text-white"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <BookOpen
                            className={`w-5 h-5 transition-all duration-300 ${currentZone === "teacher"
                                ? "scale-110 drop-shadow-lg"
                                : "scale-100"
                                }`}
                        />
                        <span className={`font-semibold text-sm sm:text-base ${currentZone === "teacher" ? "drop-shadow-sm" : ""
                            }`}>
                            คลังความรู้ครู
                        </span>
                    </button>

                    {/* Student Zone Button - Now Second */}
                    <button
                        onClick={() => onZoneChange("student")}
                        className={`flex-1 flex items-center justify-center gap-2 py-4 px-4 rounded-[18px] transition-all duration-300 relative z-10 ${currentZone === "student"
                            ? "text-white"
                            : "text-slate-500 hover:text-slate-700"
                            }`}
                    >
                        <GraduationCap
                            className={`w-5 h-5 transition-all duration-300 ${currentZone === "student"
                                ? "scale-110 drop-shadow-lg"
                                : "scale-100"
                                }`}
                        />
                        <span className={`font-semibold text-sm sm:text-base ${currentZone === "student" ? "drop-shadow-sm" : ""
                            }`}>
                            คลังความรู้นักเรียน
                        </span>
                    </button>
                </div>
            </div>

            {/* Zone indicator text with Liquid Glass pill */}
            <div className="flex justify-center mt-4">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-500"
                    style={{
                        background: 'rgba(255, 255, 255, 0.25)',
                        backdropFilter: 'blur(16px)',
                        border: '1px solid rgba(255, 255, 255, 0.35)',
                        boxShadow: 'inset 0 1px 1px rgba(255, 255, 255, 0.6)',
                    }}
                >
                    <span className="text-sm text-slate-500">📚 กำลังเปิด:</span>
                    <span
                        className={`font-semibold text-sm transition-colors duration-300 ${currentZone === "student" ? "text-emerald-600" : "text-violet-600"
                            }`}
                    >
                        {currentZone === "student" ? "คลังความรู้นักเรียน" : "คลังความรู้ครู"}
                    </span>
                </div>
            </div>
        </div>
    );
}

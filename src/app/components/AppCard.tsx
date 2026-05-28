"use client";

import Image from "next/image";
import { ExternalLink, Ban, BookOpen, Download } from "lucide-react";
import { SubjectCategory } from "@/lib/firestore";

export interface AppData {
    id: string;
    name: string;
    url: string;
    iconUrl: string;
    zone: "academic" | "budget" | "personnel" | "general" | "all";
    category?: SubjectCategory;
    color?: string;
    isEnabled?: boolean;
}

interface AppCardProps {
    app: AppData;
    priority?: boolean;
}

export default function AppCard({ app, priority = false }: AppCardProps) {
    const isEnabled = app.isEnabled !== false; // Default to true if undefined

    const handleClick = () => {
        if (!isEnabled) {
            alert("ข้อมูลสารสนเทศนี้ยังไม่เปิดให้บริการ");
            return;
        }
        window.open(app.url, "_blank", "noopener,noreferrer");
    };

    return (
        <button
            onClick={handleClick}
            className={`group flex flex-col items-center gap-3 p-2 outline-none focus:outline-none ${!isEnabled ? "cursor-not-allowed" : ""}`}
        >
            {/* App Icon Container */}
            <div className="relative">
                {/* Main icon container */}
                <div
                    className={`relative w-28 h-28 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-[24px] sm:rounded-[28px] overflow-hidden 
                        shadow-md shadow-black/10
                        transition-all duration-500 ease-out
                        ${isEnabled
                            ? "group-hover:scale-105 group-hover:shadow-xl group-hover:shadow-violet-500/20 group-active:scale-95"
                            : "opacity-60 bg-slate-200/50"
                        }`}
                >
                    {/* Icon image */}
                    <div className="absolute inset-0 flex items-center justify-center bg-transparent">
                        {app.iconUrl.startsWith("http") || app.iconUrl.startsWith("/") || app.iconUrl.startsWith("data:") ? (
                            <Image
                                src={app.iconUrl}
                                alt={app.name}
                                width={128}
                                height={128}
                                className={`w-full h-full object-cover ${!isEnabled ? "grayscale opacity-50" : ""} transition-transform duration-500 group-hover:scale-105`}
                                priority={priority}
                            />
                        ) : (
                            // Fallback gradient icon with book icon
                            <div
                                className={`w-full h-full flex items-center justify-center ${isEnabled
                                    ? "bg-gradient-to-br from-violet-400/90 to-emerald-500/90"
                                    : "bg-slate-400"
                                    }`}
                            >
                                <BookOpen className="w-10 h-10 text-white drop-shadow-lg" />
                            </div>
                        )}
                    </div>

                    {/* Disabled indicator */}
                    {!isEnabled && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/20 backdrop-blur-sm">
                            <div className="p-3 rounded-full bg-white/30 backdrop-blur-xl">
                                <Ban className="w-6 h-6 text-white/90" />
                            </div>
                        </div>
                    )}

                    {/* External link indicator - only for enabled apps */}
                    {isEnabled && (
                        <div className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-100 scale-75 bg-white/90 backdrop-blur-md shadow-sm border border-white/50">
                            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
                        </div>
                    )}
                </div>
            </div>

            {/* App Name with Liquid Glass background on hover */}
            <div className="relative">
                <span
                    className={`block text-sm sm:text-base font-medium text-center max-w-[110px] sm:max-w-[130px] leading-tight transition-all duration-300 ${isEnabled
                        ? "text-slate-700 group-hover:text-slate-900"
                        : "text-slate-400"
                        }`}
                    dangerouslySetInnerHTML={{ __html: app.name }}
                />
                {/* Subtle text glow on hover */}
                {isEnabled && (
                    <div
                        className="absolute inset-0 -z-10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        style={{
                            background: 'radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%)',
                            filter: 'blur(8px)',
                        }}
                    />
                )}
            </div>
        </button>
    );
}

"use client";

import { useEffect, useState } from "react";
import { BookOpen } from "lucide-react";
import AppCard, { AppData } from "./AppCard";

interface AppGridProps {
    apps: AppData[];
    emptyMessage?: string;
}

export default function AppGrid({
    apps,
    emptyMessage = "ไม่พบข้อมูลสารสนเทศ",
}: AppGridProps) {
    if (apps.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet-100 to-emerald-100 flex items-center justify-center mb-4">
                    <BookOpen className="w-10 h-10 text-violet-400" />
                </div>
                <p className="text-slate-500 text-center">{emptyMessage}</p>
                <p className="text-slate-400 text-sm mt-1">กรุณาตรวจสอบใหม่ภายหลัง</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            {/* Responsive grid layout - Mobile-first design */}
            {/* Adding key that changes based on content forces re-animation when switching zones */}
            {/* This mimics the behavior of a fresh load, similar to HONGSON-The-One but smoother */}
            <div
                key={apps.map(a => a.id).join(',')}
                className="grid gap-3 sm:gap-5 md:gap-6 justify-items-center
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          xl:grid-cols-6"
            >
                {apps.map((app, index) => (
                    <div
                        key={app.id}
                        className="animate-fade-in-up opacity-0"
                        style={{
                            animationDelay: `${index * 50}ms`,
                            animationFillMode: "forwards",
                        }}
                    >
                        <AppCard app={app} priority={index < 10} />
                    </div>
                ))}
            </div>

            {/* Resource count indicator */}
            <div className="mt-8 flex justify-center items-center gap-3 animate-fade-in delay-300">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50/50 backdrop-blur-sm border border-emerald-100/60 text-sm text-emerald-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    📚 {apps.filter(app => app.isEnabled !== false).length} ข้อมูลสารสนเทศพร้อมใช้งาน
                </span>

                {apps.filter(app => app.isEnabled === false).length > 0 && (
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50/50 backdrop-blur-sm border border-slate-100/60 text-sm text-slate-500">
                        <span className="w-2 h-2 rounded-full bg-slate-400" />
                        {apps.filter(app => app.isEnabled === false).length} ปิดชั่วคราว
                    </span>
                )}
            </div>
        </div>
    );
}

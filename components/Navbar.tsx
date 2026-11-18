"use client";

import React from "react";
import { ActiveTab } from "@/types";
import { HomeIcon, SproutIcon, MeasureIcon, BowlIcon, MemoIcon } from "./icons";

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  milestonePendingCount?: number;
}

export function Navbar({ activeTab, onTabChange, milestonePendingCount }: NavbarProps) {
  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: "beranda", label: "Beranda", icon: <HomeIcon className="w-5 h-5" /> },
    {
      id: "tumbuh",
      label: "Tumbuh",
      icon: <SproutIcon className="w-5 h-5" />,
      badge: milestonePendingCount && milestonePendingCount > 0 ? milestonePendingCount : undefined,
    },
    { id: "ukur", label: "Ukur", icon: <MeasureIcon className="w-5 h-5" /> },
    { id: "mpasi", label: "MPASI", icon: <BowlIcon className="w-5 h-5" /> },
    { id: "memo", label: "Memo", icon: <MemoIcon className="w-5 h-5" /> },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md border-t border-[#E5EBF1] bg-white/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-md shadow-[0_-4px_16px_rgba(38,55,70,0.04)]">
      <div className="grid grid-cols-5 gap-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`relative flex flex-col items-center justify-center py-1 transition-all rounded-xl ${
                isActive
                  ? "font-semibold text-[#476B8E]"
                  : "text-[#738397] hover:text-[#263746]"
              }`}
            >
              <div
                className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all ${
                  isActive ? "bg-[#EAF0F6] scale-105" : ""
                }`}
              >
                {item.icon}
                {item.badge ? (
                  <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#E8B85C] px-1 text-[9px] font-bold text-[#263746]">
                    {item.badge}
                  </span>
                ) : null}
              </div>
              <span className="mt-0.5 text-[11px] leading-tight tracking-tight">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

"use client";

import React from "react";
import { CaregiverProfile } from "@/types";
import { SettingsIcon } from "./icons";

interface HeaderProps {
  caregiver: CaregiverProfile;
  onOpenCaregiverModal: () => void;
  onOpenSettingsModal: () => void;
  onLogoClick?: () => void;
}

export function Header({
  caregiver,
  onOpenCaregiverModal,
  onOpenSettingsModal,
  onLogoClick,
}: HeaderProps) {
  const getInitial = (role: string) => {
    return role.charAt(0).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-[#E5EBF1] bg-[#F5F8FC]/90 px-5 py-3.5 backdrop-blur-md">
      <button
        onClick={onLogoClick}
        className="text-left text-2xl font-bold tracking-tight text-[#263746] hover:opacity-90 transition-opacity"
      >
        i<span className="text-[#476B8E]">growth</span>
      </button>

      <div className="flex items-center gap-2.5">
        <button
          onClick={onOpenCaregiverModal}
          title="Ganti Profil Pengasuh"
          className="flex items-center gap-1.5 rounded-full border border-[#DCE4EE] bg-[#EAF0F6] px-3 py-1.5 text-xs font-semibold text-[#476B8E] shadow-xs hover:bg-[#DFE7F0] transition-all"
        >
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#476B8E] text-[10px] font-bold text-white">
            {getInitial(caregiver.role)}
          </span>
          <span>{caregiver.role}</span>
        </button>

        <button
          onClick={onOpenSettingsModal}
          aria-label="Pengaturan"
          title="Pengaturan & Profil Anak"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E5EBF1] bg-white text-[#263746] shadow-xs hover:bg-[#F0F4F8] active:scale-95 transition-all"
        >
          <SettingsIcon className="w-4 h-4 text-[#476B8E]" />
        </button>
      </div>
    </header>
  );
}

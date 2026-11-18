"use client";

import React from "react";
import { MilestoneItem, MilestoneStatus } from "@/types";
import { CloseIcon, SproutIcon } from "../icons";

interface StimulationModalProps {
  milestone: MilestoneItem | null;
  currentStatus: MilestoneStatus;
  onClose: () => void;
  onUpdateStatus: (status: MilestoneStatus) => void;
}

export function StimulationModal({
  milestone,
  currentStatus,
  onClose,
  onUpdateStatus,
}: StimulationModalProps) {
  if (!milestone) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-[28px] sm:rounded-2xl bg-white text-[#263746] shadow-2xl p-5">
        <div className="flex items-center justify-between border-b border-[#E5EBF1] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF0F6] text-[#476B8E]">
              <SproutIcon className="w-4 h-4" />
            </span>
            <span className="text-xs font-bold text-[#476B8E] uppercase tracking-wider">
              {milestone.ageGroup} • {milestone.category.replace("_", " ")}
            </span>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#738397] hover:bg-[#F5F8FC]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-3 space-y-4 text-xs">
          <div>
            <h3 className="text-base font-bold text-[#263746] leading-tight">
              {milestone.title}
            </h3>
            <p className="mt-1.5 text-xs text-[#738397] leading-relaxed">
              {milestone.description}
            </p>
          </div>

          {/* Status Switcher Buttons */}
          <div>
            <p className="font-bold text-[11px] text-[#738397] uppercase tracking-wider mb-2">
              Status Kemampuan Si Kecil:
            </p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "not_yet", label: "Belum", bg: "hover:bg-slate-50", active: "border-slate-300 bg-slate-100 text-[#738397] font-bold" },
                { id: "learning", label: "Sedang Belajar", bg: "hover:bg-amber-50", active: "border-[#E8B85C] bg-[#FEF8EC] text-[#D49E35] font-bold" },
                { id: "achieved", label: "Sudah Bisa ✓", bg: "hover:bg-blue-50", active: "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] font-bold" },
              ].map((s) => (
                <button
                  key={s.id}
                  onClick={() => onUpdateStatus(s.id as MilestoneStatus)}
                  className={`py-2 px-2 rounded-xl border text-xs text-center transition-all ${
                    currentStatus === s.id
                      ? s.active
                      : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ide Stimulasi */}
          <div className="rounded-2xl border border-[#DCE4EE] bg-[#F5F8FC] p-4 space-y-1.5">
            <h4 className="font-bold text-xs text-[#476B8E] flex items-center gap-1.5">
              <span>💡</span> Ide Stimulasi Menyenangkan di Rumah:
            </h4>
            <p className="text-xs text-[#263746] leading-relaxed">
              {milestone.stimulationTips}
            </p>
          </div>

          <div className="rounded-xl bg-[#FEF8EC] p-3 border border-[#F8E5BF] text-[#8C651E] text-[11px] leading-relaxed">
            <strong>Tips Dokter:</strong> Setiap bayi berkembang dengan ritme uniknya masing-masing. Terus berikan stimulasi bermain dengan rasa kasih sayang tanpa memaksakan anak.
          </div>
        </div>
      </div>
    </div>
  );
}

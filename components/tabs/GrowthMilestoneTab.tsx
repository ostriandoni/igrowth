"use client";

import React, { useState } from "react";
import {
  ChildProfile,
  MilestoneCategory,
  MilestoneItem,
  MilestoneProgress,
  MilestoneStatus,
} from "@/types";
import { SproutIcon } from "../icons";

interface GrowthMilestoneTabProps {
  child: ChildProfile;
  milestones: MilestoneItem[];
  progress: MilestoneProgress[];
  onUpdateStatus: (milestoneId: string, status: MilestoneStatus) => void;
  onOpenStimulationModal: (milestone: MilestoneItem, currentStatus: MilestoneStatus) => void;
  initialAgeGroupFilter?: string;
}

const AGE_GROUPS = [
  { id: "0-3 bln", label: "0-3 Bulan", months: 3 },
  { id: "4-6 bln", label: "4-6 Bulan", months: 6 },
  { id: "7-9 bln", label: "7-9 Bulan", months: 9 },
  { id: "10-12 bln", label: "10-12 Bulan", months: 12 },
];

const CATEGORIES: { id: "all" | MilestoneCategory; label: string }[] = [
  { id: "all", label: "Semua Kategori" },
  { id: "motorik_kasar", label: "Motorik Kasar" },
  { id: "motorik_halus", label: "Motorik Halus" },
  { id: "komunikasi", label: "Bicara & Bahasa" },
  { id: "sosial_emosional", label: "Sosial-Emosional" },
  { id: "kognitif", label: "Kognitif" },
];

export function GrowthMilestoneTab({
  child,
  milestones,
  progress,
  onUpdateStatus,
  onOpenStimulationModal,
  initialAgeGroupFilter = "7-9 bln",
}: GrowthMilestoneTabProps) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState<string>(initialAgeGroupFilter);
  const [selectedCategory, setSelectedCategory] = useState<"all" | MilestoneCategory>("all");

  const filteredMilestones = milestones.filter((m) => {
    const matchAge = m.ageGroup === selectedAgeGroup;
    const matchCat = selectedCategory === "all" || m.category === selectedCategory;
    return matchAge && matchCat;
  });

  // Calculate stats for selected age group
  const groupMilestones = milestones.filter((m) => m.ageGroup === selectedAgeGroup);
  const groupAchievedCount = groupMilestones.filter((m) => {
    const p = progress.find((pr) => pr.childId === child.id && pr.milestoneId === m.id);
    return p?.status === "achieved";
  }).length;

  const groupLearningCount = groupMilestones.filter((m) => {
    const p = progress.find((pr) => pr.childId === child.id && pr.milestoneId === m.id);
    return p?.status === "learning";
  }).length;

  const percent =
    groupMilestones.length > 0
      ? Math.round((groupAchievedCount / groupMilestones.length) * 100)
      : 0;

  const getStatus = (milestoneId: string): MilestoneStatus => {
    const p = progress.find((pr) => pr.childId === child.id && pr.milestoneId === milestoneId);
    return p ? p.status : "not_yet";
  };

  const cycleStatus = (milestoneId: string) => {
    const current = getStatus(milestoneId);
    let next: MilestoneStatus = "learning";
    if (current === "not_yet") next = "learning";
    else if (current === "learning") next = "achieved";
    else next = "not_yet";
    onUpdateStatus(milestoneId, next);
  };

  return (
    <div className="space-y-4 px-5 pt-3 pb-8">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-[#263746]">Perkembangan & Milestone</h2>
        <p className="mt-0.5 text-xs text-[#738397]">
          Pantau pencapaian tumbuh kembang {child.nickname || child.name} sesuai tahapan usianya.
        </p>
      </div>

      {/* Age Group Selector Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {AGE_GROUPS.map((ag) => {
          const isSelected = selectedAgeGroup === ag.id;
          return (
            <button
              key={ag.id}
              onClick={() => setSelectedAgeGroup(ag.id)}
              className={`shrink-0 rounded-2xl px-3.5 py-2 text-xs font-bold transition-all ${
                isSelected
                  ? "bg-[#476B8E] text-white shadow-xs"
                  : "bg-white border border-[#E5EBF1] text-[#738397] hover:bg-[#F5F8FC]"
              }`}
            >
              {ag.label}
            </button>
          );
        })}
      </div>

      {/* Group Progress Summary Banner */}
      <div className="rounded-2xl border border-[#DCE4EE] bg-[#EAF0F6] p-4 text-[#476B8E]">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#476B8E]">
              Progres {selectedAgeGroup}
            </span>
            <p className="mt-0.5 text-lg font-extrabold text-[#263746]">
              {groupAchievedCount} dari {groupMilestones.length} Tercapai ({percent}%)
            </p>
          </div>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-base font-extrabold text-[#476B8E] border border-[#DCE4EE] shadow-2xs">
            {percent}%
          </span>
        </div>

        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/70 border border-[#DCE4EE]">
          <div
            className="h-full rounded-full bg-[#E8B85C] transition-all duration-300"
            style={{ width: `${percent}%` }}
          />
        </div>

        <div className="mt-2.5 flex items-center gap-4 text-[11px] font-semibold text-[#738397]">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#476B8E]" />
            {groupAchievedCount} Sudah Bisa
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#E8B85C]" />
            {groupLearningCount} Sedang Belajar
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#CBD5E1]" />
            {groupMilestones.length - groupAchievedCount - groupLearningCount} Belum
          </span>
        </div>
      </div>

      {/* Category Filter Chips */}
      <div>
        <p className="text-[11px] font-bold text-[#738397] uppercase tracking-wider mb-2">
          Filter Aspek Perkembangan:
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`rounded-xl px-2.5 py-1.5 text-[11px] font-semibold transition-all ${
                selectedCategory === cat.id
                  ? "bg-[#476B8E] text-white"
                  : "bg-white border border-[#E5EBF1] text-[#738397] hover:bg-[#F5F8FC]"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Milestone List */}
      <div className="space-y-3 pt-1">
        {filteredMilestones.map((item) => {
          const status = getStatus(item.id);
          const isAchieved = status === "achieved";
          const isLearning = status === "learning";

          return (
            <div
              key={item.id}
              className={`rounded-2xl border p-4 transition-all ${
                isAchieved
                  ? "border-[#D3E0EE] bg-[#F4F8FD]"
                  : isLearning
                  ? "border-[#F8E5BF] bg-[#FFFBF3]"
                  : "border-[#E5EBF1] bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Clickable Status Icon */}
                <button
                  type="button"
                  onClick={() => cycleStatus(item.id)}
                  title="Klik untuk ubah status: Belum -> Sedang Belajar -> Sudah Bisa"
                  className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-xl border transition-all ${
                    isAchieved
                      ? "border-[#476B8E] bg-[#476B8E] text-white shadow-2xs"
                      : isLearning
                      ? "border-[#E8B85C] bg-[#FEF8EC] text-[#D49E35] font-bold text-xs"
                      : "border-[#D6E0EC] bg-white text-transparent hover:border-[#476B8E]"
                  }`}
                >
                  {isAchieved ? "✓" : isLearning ? "●" : ""}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="rounded-md bg-[#EAF0F6] px-2 py-0.5 text-[10px] font-bold text-[#476B8E] uppercase tracking-wider">
                      {item.category.replace("_", " ")}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isAchieved
                          ? "bg-[#EAF0F6] text-[#476B8E]"
                          : isLearning
                          ? "bg-[#FEF8EC] text-[#D49E35]"
                          : "bg-slate-100 text-[#738397]"
                      }`}
                    >
                      {isAchieved
                        ? "Sudah Bisa"
                        : isLearning
                        ? "Sedang Belajar"
                        : "Belum Terlihat"}
                    </span>
                  </div>

                  <h3
                    className={`text-sm font-bold ${
                      isAchieved ? "text-[#263746]" : "text-[#263746]"
                    }`}
                  >
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#738397] leading-relaxed">
                    {item.description}
                  </p>

                  <div className="mt-3 flex items-center justify-between border-t border-[#E5EBF1] pt-2.5">
                    <button
                      onClick={() => onOpenStimulationModal(item, status)}
                      className="flex items-center gap-1 text-xs font-bold text-[#476B8E] hover:underline"
                    >
                      <span>💡</span>
                      <span>Ide Stimulasi & Tips</span>
                    </button>

                    <button
                      onClick={() => cycleStatus(item.id)}
                      className="text-[11px] font-semibold text-[#738397] hover:text-[#476B8E]"
                    >
                      Ubah Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Red Flags / Tanda Bahaya Box */}
      <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50/70 p-4 text-rose-950">
        <div className="flex items-center gap-2">
          <span className="text-lg">⚠️</span>
          <h4 className="font-bold text-xs uppercase tracking-wider text-rose-800">
            Tanda Bahaya (Red Flags) Usia {selectedAgeGroup}
          </h4>
        </div>
        <p className="mt-1.5 text-xs leading-relaxed text-rose-900/90">
          Segera konsultasikan ke Dokter Spesialis Anak (DSA) jika si kecil:
        </p>
        <ul className="mt-2 space-y-1 text-xs text-rose-900/85 list-disc pl-4">
          <li>Belum bisa duduk seimbang sendiri hingga usia 9 bulan lewat</li>
          <li>Tidak menoleh atau tidak merespons ketika namanya dipanggil</li>
          <li>Tidak ada kontak mata dan tidak pernah mengoceh (babbling)</li>
          <li>Kaki atau tangan tampak kaku atau sebaliknya sangat lemas terkulai</li>
        </ul>
      </div>
    </div>
  );
}

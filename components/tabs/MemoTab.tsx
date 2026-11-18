"use client";

import React, { useState } from "react";
import { ActivityLog, ActivityType, ChildProfile, VaccineScheduleItem } from "@/types";
import {
  PlusIcon,
  TrashIcon,
  MilkIcon,
  SleepIcon,
  DiaperIcon,
  VaccineIcon,
  SparklesIcon,
} from "../icons";

interface MemoTabProps {
  child: ChildProfile;
  activities: ActivityLog[];
  vaccines: VaccineScheduleItem[];
  onOpenRecordActivity: (type?: ActivityType) => void;
  onToggleVaccine: (vaccineId: string) => void;
  onDeleteActivity: (id: string) => void;
}

export function MemoTab({
  child,
  activities,
  vaccines,
  onOpenRecordActivity,
  onToggleVaccine,
  onDeleteActivity,
}: MemoTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"timeline" | "vaccines">("timeline");
  const [filterType, setFilterType] = useState<"all" | ActivityType>("all");

  const sortedActivities = [...activities].sort(
    (a, b) => new Date(`${b.date}T${b.time}`).getTime() - new Date(`${a.date}T${a.time}`).getTime()
  );

  const filteredActivities = sortedActivities.filter((a) => {
    if (filterType === "all") return true;
    return a.type === filterType;
  });

  const completedVaccinesCount = vaccines.filter((v) => v.completed).length;

  const getActivityIcon = (type: ActivityType) => {
    switch (type) {
      case "milk":
        return <MilkIcon className="w-4 h-4 text-[#3478d1]" />;
      case "sleep":
        return <SleepIcon className="w-4 h-4 text-[#8e45b8]" />;
      case "diaper":
        return <DiaperIcon className="w-4 h-4 text-[#b38520]" />;
      case "vaccine":
        return <VaccineIcon className="w-4 h-4 text-[#285e4b]" />;
      case "moment":
        return <SparklesIcon className="w-4 h-4 text-[#c97b5b]" />;
    }
  };

  const getActivityBg = (type: ActivityType) => {
    switch (type) {
      case "milk":
        return "bg-[#ebf3ff] border-[#cce0fd]";
      case "sleep":
        return "bg-[#f5ecfc] border-[#e7ccf7]";
      case "diaper":
        return "bg-[#fff6e3] border-[#fae2b1]";
      case "vaccine":
        return "bg-[#eaf4e7] border-[#c8dec3]";
      case "moment":
        return "bg-[#fcedea] border-[#f5cfc7]";
    }
  };

  return (
    <div className="space-y-4 px-5 pt-3 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#263746]">Memo & Jurnal Anak</h2>
          <p className="mt-0.5 text-xs text-[#738397]">Catatan harian, imunisasi, & momen emas</p>
        </div>
        <button
          onClick={() => onOpenRecordActivity()}
          className="flex items-center gap-1 rounded-full bg-[#476B8E] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#37536F] active:scale-95 transition-all"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Catat Log</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-2 gap-1 rounded-2xl bg-[#EAF0F6] p-1 text-xs font-bold text-[#738397]">
        <button
          onClick={() => setActiveSubTab("timeline")}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === "timeline"
              ? "bg-white text-[#476B8E] shadow-2xs"
              : "hover:text-[#263746]"
          }`}
        >
          Timeline Harian ({activities.length})
        </button>
        <button
          onClick={() => setActiveSubTab("vaccines")}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === "vaccines"
              ? "bg-white text-[#476B8E] shadow-2xs"
              : "hover:text-[#263746]"
          }`}
        >
          Imunisasi IDAI ({completedVaccinesCount}/{vaccines.length})
        </button>
      </div>

      {/* SUBTAB: TIMELINE AKTIVITAS */}
      {activeSubTab === "timeline" && (
        <div className="space-y-3">
          {/* Filter Chips */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {[
              { id: "all", label: "Semua" },
              { id: "milk", label: "Susu" },
              { id: "sleep", label: "Tidur" },
              { id: "diaper", label: "Popok" },
              { id: "vaccine", label: "Vaksin" },
              { id: "moment", label: "Momen" },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id as "all" | ActivityType)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
                  filterType === f.id
                    ? "bg-[#476B8E] text-white"
                    : "bg-white border border-[#E5EBF1] text-[#738397]"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {filteredActivities.length === 0 ? (
            <div className="rounded-2xl border border-[#E5EBF1] bg-white p-6 text-center text-xs text-[#738397]">
              <p>Belum ada catatan aktivitas pada kategori ini.</p>
              <button
                onClick={() => onOpenRecordActivity()}
                className="mt-2 text-xs font-bold text-[#476B8E] underline"
              >
                + Tambah aktivitas sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredActivities.map((act) => (
                <div
                  key={act.id}
                  className="flex items-start gap-3 rounded-2xl border border-[#E5EBF1] bg-white p-3.5 shadow-2xs"
                >
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border ${getActivityBg(
                      act.type
                    )}`}
                  >
                    {getActivityIcon(act.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-[#263746]">{act.title}</h4>
                      <span className="text-[10px] text-[#738397]">
                        {act.date} • {act.time}
                      </span>
                    </div>

                    {/* Specific Details */}
                    {act.details.durationMinutes && (
                      <p className="mt-0.5 text-[11px] text-[#738397]">
                        Durasi: {act.details.durationMinutes} menit
                      </p>
                    )}
                    {act.details.amountMl && (
                      <p className="mt-0.5 text-[11px] text-[#526350]">
                        Jumlah: {act.details.amountMl} ml
                      </p>
                    )}
                    {act.details.stoolColor && (
                      <p className="mt-0.5 text-[11px] text-[#526350]">
                        Feses: {act.details.stoolColor} (Konsistensi: {act.details.stoolConsistency})
                      </p>
                    )}
                    {act.details.wakeTime && (
                      <p className="mt-0.5 text-[11px] text-[#526350]">
                        Bangun tidur: {act.details.wakeTime}
                      </p>
                    )}
                    {act.details.story && (
                      <p className="mt-1 text-xs text-[#4c5c49] italic bg-[#fbfdf9] p-2 rounded-lg border border-[#eaf0e6]">
                        "{act.details.story}"
                      </p>
                    )}
                    {act.notes && (
                      <p className="mt-1 text-[11px] text-[#71826f]">Catatan: {act.notes}</p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      if (confirm("Hapus catatan ini?")) onDeleteActivity(act.id);
                    }}
                    className="p-1 text-[#8c9c8a] hover:text-red-600"
                  >
                    <TrashIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: VAKSINASI IDAI */}
      {activeSubTab === "vaccines" && (
        <div className="space-y-3">
          <div className="rounded-2xl border border-[#DCE4EE] bg-[#EAF0F6] p-3 text-xs text-[#476B8E]">
            <div className="flex items-center justify-between font-bold text-[#263746]">
              <span>Progres Imunisasi IDAI</span>
              <span>
                {completedVaccinesCount} dari {vaccines.length} Vaksin
              </span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/70">
              <div
                className="h-full rounded-full bg-[#476B8E] transition-all"
                style={{
                  width: `${Math.round((completedVaccinesCount / vaccines.length) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="space-y-2.5">
            {vaccines.map((vac) => (
              <div
                key={vac.id}
                onClick={() => onToggleVaccine(vac.id)}
                className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition-all ${
                  vac.completed
                    ? "border-[#D3E0EE] bg-[#F4F8FD]"
                    : "border-[#E5EBF1] bg-white hover:bg-[#F8FAFD]"
                }`}
              >
                <div
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border ${
                    vac.completed
                      ? "border-[#476B8E] bg-[#476B8E] text-white"
                      : "border-[#CBD5E1] bg-white text-transparent"
                  }`}
                >
                  ✓
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4
                      className={`text-xs font-bold ${
                        vac.completed ? "text-[#476B8E]" : "text-[#263746]"
                      }`}
                    >
                      {vac.name}
                    </h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        vac.completed
                          ? "bg-[#EAF0F6] text-[#476B8E]"
                          : vac.isMandatory
                          ? "bg-[#FEF8EC] text-[#D49E35]"
                          : "bg-slate-100 text-[#738397]"
                      }`}
                    >
                      {vac.completed ? "Sudah Vaksin" : vac.isMandatory ? "Wajib" : "Pilihan"}
                    </span>
                  </div>

                  <p className="mt-1 text-[11px] text-[#738397] leading-relaxed">
                    {vac.description}
                  </p>

                  {vac.completedDate && (
                    <p className="mt-1 text-[10px] text-[#476B8E] font-semibold">
                      Tanggal vaksin: {vac.completedDate}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

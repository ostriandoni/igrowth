"use client";

import React, { useState, useEffect } from "react";
import {
  ActivityLog,
  ChildProfile,
  GrowthRecord,
  MealRecord,
  MilestoneItem,
  MilestoneProgress,
} from "@/types";
import { calculateAge, formatIndonesianDate, DEFAULT_CURRENT_DATE } from "@/lib/storage";
import { assessGrowth } from "@/lib/whoData";
import { PlusIcon, MilkIcon, SleepIcon, DiaperIcon, BowlIcon, MeasureIcon } from "../icons";

interface HomeTabProps {
  child: ChildProfile;
  growthRecords: GrowthRecord[];
  milestones: MilestoneItem[];
  milestoneProgress: MilestoneProgress[];
  activities: ActivityLog[];
  meals: MealRecord[];
  onNavigateToTab: (tab: "tumbuh" | "ukur" | "mpasi" | "memo", filterAgeGroup?: string) => void;
  onOpenRecordGrowth: () => void;
  onOpenRecordActivity: (type: "milk" | "sleep" | "diaper" | "vaccine" | "moment") => void;
  onOpenRecordMeal: () => void;
}

export function HomeTab({
  child,
  growthRecords,
  milestones,
  milestoneProgress,
  activities,
  meals,
  onNavigateToTab,
  onOpenRecordGrowth,
  onOpenRecordActivity,
  onOpenRecordMeal,
}: HomeTabProps) {
  const [currentDateIso, setCurrentDateIso] = useState<string>(DEFAULT_CURRENT_DATE);

  useEffect(() => {
    setCurrentDateIso(new Date().toISOString().split("T")[0]);
  }, []);

  const age = calculateAge(child.birthDate, currentDateIso);
  const todayFormatted = formatIndonesianDate(currentDateIso);

  // Milestone statistics for 9 months & 6 months
  const milestones9 = milestones.filter((m) => m.ageGroupMonths === 9);
  const achieved9Count = milestones9.filter((m) => {
    const p = milestoneProgress.find(
      (prog) => prog.childId === child.id && prog.milestoneId === m.id
    );
    return p?.status === "achieved";
  }).length;

  const milestones6 = milestones.filter((m) => m.ageGroupMonths === 6);
  const achieved6Count = milestones6.filter((m) => {
    const p = milestoneProgress.find(
      (prog) => prog.childId === child.id && prog.milestoneId === m.id
    );
    return p?.status === "achieved";
  }).length;

  // Latest Growth Record
  const latestGrowth =
    growthRecords.length > 0
      ? [...growthRecords].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0]
      : null;

  const growthAssessment = latestGrowth
    ? assessGrowth(
        latestGrowth.ageMonths,
        latestGrowth.weight,
        latestGrowth.height,
        latestGrowth.headCircumference
      )
    : null;

  // Calculate percentage toward next target
  const prevTargetMonths = age.nextTargetAgeMonths === 9 ? 6 : 0;
  const currentSpan = Math.max(1, age.nextTargetAgeMonths - prevTargetMonths);
  const currentMonthsInSpan = Math.max(0, age.totalMonths - prevTargetMonths) + age.days / 30;
  const progressPercent = Math.min(100, Math.max(10, Math.round((currentMonthsInSpan / currentSpan) * 100)));

  // Today activities
  const todayActivities = activities.filter((a) => a.date === currentDateIso);
  const todayMeals = meals.filter((m) => m.date === currentDateIso);

  const totalMilkMl = todayActivities
    .filter((a) => a.type === "milk" && a.details.amountMl)
    .reduce((sum, a) => sum + (a.details.amountMl || 0), 0);

  const milkCount = todayActivities.filter((a) => a.type === "milk").length;
  const diaperCount = todayActivities.filter((a) => a.type === "diaper").length;

  return (
    <div className="space-y-4">
      {/* Date & Greeting */}
      <section className="px-5 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#738397]">
          {todayFormatted}
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#263746]">
          Hai, {child.nickname || child.name}.
        </h1>

        {/* Hero Age Card */}
        <div className="mt-3.5 rounded-[26px] bg-[#476B8E] p-5 text-white shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 rounded-full bg-white/5 pointer-events-none" />
          <p className="text-xs font-medium text-white/75">Usia hari ini</p>
          <p className="mt-1 text-4xl font-bold tracking-tight">
            {age.months} <span className="text-xl font-normal text-white/85">bulan</span>{" "}
            {age.days} <span className="text-xl font-normal text-white/85">hari</span>
          </p>
          <p className="mt-2 text-xs text-white/75">
            Lahir {child.birthDate} • {child.gender === "female" ? "Perempuan 👧" : "Laki-laki 👦"}
          </p>

          <div className="mt-5 flex justify-between text-xs font-medium text-white/85">
            <span>Menuju usia {age.nextTargetAgeMonths} bulan</span>
            <span>{age.daysUntilNextTarget} hari lagi</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
            <div
              className="h-full rounded-full bg-[#E8B85C] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </section>

      {/* Quick Action Shortcuts */}
      <section className="px-5 pt-1">
        <p className="text-xs font-bold text-[#738397] uppercase tracking-wider mb-2.5">
          Catat Cepat
        </p>
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={onOpenRecordGrowth}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5EBF1] bg-white p-2.5 text-center shadow-2xs hover:bg-[#F5F8FC] active:scale-95 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF0F6] text-[#476B8E]">
              <MeasureIcon className="w-4 h-4" />
            </div>
            <span className="mt-1.5 text-[10px] font-semibold text-[#263746]">Ukur</span>
          </button>

          <button
            onClick={onOpenRecordMeal}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5EBF1] bg-white p-2.5 text-center shadow-2xs hover:bg-[#FEF9F0] active:scale-95 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FEF8EC] text-[#D49E35]">
              <BowlIcon className="w-4 h-4" />
            </div>
            <span className="mt-1.5 text-[10px] font-semibold text-[#263746]">Makan</span>
          </button>

          <button
            onClick={() => onOpenRecordActivity("milk")}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5EBF1] bg-white p-2.5 text-center shadow-2xs hover:bg-[#F5F8FC] active:scale-95 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF0F6] text-[#476B8E]">
              <MilkIcon className="w-4 h-4" />
            </div>
            <span className="mt-1.5 text-[10px] font-semibold text-[#263746]">Susu</span>
          </button>

          <button
            onClick={() => onOpenRecordActivity("sleep")}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5EBF1] bg-white p-2.5 text-center shadow-2xs hover:bg-[#FAF8FE] active:scale-95 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#F0ECF8] text-[#6B5A96]">
              <SleepIcon className="w-4 h-4" />
            </div>
            <span className="mt-1.5 text-[10px] font-semibold text-[#263746]">Tidur</span>
          </button>

          <button
            onClick={() => onOpenRecordActivity("diaper")}
            className="flex flex-col items-center justify-center rounded-2xl border border-[#E5EBF1] bg-white p-2.5 text-center shadow-2xs hover:bg-[#FEF9F0] active:scale-95 transition-all"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEF8EC] text-[#D49E35]">
              <DiaperIcon className="w-4 h-4" />
            </div>
            <span className="mt-1.5 text-[10px] font-semibold text-[#263746]">Popok</span>
          </button>
        </div>
      </section>

      {/* Checklist Milestone Card */}
      <section className="px-5">
        <button
          onClick={() => onNavigateToTab("tumbuh", "7-9 bln")}
          className="flex w-full items-center gap-3 rounded-2xl border border-[#E5EBF1] bg-white p-4 text-left shadow-2xs hover:border-[#476B8E]/40 hover:bg-[#F8FAFD] active:scale-[0.99] transition-all"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF0F6] text-sm font-bold text-[#476B8E] border border-[#D6E0EC]">
            {achieved9Count}/{milestones9.length || 10}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold text-[#263746]">
              Checklist 9 Bulan
            </span>
            <span className="mt-0.5 block text-xs text-[#738397]">
              {achieved9Count} dari {milestones9.length || 10} kemampuan sudah terlihat
            </span>
            <span className="mt-1 block text-xs font-semibold text-[#D49E35]">
              Checklist 6 bulan: {achieved6Count}/{milestones6.length || 7} tuntas
            </span>
          </span>
          <span className="text-xl text-[#738397]">›</span>
        </button>
      </section>

      {/* Pertumbuhan Section */}
      <section className="px-5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#263746]">Pertumbuhan Terakhir</h2>
          <button
            onClick={onOpenRecordGrowth}
            className="flex items-center gap-1 text-xs font-bold text-[#476B8E] hover:underline"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Catat ukur</span>
          </button>
        </div>

        {latestGrowth ? (
          <div
            onClick={() => onNavigateToTab("ukur")}
            className="mt-2.5 rounded-2xl border border-[#E5EBF1] bg-[#F0F5FA] p-4 cursor-pointer hover:border-[#476B8E]/50 transition-all shadow-2xs"
          >
            <div className="flex items-center justify-between border-b border-[#DCE6F0] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white text-sm font-bold text-[#476B8E]">
                  ↗
                </span>
                <span className="text-xs font-bold text-[#476B8E]">
                  Diukur: {latestGrowth.date} ({latestGrowth.ageMonths} bln {latestGrowth.ageDays} hr)
                </span>
              </div>
              {growthAssessment && (
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-[#476B8E] border border-[#D6E2EE]">
                  {growthAssessment.weightForAge.status}
                </span>
              )}
            </div>

            <div className="grid grid-cols-3 gap-2 pt-3 text-center">
              <div className="rounded-xl bg-white p-2 border border-[#E5EBF1]">
                <span className="text-[10px] text-[#738397] block">Berat Badan</span>
                <span className="text-base font-extrabold text-[#263746]">
                  {latestGrowth.weight}{" "}
                  <span className="text-xs font-normal text-[#738397]">kg</span>
                </span>
              </div>
              <div className="rounded-xl bg-white p-2 border border-[#E5EBF1]">
                <span className="text-[10px] text-[#738397] block">Panjang/Tinggi</span>
                <span className="text-base font-extrabold text-[#263746]">
                  {latestGrowth.height}{" "}
                  <span className="text-xs font-normal text-[#738397]">cm</span>
                </span>
              </div>
              <div className="rounded-xl bg-white p-2 border border-[#E5EBF1]">
                <span className="text-[10px] text-[#738397] block">L. Kepala</span>
                <span className="text-base font-extrabold text-[#263746]">
                  {latestGrowth.headCircumference}{" "}
                  <span className="text-xs font-normal text-[#738397]">cm</span>
                </span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-[#476B8E]">
              <span>Lihat kurva WHO & grafik lengkap</span>
              <span className="font-bold">Buka Grafik ›</span>
            </div>
          </div>
        ) : (
          <div
            onClick={onOpenRecordGrowth}
            className="mt-2.5 flex items-start gap-3 rounded-2xl border border-[#E5EBF1] bg-[#F0F5FA] p-4 cursor-pointer hover:bg-[#EAF0F6] transition-all"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#476B8E]">
              ↗
            </span>
            <div>
              <p className="text-sm font-semibold text-[#263746]">Belum ada pengukuran</p>
              <p className="mt-1 text-xs leading-relaxed text-[#738397]">
                Catat berat badan pertama supaya grafiknya mulai terbentuk.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* Rangkuman Aktivitas Hari Ini */}
      <section className="px-5 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-[#263746]">Aktivitas Hari Ini</h2>
          <button
            onClick={() => onNavigateToTab("memo")}
            className="text-xs font-semibold text-[#476B8E] hover:underline"
          >
            Lihat semua
          </button>
        </div>

        <div className="mt-2.5 grid grid-cols-3 gap-2">
          <div className="rounded-2xl border border-[#E5EBF1] bg-white p-3 text-center">
            <span className="text-xs block text-[#738397]">Susu</span>
            <span className="text-base font-bold text-[#476B8E]">
              {milkCount}{" "}
              <span className="text-xs font-normal text-[#738397]">kali</span>
            </span>
            {totalMilkMl > 0 && (
              <span className="block text-[10px] text-[#738397]">{totalMilkMl} ml</span>
            )}
          </div>
          <div className="rounded-2xl border border-[#E5EBF1] bg-white p-3 text-center">
            <span className="text-xs block text-[#738397]">MPASI</span>
            <span className="text-base font-bold text-[#D49E35]">
              {todayMeals.length}{" "}
              <span className="text-xs font-normal text-[#738397]">sesi</span>
            </span>
            <span className="block text-[10px] text-[#738397]">menu lengkap</span>
          </div>
          <div className="rounded-2xl border border-[#E5EBF1] bg-white p-3 text-center">
            <span className="text-xs block text-[#738397]">Popok</span>
            <span className="text-base font-bold text-[#263746]">
              {diaperCount}{" "}
              <span className="text-xs font-normal text-[#738397]">kali</span>
            </span>
            <span className="block text-[10px] text-[#738397]">bersih</span>
          </div>
        </div>
      </section>

      {/* Rekomendasi Stimulasi Sesuai Usia */}
      <section className="px-5 pt-2 pb-6">
        <div className="rounded-2xl border border-[#F5E6CA] bg-[#FFF9F0] p-4 text-[#825A13]">
          <div className="flex items-center gap-2">
            <span className="text-lg">⭐</span>
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#9E6F18]">
              Fokus Stimulasi Usia 7-9 Bulan
            </h3>
          </div>
          <p className="mt-1.5 text-xs leading-relaxed text-[#825A13]/90">
            Latih duduk mandiri di karpet, letakkan mainan di luar jangkauan agar memancing bayi merangkak, dan ajak bermain cilukba untuk melatih daya ingat objek (object permanence).
          </p>
        </div>
      </section>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { ChildProfile, FoodAllergyTest, MealRecord, MpasiRecipe } from "@/types";
import { PlusIcon, BowlIcon, TrashIcon } from "../icons";
import { DEFAULT_CURRENT_DATE } from "@/lib/storage";

interface MpasiTabProps {
  child: ChildProfile;
  meals: MealRecord[];
  allergies: FoodAllergyTest[];
  recipes: MpasiRecipe[];
  onOpenRecordMeal: () => void;
  onOpenFoodAllergyModal: () => void;
  onOpenRecipeDetail: (recipe: MpasiRecipe) => void;
  onDeleteMeal: (id: string) => void;
  onDeleteAllergy: (id: string) => void;
}

const AGE_GUIDES = [
  {
    range: "6 Bulan",
    texture: "Bubur saring kental (Puree halus)",
    frequency: "2-3x makan utama + 1-2x ASI/Susu",
    portion: "2-3 sendok makan bertahap hingga 1/2 mangkuk (125ml)",
    tips: "Mulai dengan menu lengkap mengandung protein hewani (bukan hanya buah/sayur).",
  },
  {
    range: "7 - 8 Bulan",
    texture: "Bubur lumat disaring kasar / cincang halus (Mashed)",
    frequency: "2-3x makan utama + 1-2x selingan",
    portion: "1/2 mangkuk ukuran 250ml per makan",
    tips: "Mulai kenalkan tekstur sedikit berbulir untuk melatih oromotor dan otot rahang.",
  },
  {
    range: "9 - 11 Bulan",
    texture: "Nasi tim cincang kasar / Finger food lembut",
    frequency: "3-4x makan utama + 1-2x selingan",
    portion: "1/2 s/d 3/4 mangkuk ukuran 250ml",
    tips: "Latih menjepit makanan (pincer grasp) dengan stik sayur kukus atau potongan telur.",
  },
  {
    range: "12+ Bulan",
    texture: "Makanan keluarga (Menu meja keluarga)",
    frequency: "3x makan utama + 2x selingan padat",
    portion: "3/4 s/d 1 mangkuk ukuran 250ml",
    tips: "Bisa mengonsumsi menu yang sama dengan keluarga, batasi garam dan gula berlebih.",
  },
];

export function MpasiTab({
  child,
  meals,
  allergies,
  recipes,
  onOpenRecordMeal,
  onOpenFoodAllergyModal,
  onOpenRecipeDetail,
  onDeleteMeal,
  onDeleteAllergy,
}: MpasiTabProps) {
  const [activeSubTab, setActiveSubTab] = useState<"tracker" | "recipes" | "guide" | "allergies">(
    "tracker"
  );
  const [recipeFilter, setRecipeFilter] = useState<"all" | "iron" | "finger">("all");
  const [todayIso, setTodayIso] = useState<string>(DEFAULT_CURRENT_DATE);

  useEffect(() => {
    setTodayIso(new Date().toISOString().split("T")[0]);
  }, []);

  const todayMeals = meals.filter((m) => m.date === todayIso);
  const otherMeals = meals.filter((m) => m.date !== todayIso);

  const filteredRecipes = recipes.filter((r) => {
    if (recipeFilter === "iron") return r.ironRich;
    if (recipeFilter === "finger") return r.title.toLowerCase().includes("finger");
    return true;
  });

  return (
    <div className="space-y-4 px-5 pt-3 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#263746]">MPASI & Nutrisi</h2>
          <p className="mt-0.5 text-xs text-[#738397]">
            Panduan menu 4 bintang, jadwal makan, & pencegahan alergi
          </p>
        </div>
        <button
          onClick={onOpenRecordMeal}
          className="flex items-center gap-1 rounded-full bg-[#476B8E] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#37536F] active:scale-95 transition-all"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Catat Makan</span>
        </button>
      </div>

      {/* Sub Tabs */}
      <div className="grid grid-cols-4 gap-1 rounded-2xl bg-[#EAF0F6] p-1 text-xs font-bold text-[#738397]">
        <button
          onClick={() => setActiveSubTab("tracker")}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === "tracker"
              ? "bg-white text-[#476B8E] shadow-2xs"
              : "hover:text-[#263746]"
          }`}
        >
          Jadwal ({todayMeals.length})
        </button>
        <button
          onClick={() => setActiveSubTab("recipes")}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === "recipes"
              ? "bg-white text-[#476B8E] shadow-2xs"
              : "hover:text-[#263746]"
          }`}
        >
          Resep ({recipes.length})
        </button>
        <button
          onClick={() => setActiveSubTab("allergies")}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === "allergies"
              ? "bg-white text-[#476B8E] shadow-2xs"
              : "hover:text-[#263746]"
          }`}
        >
          Alergi ({allergies.length})
        </button>
        <button
          onClick={() => setActiveSubTab("guide")}
          className={`py-2 rounded-xl transition-all ${
            activeSubTab === "guide"
              ? "bg-white text-[#476B8E] shadow-2xs"
              : "hover:text-[#263746]"
          }`}
        >
          Tekstur
        </button>
      </div>

      {/* SUBTAB: TRACKER MAKAN */}
      {activeSubTab === "tracker" && (
        <div className="space-y-4">
          {/* Today Meals Card */}
          <div className="rounded-2xl border border-[#e2e8dc] bg-white p-4 shadow-2xs">
            <div className="flex items-center justify-between mb-3 border-b border-[#f0f3ec] pb-2">
              <span className="font-bold text-xs uppercase tracking-wider text-[#285e4b]">
                Makan Hari Ini ({todayMeals.length} sesi)
              </span>
              <button
                onClick={onOpenRecordMeal}
                className="text-xs font-bold text-[#c97b5b] hover:underline"
              >
                + Tambah
              </button>
            </div>

            {todayMeals.length === 0 ? (
              <div className="py-6 text-center text-xs text-[#758075]">
                <p>Belum ada jadwal makan dicatat hari ini.</p>
                <button
                  onClick={onOpenRecordMeal}
                  className="mt-2 text-xs font-bold text-[#c97b5b] underline"
                >
                  Catat makanan si kecil sekarang
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {todayMeals.map((meal) => (
                  <div
                    key={meal.id}
                    className="flex items-start justify-between rounded-xl border border-[#edf1e8] bg-[#fbfcf9] p-3"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-[#c97b5b] uppercase">
                          {meal.mealTime.replace("_", " ")}
                        </span>
                        <span className="text-[11px] text-[#788876]">({meal.time})</span>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                            meal.amountEaten === "habis"
                              ? "bg-green-100 text-green-800"
                              : meal.amountEaten === "gtm"
                              ? "bg-red-100 text-red-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {meal.amountEaten.replace("_", " ")}
                        </span>
                      </div>
                      <h4 className="mt-1 font-bold text-xs text-[#243c32]">{meal.menuName}</h4>
                      {meal.protein && (
                        <p className="mt-0.5 text-[11px] text-[#637561]">
                          Prohe: {meal.protein} {meal.carbs ? `• Karbo: ${meal.carbs}` : ""}
                        </p>
                      )}
                      {meal.notes && (
                        <p className="mt-1 text-[11px] text-[#869683] italic">"{meal.notes}"</p>
                      )}
                    </div>
                    <button
                      onClick={() => {
                        if (confirm("Hapus catatan makan ini?")) onDeleteMeal(meal.id);
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

          {/* Previous Meals History */}
          {otherMeals.length > 0 && (
            <div className="rounded-2xl border border-[#e2e8dc] bg-white p-4 shadow-2xs">
              <span className="font-bold text-xs uppercase tracking-wider text-[#758075] block mb-2">
                Riwayat Makan Sebelumnya
              </span>
              <div className="divide-y divide-[#eef2ea]">
                {otherMeals.map((m) => (
                  <div key={m.id} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-[#243c32]">
                        {m.menuName}{" "}
                        <span className="text-[11px] font-normal text-[#758075]">
                          ({m.date} • {m.mealTime.replace("_", " ")})
                        </span>
                      </p>
                      <p className="text-[11px] text-[#637561]">Habis: {m.amountEaten}</p>
                    </div>
                    <button
                      onClick={() => onDeleteMeal(m.id)}
                      className="text-[#8c9c8a] hover:text-red-600 p-1"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* SUBTAB: RESEP MPASI */}
      {activeSubTab === "recipes" && (
        <div className="space-y-3">
          <div className="flex gap-1.5 pb-1">
            <button
              onClick={() => setRecipeFilter("all")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                recipeFilter === "all"
                  ? "bg-[#285e4b] text-white"
                  : "bg-white border border-[#e2e8dc] text-[#556753]"
              }`}
            >
              Semua Resep
            </button>
            <button
              onClick={() => setRecipeFilter("iron")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                recipeFilter === "iron"
                  ? "bg-[#c97b5b] text-white"
                  : "bg-white border border-[#e2e8dc] text-[#556753]"
              }`}
            >
              ⭐ Tinggi Zat Besi
            </button>
            <button
              onClick={() => setRecipeFilter("finger")}
              className={`rounded-xl px-3 py-1.5 text-xs font-semibold ${
                recipeFilter === "finger"
                  ? "bg-[#285e4b] text-white"
                  : "bg-white border border-[#e2e8dc] text-[#556753]"
              }`}
            >
              Finger Food
            </button>
          </div>

          <div className="space-y-3">
            {filteredRecipes.map((rcp) => (
              <div
                key={rcp.id}
                onClick={() => onOpenRecipeDetail(rcp)}
                className="rounded-2xl border border-[#e2e8dc] bg-white p-4 cursor-pointer hover:border-[#c97b5b]/50 shadow-2xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-[#fcedea] px-2.5 py-0.5 text-[10px] font-bold text-[#c97b5b]">
                    {rcp.ageRange}
                  </span>
                  <span className="text-[11px] text-[#758075]">⏱ {rcp.prepTime}</span>
                </div>
                <h3 className="mt-1.5 font-bold text-sm text-[#243c32]">{rcp.title}</h3>
                <p className="mt-1 text-xs text-[#637561] leading-relaxed">{rcp.highlight}</p>

                <div className="mt-3 flex items-center justify-between border-t border-[#f0f3eb] pt-2 text-xs">
                  <span className="text-[11px] font-semibold text-[#c97b5b]">
                    {rcp.ironRich ? "✓ Anti-Anemia / Fe" : "✓ Lemak Sehat"}
                  </span>
                  <span className="font-bold text-[#285e4b]">Buka Resep ›</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: ALERGI & PENGUJIAN */}
      {activeSubTab === "allergies" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#243c32]">
              Daftar Uji Bahan Makanan ({allergies.length})
            </span>
            <button
              onClick={onOpenFoodAllergyModal}
              className="flex items-center gap-1 rounded-xl bg-[#285e4b] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1f4a3b]"
            >
              <PlusIcon className="w-3.5 h-3.5" />
              <span>Uji Makanan Baru</span>
            </button>
          </div>

          <div className="rounded-2xl bg-[#eff4eb] p-3 text-xs text-[#285e4b] border border-[#d6e5cf]">
            <strong>Aturan 3 Hari (3-Day Rule):</strong> Berikan 1 jenis bahan makanan baru selama 3
            hari berturut-turut dalam jumlah bertahap untuk mendeteksi alergi (ruam, bengkak, diare,
            muntah).
          </div>

          <div className="space-y-2.5">
            {allergies.map((alg) => (
              <div
                key={alg.id}
                className="flex items-start justify-between rounded-2xl border border-[#e2e8dc] bg-white p-3.5 shadow-2xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-xs text-[#243c32]">{alg.foodName}</h4>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        alg.status === "safe"
                          ? "bg-green-100 text-green-800"
                          : alg.status === "monitoring"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {alg.status === "safe"
                        ? "Aman Bebas Alergi"
                        : alg.status === "monitoring"
                        ? `Pantau Hari ke-${alg.dayCount}`
                        : "Terindikasi Alergi"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[#71826f]">
                    Mulai dicoba: {alg.introducedDate}
                  </p>
                  {alg.reactionDescription && (
                    <p className="mt-1 text-xs text-[#526350]">{alg.reactionDescription}</p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if (confirm("Hapus catatan uji makanan ini?")) onDeleteAllergy(alg.id);
                  }}
                  className="p-1 text-[#8c9c8a] hover:text-red-600"
                >
                  <TrashIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB: PANDUAN TEKSTUR */}
      {activeSubTab === "guide" && (
        <div className="space-y-3">
          <p className="text-xs text-[#758075]">
            Panduan tekstur dan porsi WHO untuk mencegah speech delay dan picky eater:
          </p>
          {AGE_GUIDES.map((g) => (
            <div
              key={g.range}
              className="rounded-2xl border border-[#e2e8dc] bg-white p-4 shadow-2xs space-y-1.5"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#285e4b]">{g.range}</span>
                <span className="rounded-full bg-[#f2f6ee] px-2.5 py-0.5 text-[10px] font-bold text-[#285e4b]">
                  {g.frequency}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#243c32]">
                Tekstur: <span className="font-normal text-[#526350]">{g.texture}</span>
              </p>
              <p className="text-xs font-semibold text-[#243c32]">
                Porsi: <span className="font-normal text-[#526350]">{g.portion}</span>
              </p>
              <div className="rounded-xl bg-[#fcf9f2] p-2.5 text-[11px] text-[#78531f] border border-[#f3e7ce]">
                💡 {g.tips}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

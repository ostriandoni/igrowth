"use client";

import React, { useState, useEffect } from "react";
import { FoodAllergyTest, ChildProfile } from "@/types";
import { CloseIcon } from "../icons";
import { DEFAULT_CURRENT_DATE } from "@/lib/storage";

interface FoodAllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile;
  onSaveAllergy: (item: FoodAllergyTest) => void;
}

export function FoodAllergyModal({
  isOpen,
  onClose,
  child,
  onSaveAllergy,
}: FoodAllergyModalProps) {
  const [foodName, setFoodName] = useState("");
  const [introducedDate, setIntroducedDate] = useState(DEFAULT_CURRENT_DATE);
  const [dayCount, setDayCount] = useState(1);
  const [status, setStatus] = useState<"safe" | "monitoring" | "allergic">("monitoring");
  const [reactionDescription, setReactionDescription] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      setIntroducedDate(new Date().toISOString().split("T")[0]);
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodName.trim()) return;

    const newTest: FoodAllergyTest = {
      id: `alg-${Date.now()}`,
      childId: child.id,
      foodName: foodName.trim(),
      introducedDate,
      dayCount,
      status,
      reactionDescription: reactionDescription.trim() || undefined,
    };

    onSaveAllergy(newTest);
    onClose();
  };

  const allergenPresets = [
    "Kuning Telur",
    "Putih Telur",
    "Ikan Salmon",
    "Ikan Kembung",
    "Udang Laut",
    "Daging Sapi",
    "Hati Ayam",
    "Tahu / Kedelai",
    "Keju Belcube",
    "Kacang Hijau",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-[28px] sm:rounded-2xl bg-white text-[#243c32] shadow-2xl p-5">
        <div className="flex items-center justify-between border-b border-[#eef0eb] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fcedea] text-[#c97b5b] font-bold text-sm">
              🛡️
            </span>
            <h3 className="font-bold text-base">Uji Makanan Baru (3-Day Rule)</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#758075] hover:bg-[#f2f4ec]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-3 space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-[#667265] mb-1">Nama Bahan Makanan *</label>
            <input
              type="text"
              placeholder="Contoh: Udang Laut / Kuning Telur"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2 text-xs font-semibold focus:outline-hidden"
              required
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {allergenPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setFoodName(preset)}
                  className="rounded-lg border border-[#e2e7dc] bg-[#f7f9f4] px-2 py-1 text-[10px] text-[#556354] hover:bg-[#ebf0e6]"
                >
                  + {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-[#667265] mb-1">Tanggal Mulai Coba</label>
              <input
                type="date"
                value={introducedDate}
                onChange={(e) => setIntroducedDate(e.target.value)}
                className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2 text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#667265] mb-1">Hari Pengenalan</label>
              <select
                value={dayCount}
                onChange={(e) => setDayCount(parseInt(e.target.value))}
                className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2 text-xs font-semibold"
              >
                <option value={1}>Hari ke-1</option>
                <option value={2}>Hari ke-2</option>
                <option value={3}>Hari ke-3 (Selesai Uji)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#667265] mb-1.5">Hasil Pemantauan</label>
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { id: "safe", label: "Aman (Bebas Alergi)", color: "border-green-500 bg-green-50 text-green-800" },
                { id: "monitoring", label: "Sedang Dipantau", color: "border-amber-500 bg-amber-50 text-amber-800" },
                { id: "allergic", label: "Alergi / Gejala", color: "border-red-500 bg-red-50 text-red-800" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setStatus(s.id as "safe" | "monitoring" | "allergic")}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    status === s.id ? s.color : "border-[#e0e5d9] bg-[#fbfbf8] text-[#556354]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#667265] mb-1">
              Catatan Reaksi Tubuh (Bila ada)
            </label>
            <textarea
              rows={2}
              placeholder="Contoh: Muncul ruam merah di sekitar mulut / Feses sedikit encer / Tidak ada reaksi sama sekali"
              value={reactionDescription}
              onChange={(e) => setReactionDescription(e.target.value)}
              className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#37536F] transition-all"
            >
              Simpan Uji Alergi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

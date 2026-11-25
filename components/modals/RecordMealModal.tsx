"use client";

import React, { useState, useEffect } from "react";
import { MealEatenAmount, MealRecord, MealTime, ChildProfile } from "@/types";
import { CloseIcon } from "../icons";
import { DEFAULT_CURRENT_DATE } from "@/lib/storage";

interface RecordMealModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile;
  onSaveMeal: (meal: MealRecord) => void;
}

export function RecordMealModal({ isOpen, onClose, child, onSaveMeal }: RecordMealModalProps) {
  const [date, setDate] = useState(DEFAULT_CURRENT_DATE);
  const [time, setTime] = useState("07:30");
  const [mealTime, setMealTime] = useState<MealTime>("sarapan");
  const [menuName, setMenuName] = useState("");
  const [amountEaten, setAmountEaten] = useState<MealEatenAmount>("habis");
  const [carbs, setCarbs] = useState("Nasi / Bubur");
  const [protein, setProtein] = useState("Ayam / Hati / Daging");
  const [vegetables, setVegetables] = useState("Sayuran");
  const [fat, setFat] = useState("Santan / Butter / Minyak");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const id = requestAnimationFrame(() => {
      const now = new Date();
      setDate(now.toISOString().split("T")[0]);
      setTime(
        `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`
      );
    });
    return () => cancelAnimationFrame(id);
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) {
      alert("Mohon isi nama menu makanan.");
      return;
    }

    const newMeal: MealRecord = {
      id: `meal-${Date.now()}`,
      childId: child.id,
      date,
      time,
      mealTime,
      menuName: menuName.trim(),
      amountEaten,
      carbs: carbs.trim() || undefined,
      protein: protein.trim() || undefined,
      vegetables: vegetables.trim() || undefined,
      fat: fat.trim() || undefined,
      notes: notes.trim() || undefined,
    };

    onSaveMeal(newMeal);
    onClose();
  };

  const mealTimeLabels: { id: MealTime; label: string }[] = [
    { id: "sarapan", label: "Pagi (07:00)" },
    { id: "snack_pagi", label: "Selingan (10:00)" },
    { id: "makan_siang", label: "Siang (12:30)" },
    { id: "snack_sore", label: "Selingan (15:30)" },
    { id: "makan_malam", label: "Malam (18:30)" },
  ];

  const amountLabels: { id: MealEatenAmount; label: string; icon: string }[] = [
    { id: "habis", label: "Habis", icon: "🥣✨" },
    { id: "tiga_perempat", label: "3/4 Porsi", icon: "🥄" },
    { id: "setengah", label: "1/2 Porsi", icon: "🥣" },
    { id: "sedikit", label: "< 1/2", icon: "🤏" },
    { id: "gtm", label: "GTM (Tutup Mulut)", icon: "🙅‍♂️" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-[28px] sm:rounded-2xl bg-white text-[#243c32] shadow-2xl p-5">
        <div className="flex items-center justify-between border-b border-[#eef0eb] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fcedea] text-[#c97b5b] font-bold text-sm">
              ♨
            </span>
            <h3 className="font-bold text-base">Catat Jadwal Makan MPASI</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#758075] hover:bg-[#f2f4ec]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-3 space-y-3.5 text-xs">
          {/* Waktu Makan Selector */}
          <div>
            <label className="block font-semibold text-[#667265] mb-1.5">Sesi Makan</label>
            <div className="grid grid-cols-3 gap-1.5">
              {mealTimeLabels.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMealTime(m.id)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    mealTime === m.id
                      ? "border-[#c97b5b] bg-[#fdf5f2] text-[#c97b5b]"
                      : "border-[#e0e5d9] bg-[#fbfbf8] text-[#556354]"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block font-semibold text-[#667265] mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2 text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#667265] mb-1">Jam Makan</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2 text-xs"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#667265] mb-1">Nama Menu MPASI *</label>
            <input
              type="text"
              placeholder="Contoh: Bubur Hati Ayam Santan Gurih"
              value={menuName}
              onChange={(e) => setMenuName(e.target.value)}
              className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2.5 text-xs font-semibold focus:border-[#c97b5b] focus:outline-hidden"
              required
            />
          </div>

          {/* Jumlah yang dimakan */}
          <div>
            <label className="block font-semibold text-[#667265] mb-1.5">
              Seberapa Banyak yang Dihabiskan?
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {amountLabels.map((a) => (
                <button
                  key={a.id}
                  type="button"
                  onClick={() => setAmountEaten(a.id)}
                  className={`py-2 px-1 rounded-xl border text-[11px] font-semibold text-center transition-all ${
                    amountEaten === a.id
                      ? "border-[#285e4b] bg-[#e8eee2] text-[#285e4b]"
                      : "border-[#e0e5d9] bg-[#fbfbf8] text-[#556354]"
                  }`}
                >
                  <span className="block text-sm mb-0.5">{a.icon}</span>
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* Komponen Menu 4 Bintang */}
          <div className="rounded-2xl border border-[#e8ece2] bg-[#f9faf7] p-3 space-y-2">
            <p className="font-bold text-[11px] text-[#285e4b] uppercase tracking-wider">
              Komposisi Nutrisi (Menu 4 Bintang):
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-[#758075]">Karbohidrat</label>
                <input
                  type="text"
                  value={carbs}
                  onChange={(e) => setCarbs(e.target.value)}
                  className="w-full rounded-lg border border-[#dce2d7] bg-white px-2 py-1.5 text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#758075]">Protein Hewani (Kaya Fe)</label>
                <input
                  type="text"
                  value={protein}
                  onChange={(e) => setProtein(e.target.value)}
                  className="w-full rounded-lg border border-[#dce2d7] bg-white px-2 py-1.5 text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#758075]">Sayuran / Buah</label>
                <input
                  type="text"
                  value={vegetables}
                  onChange={(e) => setVegetables(e.target.value)}
                  className="w-full rounded-lg border border-[#dce2d7] bg-white px-2 py-1.5 text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[#758075]">Lemak Tambahan</label>
                <input
                  type="text"
                  value={fat}
                  onChange={(e) => setFat(e.target.value)}
                  className="w-full rounded-lg border border-[#dce2d7] bg-white px-2 py-1.5 text-[11px]"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#667265] mb-1">Catatan Respon Makan</label>
            <input
              type="text"
              placeholder="Contoh: Suka sekali, disuapi 15 menit habis tanpa distraksi"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#dce2d7] bg-[#fbfbf8] px-3 py-2 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#37536F] transition-all"
            >
              Simpan Jadwal Makan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

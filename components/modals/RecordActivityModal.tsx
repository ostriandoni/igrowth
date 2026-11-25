"use client";

import React, { useState, useEffect } from "react";
import { ActivityLog, ActivityType, ChildProfile } from "@/types";
import { CloseIcon, MilkIcon, SleepIcon, DiaperIcon, VaccineIcon, SparklesIcon } from "../icons";
import { DEFAULT_CURRENT_DATE } from "@/lib/storage";

interface RecordActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile;
  initialType?: ActivityType;
  onSaveActivity: (log: ActivityLog) => void;
}

export function RecordActivityModal({
  isOpen,
  onClose,
  child,
  initialType = "milk",
  onSaveActivity,
}: RecordActivityModalProps) {
  const [type, setType] = useState<ActivityType>(initialType);
  const [date, setDate] = useState(DEFAULT_CURRENT_DATE);
  const [time, setTime] = useState("08:00");
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

  // Milk states
  const [milkType, setMilkType] = useState<"breast_direct" | "breast_bottle" | "formula">(
    "breast_direct"
  );
  const [amountMl, setAmountMl] = useState("120");
  const [durationMinutes, setDurationMinutes] = useState("15");

  // Sleep states
  const [sleepType, setSleepType] = useState<"day_nap" | "night_sleep">("day_nap");
  const [wakeTime, setWakeTime] = useState("");

  // Diaper states
  const [diaperType, setDiaperType] = useState<"wet" | "dirty" | "both">("both");
  const [stoolColor, setStoolColor] = useState("Kuning kecoklatan");
  const [stoolConsistency, setStoolConsistency] = useState<
    "normal" | "encer" | "keras" | "berlendir"
  >("normal");

  // Vaccine states
  const [vaccineName, setVaccineName] = useState("");
  const [healthCenter, setHealthCenter] = useState("Puskesmas / Klinik");
  const [temperature, setTemperature] = useState("36.7");

  // Moment states
  const [momentTitle, setMomentTitle] = useState("");
  const [story, setStory] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let title = "";
    const details: ActivityLog["details"] = {};

    if (type === "milk") {
      title =
        milkType === "breast_direct"
          ? `Menyusu ASI Langsung (${durationMinutes} mnt)`
          : milkType === "breast_bottle"
          ? `ASIP Botol (${amountMl} ml)`
          : `Susu Formula (${amountMl} ml)`;
      details.milkType = milkType;
      details.amountMl = milkType !== "breast_direct" ? parseInt(amountMl) || 0 : undefined;
      details.durationMinutes = milkType === "breast_direct" ? parseInt(durationMinutes) || 0 : undefined;
    } else if (type === "sleep") {
      title = sleepType === "day_nap" ? "Tidur Siang (Nap)" : "Tidur Malam";
      details.sleepType = sleepType;
      details.wakeTime = wakeTime || undefined;
      if (wakeTime) {
        details.durationFormatted = "Tidur terdata";
      }
    } else if (type === "diaper") {
      title =
        diaperType === "wet"
          ? "Ganti Popok (Pipis Basah)"
          : diaperType === "dirty"
          ? "Ganti Popok (BAB)"
          : "Ganti Popok (Pipis & BAB)";
      details.diaperType = diaperType;
      details.stoolColor = stoolColor;
      details.stoolConsistency = stoolConsistency;
    } else if (type === "vaccine") {
      title = vaccineName ? `Vaksin: ${vaccineName}` : "Pemberian Vaksin / Obat";
      details.vaccineName = vaccineName;
      details.healthCenter = healthCenter;
      details.temperature = parseFloat(temperature) || undefined;
    } else {
      title = momentTitle || "Momen Berharga";
      details.momentTitle = momentTitle;
      details.story = story;
    }

    const log: ActivityLog = {
      id: `act-${Date.now()}`,
      childId: child.id,
      date,
      time,
      type,
      title,
      details,
      notes: notes.trim(),
    };

    onSaveActivity(log);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-[28px] sm:rounded-2xl bg-white text-[#263746] shadow-2xl p-5">
        <div className="flex items-center justify-between border-b border-[#E5EBF1] pb-3">
          <h3 className="font-bold text-base text-[#263746]">Catat Aktivitas Anak</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#738397] hover:bg-[#F5F8FC]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-5 gap-1 pt-3 pb-2 border-b border-[#E5EBF1]">
          {[
            { id: "milk", label: "Susu", icon: <MilkIcon className="w-4 h-4" /> },
            { id: "sleep", label: "Tidur", icon: <SleepIcon className="w-4 h-4" /> },
            { id: "diaper", label: "Popok", icon: <DiaperIcon className="w-4 h-4" /> },
            { id: "vaccine", label: "Vaksin", icon: <VaccineIcon className="w-4 h-4" /> },
            { id: "moment", label: "Momen", icon: <SparklesIcon className="w-4 h-4" /> },
          ].map((item) => {
            const isSelected = type === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setType(item.id as ActivityType)}
                className={`flex flex-col items-center justify-center py-2 rounded-xl text-[11px] font-semibold transition-all ${
                  isSelected
                    ? "bg-[#476B8E] text-white shadow-xs"
                    : "bg-[#F5F8FC] text-[#738397] hover:bg-[#EAF0F6]"
                }`}
              >
                {item.icon}
                <span className="mt-1">{item.label}</span>
              </button>
            );
          })}
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-3 space-y-3.5 text-xs">
          {/* Tanggal & Waktu */}
          <div className="grid grid-cols-2 gap-2.5">
            <div>
              <label className="block font-semibold text-[#738397] mb-1">Tanggal</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-[#738397] mb-1">Waktu / Jam</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs focus:outline-hidden"
                required
              />
            </div>
          </div>

          {/* Form sesuai kategori */}
          {type === "milk" && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#738397] mb-1.5">Jenis Susu</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "breast_direct", label: "ASI Langsung" },
                    { id: "breast_bottle", label: "ASIP Botol" },
                    { id: "formula", label: "Formula" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setMilkType(m.id as "breast_direct" | "breast_bottle" | "formula")
                      }
                      className={`py-2 px-1 rounded-xl border text-[11px] font-medium text-center ${
                        milkType === m.id
                          ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] font-bold"
                          : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397]"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {milkType === "breast_direct" ? (
                <div>
                  <label className="block font-semibold text-[#738397] mb-1">
                    Durasi Menyusu (menit)
                  </label>
                  <input
                    type="number"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs font-semibold"
                  />
                </div>
              ) : (
                <div>
                  <label className="block font-semibold text-[#738397] mb-1">
                    Jumlah Susu (ml)
                  </label>
                  <input
                    type="number"
                    value={amountMl}
                    onChange={(e) => setAmountMl(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs font-semibold"
                  />
                </div>
              )}
            </div>
          )}

          {type === "sleep" && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#738397] mb-1.5">Tipe Tidur</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSleepType("day_nap")}
                    className={`py-2 rounded-xl border text-xs font-medium ${
                      sleepType === "day_nap"
                        ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] font-bold"
                        : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397]"
                    }`}
                  >
                    Tidur Siang (Nap)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSleepType("night_sleep")}
                    className={`py-2 rounded-xl border text-xs font-medium ${
                      sleepType === "night_sleep"
                        ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] font-bold"
                        : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397]"
                    }`}
                  >
                    Tidur Malam
                  </button>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-[#738397] mb-1">
                  Jam Bangun (opsional)
                </label>
                <input
                  type="time"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          {type === "diaper" && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#738397] mb-1.5">Kondisi Popok</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "wet", label: "💧 Pipis" },
                    { id: "dirty", label: "💩 BAB" },
                    { id: "both", label: "💧+💩 Keduanya" },
                  ].map((d) => (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => setDiaperType(d.id as "wet" | "dirty" | "both")}
                      className={`py-2 rounded-xl border text-xs font-medium ${
                        diaperType === d.id
                          ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] font-bold"
                          : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397]"
                      }`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {diaperType !== "wet" && (
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-[#738397] mb-1">Warna Feses</label>
                    <select
                      value={stoolColor}
                      onChange={(e) => setStoolColor(e.target.value)}
                      className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-2.5 py-2 text-xs"
                    >
                      <option value="Kuning kecoklatan">Kuning kecoklatan (Normal)</option>
                      <option value="Kuning cerah">Kuning cerah</option>
                      <option value="Kehijauan">Kehijauan</option>
                      <option value="Coklat tua">Coklat tua</option>
                      <option value="Pucat / Putih">Pucat / Putih (Waspada)</option>
                      <option value="Kemerahan / Darah">Kemerahan / Darah (Bahaya)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-[#738397] mb-1">Konsistensi</label>
                    <select
                      value={stoolConsistency}
                      onChange={(e) =>
                        setStoolConsistency(
                          e.target.value as "normal" | "encer" | "keras" | "berlendir"
                        )
                      }
                      className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-2.5 py-2 text-xs"
                    >
                      <option value="normal">Normal (Pasta lembut)</option>
                      <option value="encer">Encer / Cair (Diare)</option>
                      <option value="keras">Keras (Sembelit)</option>
                      <option value="berlendir">Berlendir</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {type === "vaccine" && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#738397] mb-1">Nama Vaksin / Obat</label>
                <input
                  type="text"
                  placeholder="Contoh: DPT-HB-Hib 3 / Paracetamol Drop"
                  value={vaccineName}
                  onChange={(e) => setVaccineName(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs font-medium"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-[#738397] mb-1">Fasilitas / Dokter</label>
                  <input
                    type="text"
                    value={healthCenter}
                    onChange={(e) => setHealthCenter(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#738397] mb-1">Suhu Tubuh (°C)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {type === "moment" && (
            <div className="space-y-3">
              <div>
                <label className="block font-semibold text-[#738397] mb-1">Judul Momen Indah</label>
                <input
                  type="text"
                  placeholder="Contoh: Gigi pertama tumbuh / Kata 'Mama' pertama"
                  value={momentTitle}
                  onChange={(e) => setMomentTitle(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs font-medium"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold text-[#738397] mb-1">Cerita Singkat</label>
                <textarea
                  rows={2}
                  placeholder="Tuliskan cerita saat si kecil pertama kali melakukannya..."
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block font-semibold text-[#738397] mb-1">Catatan Tambahan</label>
            <input
              type="text"
              placeholder="Keterangan opsional..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#37536F] transition-all"
            >
              Simpan Catatan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

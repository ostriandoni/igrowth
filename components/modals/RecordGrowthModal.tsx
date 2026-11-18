"use client";

import React, { useState, useEffect } from "react";
import { ChildProfile, GrowthRecord } from "@/types";
import { CloseIcon } from "../icons";
import { assessGrowth } from "@/lib/whoData";
import { calculateAge, DEFAULT_CURRENT_DATE } from "@/lib/storage";

interface RecordGrowthModalProps {
  isOpen: boolean;
  onClose: () => void;
  child: ChildProfile;
  onSaveRecord: (record: GrowthRecord) => void;
  initialRecord?: GrowthRecord | null;
}

export function RecordGrowthModal({
  isOpen,
  onClose,
  child,
  onSaveRecord,
  initialRecord,
}: RecordGrowthModalProps) {
  const [date, setDate] = useState(initialRecord?.date || DEFAULT_CURRENT_DATE);

  useEffect(() => {
    if (isOpen && !initialRecord) {
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [isOpen, initialRecord]);
  const [weight, setWeight] = useState(initialRecord?.weight?.toString() || "");
  const [height, setHeight] = useState(initialRecord?.height?.toString() || "");
  const [head, setHead] = useState(initialRecord?.headCircumference?.toString() || "");
  const [position, setPosition] = useState<"recumbent" | "standing">(
    initialRecord?.measurePosition || "recumbent"
  );
  const [notes, setNotes] = useState(initialRecord?.notes || "");

  if (!isOpen) return null;

  const ageDetails = calculateAge(child.birthDate, new Date(date));
  const numWeight = parseFloat(weight) || 0;
  const numHeight = parseFloat(height) || 0;
  const numHead = parseFloat(head) || 0;

  // Real-time assessment
  const hasValidInputs = numWeight > 0 && numHeight > 0 && numHead > 0;
  const assessment = hasValidInputs
    ? assessGrowth(ageDetails.totalMonths, numWeight, numHeight, numHead)
    : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!numWeight || !numHeight || !numHead) {
      alert("Mohon isi berat badan, tinggi badan, dan lingkar kepala.");
      return;
    }

    const newRecord: GrowthRecord = {
      id: initialRecord?.id || `gr-${Date.now()}`,
      childId: child.id,
      date,
      ageMonths: ageDetails.totalMonths,
      ageDays: ageDetails.days,
      weight: numWeight,
      height: numHeight,
      headCircumference: numHead,
      measurePosition: position,
      notes: notes.trim(),
    };

    onSaveRecord(newRecord);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[92vh] w-full max-w-md flex-col rounded-t-[28px] sm:rounded-2xl bg-white text-[#263746] shadow-2xl p-5">
        <div className="flex items-center justify-between border-b border-[#E5EBF1] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF0F6] text-[#476B8E] font-bold text-sm">
              ↗
            </span>
            <h3 className="font-bold text-base text-[#263746]">
              {initialRecord ? "Edit Catatan Ukur" : "Catat Pertumbuhan Anak"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#738397] hover:bg-[#F5F8FC]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto pt-4 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#738397] mb-1">
                Tanggal Pengukuran
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs font-medium focus:border-[#476B8E] focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#738397] mb-1">
                Usia Saat Diukur
              </label>
              <div className="rounded-xl border border-[#DCE4EE] bg-[#EAF0F6] px-3 py-2 text-xs font-semibold text-[#476B8E]">
                {ageDetails.ageString}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div>
              <label className="block text-xs font-semibold text-[#738397] mb-1">
                Berat (kg) *
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="misal: 8.35"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2.5 text-sm font-semibold focus:border-[#476B8E] focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#738397] mb-1">
                Tinggi (cm) *
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="misal: 69.5"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2.5 text-sm font-semibold focus:border-[#476B8E] focus:outline-hidden"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#738397] mb-1">
                L. Kepala (cm) *
              </label>
              <input
                type="number"
                step="0.1"
                placeholder="misal: 44.0"
                value={head}
                onChange={(e) => setHead(e.target.value)}
                className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2.5 text-sm font-semibold focus:border-[#476B8E] focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#738397] mb-1">
              Posisi Pengukuran
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPosition("recumbent")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  position === "recumbent"
                    ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] font-bold"
                    : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397]"
                }`}
              >
                Telentang (&lt; 2 thn)
              </button>
              <button
                type="button"
                onClick={() => setPosition("standing")}
                className={`py-2 px-3 rounded-xl border text-xs font-medium transition-all ${
                  position === "standing"
                    ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] font-bold"
                    : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397]"
                }`}
              >
                Berdiri (&ge; 2 thn)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#738397] mb-1">
              Catatan / Lokasi Pengukuran (opsional)
            </label>
            <input
              type="text"
              placeholder="Contoh: Posyandu Mawar, ditimbang bidan Santi"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-xs focus:border-[#476B8E] focus:outline-hidden"
            />
          </div>

          {/* Real-time WHO status preview */}
          {assessment && (
            <div className="rounded-2xl border border-[#DCE4EE] bg-[#F0F5FA] p-3 space-y-1.5">
              <p className="text-[11px] font-bold text-[#476B8E] uppercase tracking-wider">
                Analisis Standar WHO:
              </p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#738397]">Berat menurut Umur:</span>
                <span
                  className={`font-semibold ${
                    assessment.weightForAge.level === "normal"
                      ? "text-[#476B8E]"
                      : assessment.weightForAge.level === "warning"
                      ? "text-[#D49E35]"
                      : "text-red-600"
                  }`}
                >
                  {assessment.weightForAge.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#738397]">Panjang/Tinggi:</span>
                <span
                  className={`font-semibold ${
                    assessment.heightForAge.level === "normal"
                      ? "text-[#476B8E]"
                      : assessment.heightForAge.level === "warning"
                      ? "text-[#D49E35]"
                      : "text-red-600"
                  }`}
                >
                  {assessment.heightForAge.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#738397]">Lingkar Kepala:</span>
                <span
                  className={`font-semibold ${
                    assessment.headCircumference.level === "normal"
                      ? "text-[#476B8E]"
                      : "text-[#D49E35]"
                  }`}
                >
                  {assessment.headCircumference.status}
                </span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#37536F] transition-all"
            >
              Simpan Pengukuran
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

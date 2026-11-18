"use client";

import React, { useState } from "react";
import { CaregiverProfile } from "@/types";
import { CloseIcon } from "../icons";

interface CaregiverModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCaregiver: CaregiverProfile;
  onSaveCaregiver: (caregiver: CaregiverProfile) => void;
}

const ROLES: Array<CaregiverProfile["role"]> = ["Ayah", "Ibu", "Nenek", "Kakek", "Pengasuh", "Lainnya"];

export function CaregiverModal({
  isOpen,
  onClose,
  currentCaregiver,
  onSaveCaregiver,
}: CaregiverModalProps) {
  const [role, setRole] = useState<CaregiverProfile["role"]>(currentCaregiver.role);
  const [name, setName] = useState(currentCaregiver.name);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCaregiver({
      id: currentCaregiver.id,
      role,
      name: name.trim() || role,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="w-full max-w-sm rounded-t-[28px] sm:rounded-2xl bg-white text-[#263746] shadow-2xl p-5 animate-in fade-in slide-in-from-bottom duration-200">
        <div className="flex items-center justify-between border-b border-[#E5EBF1] pb-3">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF0F6] text-[#476B8E] font-bold text-sm">
              👥
            </span>
            <h3 className="font-bold text-base text-[#263746]">Profil Pengasuh</h3>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#738397] hover:bg-[#F5F8FC]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#738397] mb-2">
              Siapa yang sedang mendampingi si kecil?
            </label>
            <div className="grid grid-cols-3 gap-2">
              {ROLES.map((r) => {
                const isSelected = role === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl border text-xs font-semibold transition-all ${
                      isSelected
                        ? "border-[#476B8E] bg-[#EAF0F6] text-[#476B8E] shadow-xs"
                        : "border-[#E5EBF1] bg-[#F8FAFD] text-[#738397] hover:bg-[#F0F5FA]"
                    }`}
                  >
                    <span className="text-base mb-1">
                      {r === "Ayah"
                        ? "👨"
                        : r === "Ibu"
                        ? "👩"
                        : r === "Nenek"
                        ? "👵"
                        : r === "Kakek"
                        ? "👴"
                        : "🧑"}
                    </span>
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#738397] mb-1">
              Nama Pengasuh / Panggilan
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Dimas / Bunda Ayu"
              className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3.5 py-2.5 text-sm font-medium focus:border-[#476B8E] focus:outline-hidden"
              required
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full rounded-xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#37536F] transition-all"
            >
              Ganti Pengasuh
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

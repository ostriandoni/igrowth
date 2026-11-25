"use client";

import React, { useState } from "react";
import { ChildProfile, Gender } from "@/types";
import { CloseIcon } from "../icons";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeChild: ChildProfile;
  allChildren: ChildProfile[];
  onUpdateChild: (child: ChildProfile) => void;
  onSelectChild: (childId: string) => void;
  onAddChild: (child: ChildProfile) => void;
  onResetData: () => void;
  onExportData: () => void;
  onImportData: (jsonData: string) => boolean;
  userEmail?: string;
  onSignOut?: () => void;
}

export function SettingsModal({
  isOpen,
  onClose,
  activeChild,
  allChildren,
  onUpdateChild,
  onSelectChild,
  onAddChild,
  onResetData,
  onExportData,
  onImportData,
  userEmail,
  onSignOut,
}: SettingsModalProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "children" | "data" | "info">("profile");

  // Edit Child Form state
  const [name, setName] = useState(activeChild.name);
  const [nickname, setNickname] = useState(activeChild.nickname);
  const [birthDate, setBirthDate] = useState(activeChild.birthDate);
  const [gender, setGender] = useState<Gender>(activeChild.gender);
  const [birthWeight, setBirthWeight] = useState(activeChild.birthWeight.toString());
  const [birthHeight, setBirthHeight] = useState(activeChild.birthHeight.toString());
  const [birthHead, setBirthHead] = useState(activeChild.birthHeadCircumference.toString());
  const [bloodType, setBloodType] = useState(activeChild.bloodType || "O+");
  const [savedAlert, setSavedAlert] = useState(false);

  // New Child form modal state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newChildName, setNewChildName] = useState("");
  const [newChildNickname, setNewChildNickname] = useState("");
  const [newChildBirthDate, setNewChildBirthDate] = useState("2026-06-01");
  const [newChildGender, setNewChildGender] = useState<Gender>("male");

  // Reminders
  const [remindGrowth, setRemindGrowth] = useState(true);
  const [remindVaccine, setRemindVaccine] = useState(true);
  const [remindMpasi, setRemindMpasi] = useState(true);

  if (!isOpen) return null;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: ChildProfile = {
      ...activeChild,
      name: name.trim() || activeChild.name,
      nickname: nickname.trim() || activeChild.nickname,
      birthDate,
      gender,
      birthWeight: parseFloat(birthWeight) || activeChild.birthWeight,
      birthHeight: parseFloat(birthHeight) || activeChild.birthHeight,
      birthHeadCircumference: parseFloat(birthHead) || activeChild.birthHeadCircumference,
      bloodType,
    };
    onUpdateChild(updated);
    setSavedAlert(true);
    setTimeout(() => setSavedAlert(false), 2500);
  };

  const handleAddNewChild = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChildName.trim()) return;

    const newChild: ChildProfile = {
      id: `child-${Date.now()}`,
      name: newChildName.trim(),
      nickname: newChildNickname.trim() || newChildName.split(" ")[0],
      birthDate: newChildBirthDate,
      gender: newChildGender,
      birthWeight: 3.1,
      birthHeight: 49.0,
      birthHeadCircumference: 33.5,
      avatarIcon: newChildGender === "female" ? "👧" : "👶",
    };

    onAddChild(newChild);
    setShowAddForm(false);
    setNewChildName("");
    setNewChildNickname("");
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        const success = onImportData(content);
        if (success) {
          alert("Data berhasil diimpor dan diperbarui!");
          onClose();
        } else {
          alert("Gagal membaca file data. Format tidak sesuai.");
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-[28px] sm:rounded-2xl bg-white text-[#263746] shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E5EBF1] px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF0F6] text-[#476B8E] font-bold text-sm">
              ⚙
            </span>
            <h2 className="text-lg font-bold">Pengaturan</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#738397] hover:bg-[#F5F8FC] transition-colors"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="grid grid-cols-4 border-b border-[#E5EBF1] bg-[#F8FAFD] px-2 text-xs font-semibold text-[#738397]">
          <button
            onClick={() => setActiveTab("profile")}
            className={`py-3 border-b-2 text-center transition-colors ${
              activeTab === "profile"
                ? "border-[#476B8E] text-[#476B8E]"
                : "border-transparent hover:text-[#263746]"
            }`}
          >
            Profil Anak
          </button>
          <button
            onClick={() => setActiveTab("children")}
            className={`py-3 border-b-2 text-center transition-colors ${
              activeTab === "children"
                ? "border-[#476B8E] text-[#476B8E]"
                : "border-transparent hover:text-[#263746]"
            }`}
          >
            Anak ({allChildren.length})
          </button>
          <button
            onClick={() => setActiveTab("data")}
            className={`py-3 border-b-2 text-center transition-colors ${
              activeTab === "data"
                ? "border-[#476B8E] text-[#476B8E]"
                : "border-transparent hover:text-[#263746]"
            }`}
          >
            Data & Backup
          </button>
          <button
            onClick={() => setActiveTab("info")}
            className={`py-3 border-b-2 text-center transition-colors ${
              activeTab === "info"
                ? "border-[#476B8E] text-[#476B8E]"
                : "border-transparent hover:text-[#263746]"
            }`}
          >
            Info Standar
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 text-sm">
          {savedAlert && (
            <div className="mb-4 rounded-xl bg-[#EAF0F6] p-3 text-xs font-semibold text-[#476B8E] border border-[#DCE4EE] flex items-center gap-2">
              <span>✓</span> Profil berhasil disimpan!
            </div>
          )}

          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#738397] mb-1">
                  Nama Lengkap Anak
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3.5 py-2.5 text-sm font-medium focus:border-[#476B8E] focus:outline-hidden"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#738397] mb-1">
                    Nama Panggilan
                  </label>
                  <input
                    type="text"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3.5 py-2.5 text-sm font-medium focus:border-[#476B8E] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#738397] mb-1">
                    Jenis Kelamin
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value as Gender)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2.5 text-sm font-medium focus:border-[#476B8E] focus:outline-hidden"
                  >
                    <option value="male">Laki-laki 👦</option>
                    <option value="female">Perempuan 👧</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-[#738397] mb-1">
                    Tanggal Lahir
                  </label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2 text-sm font-medium focus:border-[#476B8E] focus:outline-hidden"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#738397] mb-1">
                    Golongan Darah
                  </label>
                  <select
                    value={bloodType}
                    onChange={(e) => setBloodType(e.target.value)}
                    className="w-full rounded-xl border border-[#E5EBF1] bg-[#F8FAFD] px-3 py-2.5 text-sm font-medium focus:border-[#476B8E] focus:outline-hidden"
                  >
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O+">O+</option>
                    <option value="Belum Tahu">Belum dicek</option>
                  </select>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-bold text-[#476B8E] uppercase tracking-wider mb-2">
                  Ukuran Saat Lahir
                </p>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] text-[#738397] mb-1">Berat (kg)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={birthWeight}
                      onChange={(e) => setBirthWeight(e.target.value)}
                      className="w-full rounded-lg border border-[#E5EBF1] bg-[#F8FAFD] px-2.5 py-2 text-xs font-medium focus:border-[#476B8E] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#738397] mb-1">Panjang (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={birthHeight}
                      onChange={(e) => setBirthHeight(e.target.value)}
                      className="w-full rounded-lg border border-[#E5EBF1] bg-[#F8FAFD] px-2.5 py-2 text-xs font-medium focus:border-[#476B8E] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-[#738397] mb-1">L. Kepala (cm)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={birthHead}
                      onChange={(e) => setBirthHead(e.target.value)}
                      className="w-full rounded-lg border border-[#E5EBF1] bg-[#F8FAFD] px-2.5 py-2 text-xs font-medium focus:border-[#476B8E] focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Notifikasi Toggles */}
              <div className="pt-3 border-t border-[#E5EBF1] space-y-2.5">
                <p className="text-xs font-bold text-[#476B8E] uppercase tracking-wider">
                  Pengingat & Notifikasi
                </p>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-medium">Pengingat Ukur Rutin Bulanan</span>
                  <input
                    type="checkbox"
                    checked={remindGrowth}
                    onChange={(e) => setRemindGrowth(e.target.checked)}
                    className="accent-[#476B8E] h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-medium">Jadwal Imunisasi IDAI</span>
                  <input
                    type="checkbox"
                    checked={remindVaccine}
                    onChange={(e) => setRemindVaccine(e.target.checked)}
                    className="accent-[#476B8E] h-4 w-4"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-xs font-medium">Pengingat Jadwal MPASI & Susu</span>
                  <input
                    type="checkbox"
                    checked={remindMpasi}
                    onChange={(e) => setRemindMpasi(e.target.checked)}
                    className="accent-[#476B8E] h-4 w-4"
                  />
                </label>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#37536F] transition-all"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          )}

          {activeTab === "children" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-[#738397]">Pilih profil anak yang aktif</p>
                <button
                  onClick={() => setShowAddForm(true)}
                  className="text-xs font-bold text-[#476B8E] hover:underline"
                >
                  + Tambah Anak
                </button>
              </div>

              <div className="space-y-2.5">
                {allChildren.map((c) => {
                  const isCurrent = c.id === activeChild.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectChild(c.id)}
                      className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                        isCurrent
                          ? "border-[#476B8E] bg-[#EAF0F6] shadow-xs"
                          : "border-[#E5EBF1] bg-[#F8FAFD] hover:bg-[#F0F5FA]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-xl shadow-2xs">
                          {c.avatarIcon || (c.gender === "female" ? "👧" : "👶")}
                        </span>
                        <div>
                          <p className="font-bold text-sm text-[#263746]">
                            {c.name}{" "}
                            {isCurrent && (
                              <span className="text-[10px] font-semibold text-[#476B8E] bg-white px-2 py-0.5 rounded-full border border-[#DCE4EE]">
                                Aktif
                              </span>
                            )}
                          </p>
                          <p className="text-xs text-[#738397]">
                            Lahir {c.birthDate} • {c.gender === "female" ? "Perempuan" : "Laki-laki"}
                          </p>
                        </div>
                      </div>
                      <span className="text-lg text-[#476B8E]">{isCurrent ? "✓" : "›"}</span>
                    </div>
                  );
                })}
              </div>

              {showAddForm && (
                <form
                  onSubmit={handleAddNewChild}
                  className="mt-4 rounded-2xl border border-[#DCE4EE] bg-[#F5F8FC] p-4 space-y-3"
                >
                  <h4 className="font-bold text-sm text-[#476B8E]">Tambah Profil Anak Baru</h4>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#738397] mb-1">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={newChildName}
                      onChange={(e) => setNewChildName(e.target.value)}
                      placeholder="Contoh: Mikasa Maulana"
                      className="w-full rounded-xl border border-[#DCE4EE] bg-white px-3 py-2 text-xs focus:outline-hidden"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] font-semibold text-[#738397] mb-1">
                        Panggilan
                      </label>
                      <input
                        type="text"
                        value={newChildNickname}
                        onChange={(e) => setNewChildNickname(e.target.value)}
                        placeholder="Mikasa"
                        className="w-full rounded-xl border border-[#DCE4EE] bg-white px-3 py-2 text-xs focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-[#738397] mb-1">
                        Jenis Kelamin
                      </label>
                      <select
                        value={newChildGender}
                        onChange={(e) => setNewChildGender(e.target.value as Gender)}
                        className="w-full rounded-xl border border-[#DCE4EE] bg-white px-2.5 py-2 text-xs focus:outline-hidden"
                      >
                        <option value="male">Laki-laki 👦</option>
                        <option value="female">Perempuan 👧</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-[#738397] mb-1">
                      Tanggal Lahir
                    </label>
                    <input
                      type="date"
                      value={newChildBirthDate}
                      onChange={(e) => setNewChildBirthDate(e.target.value)}
                      className="w-full rounded-xl border border-[#DCE4EE] bg-white px-3 py-2 text-xs focus:outline-hidden"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1 rounded-xl border border-[#CBD5E1] py-2 text-xs font-semibold text-[#738397]"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#476B8E] py-2 text-xs font-semibold text-white hover:bg-[#37536F]"
                    >
                      Simpan Anak
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === "data" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-[#E5EBF1] bg-[#F8FAFD] p-4">
                <h4 className="font-bold text-sm text-[#263746]">Cadangkan Data (Backup)</h4>
                <p className="mt-1 text-xs text-[#738397]">
                  Unduh seluruh catatan pertumbuhan, milestone, resep, dan log anak dalam bentuk file JSON.
                </p>
                <button
                  onClick={onExportData}
                  className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#476B8E] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#37536F] transition-all w-full"
                >
                  <span>⬇</span> Unduh Cadangan JSON
                </button>
              </div>

              <div className="rounded-2xl border border-[#E5EBF1] bg-[#F8FAFD] p-4">
                <h4 className="font-bold text-sm text-[#263746]">Pulihkan Data (Import)</h4>
                <p className="mt-1 text-xs text-[#738397]">
                  Pulihkan data dari file JSON cadangan sebelumnya ke perangkat ini.
                </p>
                <label className="mt-3 flex items-center justify-center gap-2 rounded-xl border border-[#476B8E] bg-white px-4 py-2.5 text-xs font-semibold text-[#476B8E] hover:bg-[#EAF0F6] transition-all w-full cursor-pointer">
                  <span>⬆</span> Pilih File Cadangan (.json)
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleFileImport}
                    className="hidden"
                  />
                </label>
              </div>

              {userEmail && onSignOut && (
                <div className="rounded-2xl border border-[#DCE4EE] bg-[#EAF0F6]/60 p-4">
                  <h4 className="font-bold text-sm text-[#263746]">Akun Terhubung</h4>
                  <p className="mt-1 text-xs text-[#738397]">
                    Masuk sebagai <strong className="text-[#263746]">{userEmail}</strong>
                  </p>
                  <button
                    onClick={() => {
                      onSignOut();
                      onClose();
                    }}
                    className="mt-3 rounded-xl border border-[#476B8E] bg-white px-4 py-2 text-xs font-semibold text-[#476B8E] hover:bg-[#EAF0F6] transition-all"
                  >
                    Keluar dari Akun
                  </button>
                </div>
              )}

              <div className="rounded-2xl border border-red-200 bg-red-50/50 p-4">
                <h4 className="font-bold text-sm text-red-700">Kembalikan ke Data Contoh</h4>
                <p className="mt-1 text-xs text-red-600/80">
                  Akan mereset data ke kondisi demo (Profil Eren, data pengukuran WHO lengkap, milestone 9 bulan).
                </p>
                <button
                  onClick={() => {
                    if (confirm("Apakah Anda yakin ingin mereset data kembali ke kondisi awal?")) {
                      onResetData();
                      onClose();
                    }
                  }}
                  className="mt-3 rounded-xl border border-red-300 bg-white px-4 py-2 text-xs font-semibold text-red-700 hover:bg-red-50 transition-all"
                >
                  Reset ke Data Awal
                </button>
              </div>
            </div>
          )}

          {activeTab === "info" && (
            <div className="space-y-3.5 text-xs text-[#738397] leading-relaxed">
              <div className="rounded-2xl bg-[#EAF0F6] p-4 border border-[#DCE4EE]">
                <h4 className="font-bold text-sm text-[#476B8E] mb-1">
                  Standar Antropometri WHO & Kemenkes RI
                </h4>
                <p className="text-[#263746]">
                  Aplikasi iGrowth mengacu pada standar <strong>WHO Child Growth Standards 2006</strong> dan{" "}
                  <strong>Permenkes RI No. 2 Tahun 2020</strong> tentang Standar Antropometri Anak.
                </p>
              </div>

              <div className="space-y-2">
                <div className="rounded-xl border border-[#E5EBF1] p-3 bg-white">
                  <p className="font-bold text-[#263746]">BB/U (Berat Badan menurut Umur)</p>
                  <p className="text-[11px] text-[#738397] mt-0.5">
                    Mengidentifikasi anak dengan berat badan sangat kurang, kurang, normal, atau risiko berat lebih.
                  </p>
                </div>

                <div className="rounded-xl border border-[#E5EBF1] p-3 bg-white">
                  <p className="font-bold text-[#263746]">PB/U & TB/U (Deteksi Dini Stunting)</p>
                  <p className="text-[11px] text-[#738397] mt-0.5">
                    Menilai status pertumbuhan linear jangka panjang untuk mencegah dan mendeteksi kondisi stunting sejak 1000 HPK (Hari Pertama Kehidupan).
                  </p>
                </div>

                <div className="rounded-xl border border-[#E5EBF1] p-3 bg-white">
                  <p className="font-bold text-[#263746]">LK/U (Lingkar Kepala)</p>
                  <p className="text-[11px] text-[#738397] mt-0.5">
                    Indikator penting perkembangan volume otak balita untuk mendeteksi mikrosefali atau makrosefali sedini mungkin.
                  </p>
                </div>
              </div>

              <div className="rounded-xl bg-[#FEF8EC] p-3 text-[11px] text-[#8C651E] border border-[#F8E5BF]">
                <strong>Catatan Penting:</strong> Aplikasi ini merupakan sarana pendukung orang tua di rumah dan bukan pengganti diagnosis medis resmi. Konsultasikan selalu dengan Dokter Spesialis Anak (Sp.A) atau Puskesmas/Posyandu terdekat.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

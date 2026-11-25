"use client";

import React, { useState } from "react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";

interface AuthViewProps {
  onAuthSuccess: () => void;
}

export function AuthView({ onAuthSuccess }: AuthViewProps) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setInfoMsg(null);

    if (!configured) {
      setErrorMsg(
        "Konfigurasi Supabase belum ditemukan. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY sudah diatur di .env.local."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        onAuthSuccess();
      } else {
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) throw error;
        if (data.session) {
          onAuthSuccess();
        } else {
          setInfoMsg(
            "Pendaftaran berhasil! Silakan cek kotak masuk email Anda untuk konfirmasi sebelum masuk."
          );
          setMode("login");
        }
      }
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Terjadi kesalahan autentikasi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-[#F5F8FC] px-6 py-10 text-[#263746]">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#476B8E] text-2xl text-white shadow-sm">
          🌱
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#263746]">
          i<span className="text-[#476B8E]">growth</span>
        </h1>
        <p className="mt-1.5 text-sm text-[#738397]">
          Monitoring Tumbuh Kembang Anak Berbasis Standar WHO
        </p>
      </div>

      <div className="rounded-3xl border border-[#E5EBF1] bg-white p-6 shadow-xs">
        <div className="mb-5 flex rounded-2xl bg-[#F5F8FC] p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              mode === "login"
                ? "bg-white text-[#476B8E] shadow-xs"
                : "text-[#738397] hover:text-[#263746]"
            }`}
          >
            Masuk
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setErrorMsg(null);
            }}
            className={`flex-1 rounded-xl py-2 text-xs font-semibold transition-all ${
              mode === "register"
                ? "bg-white text-[#476B8E] shadow-xs"
                : "text-[#738397] hover:text-[#263746]"
            }`}
          >
            Daftar Akun
          </button>
        </div>

        {!configured && (
          <div className="mb-4 rounded-2xl border border-[#F8E5BF] bg-[#FEF8EC] p-3.5 text-xs text-[#8C651E]">
            <strong>Supabase Belum Terhubung:</strong> Salin{" "}
            <code className="font-mono">.env.example</code> menjadi{" "}
            <code className="font-mono">.env.local</code> dan isi kredensial
            proyek Supabase Anda.
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {infoMsg && (
          <div className="mb-4 rounded-2xl border border-[#DCE4EE] bg-[#EAF0F6] p-3 text-xs text-[#476B8E]">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#263746]">
              Email Orang Tua
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="w-full rounded-xl border border-[#E5EBF1] bg-[#F5F8FC] px-3.5 py-2.5 text-sm text-[#263746] outline-none focus:border-[#476B8E] focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-[#263746]">
              Kata Sandi
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimal 6 karakter"
              className="w-full rounded-xl border border-[#E5EBF1] bg-[#F5F8FC] px-3.5 py-2.5 text-sm text-[#263746] outline-none focus:border-[#476B8E] focus:bg-white"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-xs transition-all hover:bg-[#3A5977] disabled:opacity-60"
          >
            {loading
              ? "Memproses..."
              : mode === "login"
                ? "Masuk ke iGrowth"
                : "Buat Akun Baru"}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-xs text-[#738397]">
        Data tumbuh kembang anak tersimpan aman dan privat per akun dengan Row
        Level Security (RLS).
      </p>
    </main>
  );
}

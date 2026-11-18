import Image from "next/image";

const navItems = [
  { icon: "⌂", label: "Beranda", active: true },
  { icon: "♧", label: "Tumbuh" },
  { icon: "↗", label: "Ukur" },
  { icon: "♨", label: "MPASI" },
  { icon: "▤", label: "Memo" },
];

export default function Home() {
  return (
    <main className="mx-auto min-h-screen max-w-md bg-[#f7f7ed] pb-24 text-[#243c32]">
      <header className="flex items-center justify-between px-5 pt-5">
        <a href="#" className="text-2xl font-bold tracking-tight">
          i<span className="text-[#c97b5b]">growth</span>
        </a>

        <div className="flex items-center gap-3">
          <button className="rounded-full bg-[#e8eee2] px-4 py-2 text-sm font-medium">
            A&nbsp; Ayah
          </button>
          <button
            aria-label="Pengaturan"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#e6e7dc] bg-white text-lg"
          >
            ☷
          </button>
        </div>
      </header>

      <section className="px-5 pt-5">
        <p className="text-xs font-medium uppercase tracking-wider text-[#7b8578]">
          Selasa, 17 November
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">Hai, Eren.</h1>

        <div className="mt-3 rounded-[26px] bg-[#285e4b] p-5 text-white shadow-sm">
          <p className="text-sm text-white/75">Usia hari ini</p>
          <p className="mt-1 text-4xl font-semibold">
            7 <span className="text-xl font-normal">bulan</span>{" "}
            18 <span className="text-xl font-normal">hari</span>
          </p>
          <p className="mt-2 text-sm text-white/75">Lahir 30 Maret 2026</p>

          <div className="mt-6 flex justify-between text-xs text-white/80">
            <span>Menuju usia 9 bulan</span>
            <span>43 hari lagi</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/20">
            <div className="h-full w-1/2 rounded-full bg-[#e8c85b]" />
          </div>
        </div>
      </section>

      <section className="px-5 pt-2">
        <button className="flex w-full items-center gap-3 rounded-2xl border border-[#eeeee5] bg-white p-4 text-left shadow-sm">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#f1f2e9] text-sm font-semibold">
            0/10
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-semibold">Checklist 9 bulan</span>
            <span className="mt-0.5 block text-xs text-[#7b8578]">
              0 dari 10 sudah terlihat
            </span>
            <span className="mt-1 block text-xs text-[#b27b54]">
              Checklist 6 bulan: 1/7
            </span>
          </span>
          <span className="text-xl text-[#9ba298]">›</span>
        </button>
      </section>

      <section className="px-5 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Pertumbuhan</h2>
          <button className="text-xs font-semibold text-[#285e4b]">
            + Catat ukur
          </button>
        </div>

        <div className="mt-3 flex items-start gap-3 rounded-2xl border border-[#e8ece2] bg-[#eff3e9] p-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg">
            ↗
          </span>
          <div>
            <p className="text-sm font-semibold">Belum ada pengukuran</p>
            <p className="mt-1 text-xs leading-relaxed text-[#758075]">
              Catat berat badan pertama supaya grafiknya mulai terbentuk.
            </p>
          </div>
        </div>
      </section>

      <nav className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md border-t border-[#e9eadf] bg-[#fbfbf5]/95 px-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur">
        <div className="grid grid-cols-5">
          {navItems.map((item) => (
            <a
              key={item.label}
              href="#"
              className={`flex flex-col items-center gap-1 py-1 text-[11px] ${item.active
                  ? "font-semibold text-[#285e4b]"
                  : "text-[#899187]"
                }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              {item.label}
            </a>
          ))}
        </div>
      </nav>
    </main>
  );
}

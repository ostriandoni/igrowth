import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iGrowth - Pantau Tumbuh Kembang Anak",
  description: "Aplikasi pemantauan tumbuh kembang, milestone, grafik WHO, MPASI, dan memo harian anak",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-[#F5F8FC] text-[#263746]">
        {children}
      </body>
    </html>
  );
}


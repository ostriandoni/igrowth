// Standar Pertumbuhan WHO (0-24 Bulan)
// Nilai Z-Score: -3SD, -2SD, Median (0SD), +2SD, +3SD

export interface WHOGrowthPoints {
  month: number;
  sdNeg3: number;
  sdNeg2: number;
  sd0: number; // Median
  sdPos2: number;
  sdPos3: number;
}

// Berat Badan menurut Umur (Laki-laki) kg
export const whoBoysWeight: WHOGrowthPoints[] = [
  { month: 0, sdNeg3: 2.1, sdNeg2: 2.5, sd0: 3.3, sdPos2: 4.4, sdPos3: 5.0 },
  { month: 1, sdNeg3: 2.9, sdNeg2: 3.4, sd0: 4.5, sdPos2: 5.8, sdPos3: 6.6 },
  { month: 2, sdNeg3: 3.8, sdNeg2: 4.3, sd0: 5.6, sdPos2: 7.1, sdPos3: 8.0 },
  { month: 3, sdNeg3: 4.4, sdNeg2: 5.0, sd0: 6.4, sdPos2: 8.0, sdPos3: 9.0 },
  { month: 4, sdNeg3: 4.9, sdNeg2: 5.6, sd0: 7.0, sdPos2: 8.7, sdPos3: 9.7 },
  { month: 5, sdNeg3: 5.3, sdNeg2: 6.0, sd0: 7.5, sdPos2: 9.3, sdPos3: 10.4 },
  { month: 6, sdNeg3: 5.7, sdNeg2: 6.4, sd0: 7.9, sdPos2: 9.8, sdPos3: 10.9 },
  { month: 7, sdNeg3: 5.9, sdNeg2: 6.7, sd0: 8.3, sdPos2: 10.3, sdPos3: 11.4 },
  { month: 8, sdNeg3: 6.2, sdNeg2: 6.9, sd0: 8.6, sdPos2: 10.7, sdPos3: 11.9 },
  { month: 9, sdNeg3: 6.4, sdNeg2: 7.1, sd0: 8.9, sdPos2: 11.0, sdPos3: 12.3 },
  { month: 10, sdNeg3: 6.6, sdNeg2: 7.4, sd0: 9.2, sdPos2: 11.4, sdPos3: 12.7 },
  { month: 11, sdNeg3: 6.8, sdNeg2: 7.6, sd0: 9.4, sdPos2: 11.7, sdPos3: 13.0 },
  { month: 12, sdNeg3: 6.9, sdNeg2: 7.7, sd0: 9.6, sdPos2: 12.0, sdPos3: 13.3 },
  { month: 15, sdNeg3: 7.4, sdNeg2: 8.3, sd0: 10.3, sdPos2: 12.8, sdPos3: 14.3 },
  { month: 18, sdNeg3: 7.8, sdNeg2: 8.8, sd0: 10.9, sdPos2: 13.7, sdPos3: 15.3 },
  { month: 21, sdNeg3: 8.2, sdNeg2: 9.2, sd0: 11.5, sdPos2: 14.5, sdPos3: 16.2 },
  { month: 24, sdNeg3: 8.6, sdNeg2: 9.7, sd0: 12.2, sdPos2: 15.3, sdPos3: 17.1 },
];

// Panjang Badan menurut Umur (Laki-laki) cm
export const whoBoysLength: WHOGrowthPoints[] = [
  { month: 0, sdNeg3: 44.2, sdNeg2: 46.1, sd0: 49.9, sdPos2: 53.7, sdPos3: 55.6 },
  { month: 1, sdNeg3: 48.9, sdNeg2: 50.8, sd0: 54.7, sdPos2: 58.6, sdPos3: 60.6 },
  { month: 2, sdNeg3: 52.4, sdNeg2: 54.4, sd0: 58.4, sdPos2: 62.4, sdPos3: 64.4 },
  { month: 3, sdNeg3: 55.3, sdNeg2: 57.3, sd0: 61.4, sdPos2: 65.5, sdPos3: 67.6 },
  { month: 4, sdNeg3: 57.6, sdNeg2: 59.7, sd0: 63.9, sdPos2: 68.0, sdPos3: 70.1 },
  { month: 5, sdNeg3: 59.6, sdNeg2: 61.7, sd0: 65.9, sdPos2: 70.1, sdPos3: 72.2 },
  { month: 6, sdNeg3: 61.2, sdNeg2: 63.3, sd0: 67.6, sdPos2: 71.9, sdPos3: 74.0 },
  { month: 7, sdNeg3: 62.7, sdNeg2: 64.8, sd0: 69.2, sdPos2: 73.5, sdPos3: 75.7 },
  { month: 8, sdNeg3: 64.0, sdNeg2: 66.2, sd0: 70.6, sdPos2: 75.0, sdPos3: 77.2 },
  { month: 9, sdNeg3: 65.2, sdNeg2: 67.5, sd0: 72.0, sdPos2: 76.5, sdPos3: 78.7 },
  { month: 10, sdNeg3: 66.4, sdNeg2: 68.7, sd0: 73.3, sdPos2: 77.9, sdPos3: 80.1 },
  { month: 11, sdNeg3: 67.6, sdNeg2: 69.9, sd0: 74.5, sdPos2: 79.2, sdPos3: 81.5 },
  { month: 12, sdNeg3: 68.6, sdNeg2: 71.0, sd0: 75.7, sdPos2: 80.5, sdPos3: 82.9 },
  { month: 15, sdNeg3: 71.6, sdNeg2: 74.1, sd0: 79.1, sdPos2: 84.1, sdPos3: 86.6 },
  { month: 18, sdNeg3: 74.2, sdNeg2: 76.9, sd0: 82.3, sdPos2: 87.7, sdPos3: 90.4 },
  { month: 21, sdNeg3: 76.5, sdNeg2: 79.4, sd0: 85.1, sdPos2: 90.9, sdPos3: 93.8 },
  { month: 24, sdNeg3: 78.7, sdNeg2: 81.7, sd0: 87.8, sdPos2: 93.9, sdPos3: 97.0 },
];

// Lingkar Kepala menurut Umur (Laki-laki) cm
export const whoBoysHead: WHOGrowthPoints[] = [
  { month: 0, sdNeg3: 31.9, sdNeg2: 33.1, sd0: 34.5, sdPos2: 37.0, sdPos3: 38.0 },
  { month: 1, sdNeg3: 34.9, sdNeg2: 36.1, sd0: 37.3, sdPos2: 39.5, sdPos3: 40.5 },
  { month: 2, sdNeg3: 36.8, sdNeg2: 37.9, sd0: 39.1, sdPos2: 41.3, sdPos3: 42.4 },
  { month: 3, sdNeg3: 38.1, sdNeg2: 39.2, sd0: 40.5, sdPos2: 42.7, sdPos3: 43.8 },
  { month: 4, sdNeg3: 39.2, sdNeg2: 40.3, sd0: 41.6, sdPos2: 43.8, sdPos3: 44.9 },
  { month: 5, sdNeg3: 40.1, sdNeg2: 41.2, sd0: 42.6, sdPos2: 44.8, sdPos3: 45.9 },
  { month: 6, sdNeg3: 40.9, sdNeg2: 42.0, sd0: 43.3, sdPos2: 45.6, sdPos3: 46.7 },
  { month: 7, sdNeg3: 41.5, sdNeg2: 42.6, sd0: 44.0, sdPos2: 46.2, sdPos3: 47.4 },
  { month: 8, sdNeg3: 42.0, sdNeg2: 43.1, sd0: 44.5, sdPos2: 46.8, sdPos3: 47.9 },
  { month: 9, sdNeg3: 42.5, sdNeg2: 43.6, sd0: 45.0, sdPos2: 47.2, sdPos3: 48.4 },
  { month: 10, sdNeg3: 42.9, sdNeg2: 44.0, sd0: 45.4, sdPos2: 47.7, sdPos3: 48.8 },
  { month: 11, sdNeg3: 43.2, sdNeg2: 44.3, sd0: 45.8, sdPos2: 48.0, sdPos3: 49.2 },
  { month: 12, sdNeg3: 43.5, sdNeg2: 44.6, sd0: 46.1, sdPos2: 48.3, sdPos3: 49.5 },
  { month: 18, sdNeg3: 44.7, sdNeg2: 45.8, sd0: 47.4, sdPos2: 49.7, sdPos3: 50.9 },
  { month: 24, sdNeg3: 45.4, sdNeg2: 46.6, sd0: 48.3, sdPos2: 50.7, sdPos3: 51.9 },
];

export interface GrowthStatusAssessment {
  weightForAge: {
    status: string;
    level: "normal" | "warning" | "danger";
    description: string;
  };
  heightForAge: {
    status: string;
    level: "normal" | "warning" | "danger";
    description: string;
  };
  headCircumference: {
    status: string;
    level: "normal" | "warning" | "danger";
    description: string;
  };
}

export function assessGrowth(
  ageMonths: number,
  weight: number,
  height: number,
  head: number
): GrowthStatusAssessment {
  // Ambil titik terdekat pada data WHO
  const point = whoBoysWeight.reduce((prev, curr) =>
    Math.abs(curr.month - ageMonths) < Math.abs(prev.month - ageMonths) ? curr : prev
  );

  const lengthPoint = whoBoysLength.reduce((prev, curr) =>
    Math.abs(curr.month - ageMonths) < Math.abs(prev.month - ageMonths) ? curr : prev
  );

  const headPoint = whoBoysHead.reduce((prev, curr) =>
    Math.abs(curr.month - ageMonths) < Math.abs(prev.month - ageMonths) ? curr : prev
  );

  // Evaluasi Berat Badan menurut Umur (BB/U - Permenkes No. 2 Tahun 2020)
  let weightStatus = "Berat Badan Normal";
  let weightLevel: "normal" | "warning" | "danger" = "normal";
  let weightDesc = "Pertumbuhan berat badan berada pada rentang ideal.";

  if (weight < point.sdNeg3) {
    weightStatus = "Berat Badan Sangat Kurang";
    weightLevel = "danger";
    weightDesc = "Segera konsultasi ke Dokter Spesialis Anak (DSA) untuk evaluasi gizi.";
  } else if (weight < point.sdNeg2) {
    weightStatus = "Berat Badan Kurang (Underweight)";
    weightLevel = "warning";
    weightDesc = "Perlu optimalisasi asupan kalori dan pemantauan berkala.";
  } else if (weight > point.sdPos3) {
    weightStatus = "Risiko Berat Lebih";
    weightLevel = "warning";
    weightDesc = "Di atas persentil 97. Perhatikan pola makan dan aktivitas gerak.";
  }

  // Evaluasi Panjang Badan menurut Umur (PB/U - Deteksi Stunting)
  let heightStatus = "Tinggi Normal";
  let heightLevel: "normal" | "warning" | "danger" = "normal";
  let heightDesc = "Panjang badan anak berkembang optimal sesuai usianya.";

  if (height < lengthPoint.sdNeg3) {
    heightStatus = "Sangat Pendek (Severely Stunted)";
    heightLevel = "danger";
    heightDesc = "Indikasi stunting berat. Hubungi dokter anak untuk intervensi nutrisi.";
  } else if (height < lengthPoint.sdNeg2) {
    heightStatus = "Pendek (Stunted)";
    heightLevel = "warning";
    heightDesc = "Di bawah -2 SD standar WHO. Perbanyak protein hewani kaya zat besi.";
  } else if (height > lengthPoint.sdPos3) {
    heightStatus = "Tinggi";
    heightLevel = "normal";
    heightDesc = "Pertumbuhan linear sangat baik di atas rata-rata.";
  }

  // Evaluasi Lingkar Kepala (LK/U)
  let headStatus = "Lingkar Kepala Normal";
  let headLevel: "normal" | "warning" | "danger" = "normal";
  let headDesc = "Ukuran lingkar kepala normal menandakan pertumbuhan otak optimal.";

  if (head < headPoint.sdNeg2) {
    headStatus = "Mikrosefali (Kecil)";
    headLevel = "warning";
    headDesc = "Perlu pemeriksaan dokter spesialis saraf atau anak untuk evaluasi.";
  } else if (head > headPoint.sdPos2) {
    headStatus = "Makrosefali (Besar)";
    headLevel = "warning";
    headDesc = "Di atas +2 SD. Perlu dicek proporsi kepala terhadap badan.";
  }

  return {
    weightForAge: { status: weightStatus, level: weightLevel, description: weightDesc },
    heightForAge: { status: heightStatus, level: heightLevel, description: heightDesc },
    headCircumference: { status: headStatus, level: headLevel, description: headDesc },
  };
}

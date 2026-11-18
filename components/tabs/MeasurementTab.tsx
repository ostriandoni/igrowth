"use client";

import React, { useState } from "react";
import { ChildProfile, GrowthRecord } from "@/types";
import { PlusIcon, TrashIcon, EditIcon } from "../icons";
import {
  assessGrowth,
  whoBoysWeight,
  whoBoysLength,
  whoBoysHead,
  WHOGrowthPoints,
} from "@/lib/whoData";

interface MeasurementTabProps {
  child: ChildProfile;
  records: GrowthRecord[];
  onOpenAddRecord: () => void;
  onEditRecord: (record: GrowthRecord) => void;
  onDeleteRecord: (id: string) => void;
}

type ChartMetric = "weight" | "height" | "head";

export function MeasurementTab({
  child,
  records,
  onOpenAddRecord,
  onEditRecord,
  onDeleteRecord,
}: MeasurementTabProps) {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>("weight");

  const sortedRecords = [...records].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const latestRecord = sortedRecords.length > 0 ? sortedRecords[sortedRecords.length - 1] : null;

  const assessment = latestRecord
    ? assessGrowth(
        latestRecord.ageMonths,
        latestRecord.weight,
        latestRecord.height,
        latestRecord.headCircumference
      )
    : null;

  // Chart Dimensions & Scales
  const chartWidth = 340;
  const chartHeight = 200;
  const padding = { top: 20, right: 20, bottom: 30, left: 35 };

  const maxMonth = 12; // 0-12 months display

  let whoData: WHOGrowthPoints[] = whoBoysWeight;
  let yMin = 2;
  let yMax = 14;
  let unit = "kg";
  let labelTitle = "Berat Badan menurut Umur";

  if (activeMetric === "height") {
    whoData = whoBoysLength;
    yMin = 40;
    yMax = 85;
    unit = "cm";
    labelTitle = "Panjang Badan menurut Umur (Deteksi Stunting)";
  } else if (activeMetric === "head") {
    whoData = whoBoysHead;
    yMin = 30;
    yMax = 52;
    unit = "cm";
    labelTitle = "Lingkar Kepala menurut Umur";
  }

  // Convert (month, val) to SVG (x, y)
  const getX = (m: number) => {
    const clampedM = Math.min(maxMonth, Math.max(0, m));
    return (
      padding.left +
      (clampedM / maxMonth) * (chartWidth - padding.left - padding.right)
    );
  };

  const getY = (val: number) => {
    const clampedVal = Math.min(yMax, Math.max(yMin, val));
    return (
      chartHeight -
      padding.bottom -
      ((clampedVal - yMin) / (yMax - yMin)) *
        (chartHeight - padding.top - padding.bottom)
    );
  };

  // Generate SVG path string from points
  const generatePath = (getter: (p: WHOGrowthPoints) => number) => {
    const pts = whoData.filter((p) => p.month <= maxMonth);
    return pts
      .map((p, i) => `${i === 0 ? "M" : "L"} ${getX(p.month)} ${getY(getter(p))}`)
      .join(" ");
  };

  const medianPath = generatePath((p) => p.sd0);
  const pos2Path = generatePath((p) => p.sdPos2);
  const neg2Path = generatePath((p) => p.sdNeg2);

  // Generate Area Band for Normal (-2SD to +2SD)
  const pts = whoData.filter((p) => p.month <= maxMonth);
  const forwardNeg2 = pts.map((p) => `${getX(p.month)},${getY(p.sdNeg2)}`);
  const backwardPos2 = [...pts]
    .reverse()
    .map((p) => `${getX(p.month)},${getY(p.sdPos2)}`);
  const normalAreaPoints = [...forwardNeg2, ...backwardPos2].join(" ");

  return (
    <div className="space-y-4 px-5 pt-3 pb-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold text-[#263746]">Pertumbuhan & KMS</h2>
          <p className="mt-0.5 text-xs text-[#738397]">Standar Kurva WHO 2006 & Kemenkes RI</p>
        </div>
        <button
          onClick={onOpenAddRecord}
          className="flex items-center gap-1 rounded-full bg-[#476B8E] px-3.5 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#37536F] active:scale-95 transition-all"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Catat Ukur</span>
        </button>
      </div>

      {/* Latest Status Assessment Card */}
      {latestRecord && assessment && (
        <div className="rounded-2xl border border-[#DCE4EE] bg-[#EAF0F6] p-4 text-[#263746]">
          <div className="flex items-center justify-between border-b border-[#D0DDEB] pb-2.5">
            <span className="text-xs font-bold text-[#476B8E]">
              Pengukuran Terakhir: {latestRecord.date}
            </span>
            <span className="text-xs text-[#738397]">
              Usia: {latestRecord.ageMonths} bln {latestRecord.ageDays} hr
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center">
            <div className="rounded-xl bg-white p-2.5 border border-[#DCE4EE]">
              <span className="text-[10px] text-[#738397] block">Berat Badan</span>
              <span className="text-lg font-bold text-[#476B8E]">
                {latestRecord.weight}{" "}
                <span className="text-xs font-normal text-[#738397]">kg</span>
              </span>
              <span
                className={`mt-1 block text-[10px] font-bold rounded-full py-0.5 ${
                  assessment.weightForAge.level === "normal"
                    ? "text-[#476B8E] bg-[#EAF0F6]"
                    : "text-amber-800 bg-amber-100"
                }`}
              >
                {assessment.weightForAge.status}
              </span>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-[#DCE4EE]">
              <span className="text-[10px] text-[#738397] block">Panjang/Tinggi</span>
              <span className="text-lg font-bold text-[#476B8E]">
                {latestRecord.height}{" "}
                <span className="text-xs font-normal text-[#738397]">cm</span>
              </span>
              <span
                className={`mt-1 block text-[10px] font-bold rounded-full py-0.5 ${
                  assessment.heightForAge.level === "normal"
                    ? "text-[#476B8E] bg-[#EAF0F6]"
                    : "text-amber-800 bg-amber-100"
                }`}
              >
                {assessment.heightForAge.status}
              </span>
            </div>

            <div className="rounded-xl bg-white p-2.5 border border-[#DCE4EE]">
              <span className="text-[10px] text-[#738397] block">Lingkar Kepala</span>
              <span className="text-lg font-bold text-[#476B8E]">
                {latestRecord.headCircumference}{" "}
                <span className="text-xs font-normal text-[#738397]">cm</span>
              </span>
              <span
                className={`mt-1 block text-[10px] font-bold rounded-full py-0.5 ${
                  assessment.headCircumference.level === "normal"
                    ? "text-[#476B8E] bg-[#EAF0F6]"
                    : "text-amber-800 bg-amber-100"
                }`}
              >
                {assessment.headCircumference.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Chart Metric Tabs */}
      <div className="rounded-2xl border border-[#E5EBF1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#263746]">
            Grafik Pertumbuhan
          </h3>
          <div className="flex gap-1 rounded-xl bg-[#EAF0F6] p-1 text-[11px] font-semibold text-[#738397]">
            <button
              onClick={() => setActiveMetric("weight")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                activeMetric === "weight"
                  ? "bg-white text-[#476B8E] font-bold shadow-2xs"
                  : "hover:text-[#263746]"
              }`}
            >
              Berat (BB)
            </button>
            <button
              onClick={() => setActiveMetric("height")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                activeMetric === "height"
                  ? "bg-white text-[#476B8E] font-bold shadow-2xs"
                  : "hover:text-[#263746]"
              }`}
            >
              Tinggi (TB)
            </button>
            <button
              onClick={() => setActiveMetric("head")}
              className={`rounded-lg px-2.5 py-1 transition-all ${
                activeMetric === "head"
                  ? "bg-white text-[#476B8E] font-bold shadow-2xs"
                  : "hover:text-[#263746]"
              }`}
            >
              L. Kepala (LK)
            </button>
          </div>
        </div>

        <p className="text-[11px] text-[#738397] mb-2">{labelTitle}</p>

        {/* SVG Chart */}
        <div className="overflow-x-auto">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto overflow-visible select-none"
          >
            {/* Grid lines */}
            {[0, 3, 6, 9, 12].map((m) => (
              <g key={`x-grid-${m}`}>
                <line
                  x1={getX(m)}
                  y1={padding.top}
                  x2={getX(m)}
                  y2={chartHeight - padding.bottom}
                  stroke="#EDF2F7"
                  strokeWidth="1"
                />
                <text
                  x={getX(m)}
                  y={chartHeight - padding.bottom + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#738397"
                  fontWeight="600"
                >
                  {m} bln
                </text>
              </g>
            ))}

            {/* Y axis ticks */}
            {[yMin, (yMin + yMax) / 2, yMax].map((val, idx) => (
              <g key={`y-grid-${idx}`}>
                <line
                  x1={padding.left}
                  y1={getY(val)}
                  x2={chartWidth - padding.right}
                  y2={getY(val)}
                  stroke="#EDF2F7"
                  strokeWidth="1"
                />
                <text
                  x={padding.left - 6}
                  y={getY(val) + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill="#738397"
                  fontWeight="600"
                >
                  {Math.round(val)} {unit}
                </text>
              </g>
            ))}

            {/* Normal Band Area (-2SD to +2SD) */}
            <polygon points={normalAreaPoints} fill="#EDF3F8" opacity="0.9" />

            {/* WHO Standard Lines */}
            <path
              d={pos2Path}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />
            <path d={medianPath} fill="none" stroke="#476B8E" strokeWidth="2" />
            <path
              d={neg2Path}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="1.2"
              strokeDasharray="2,2"
            />

            {/* Child's actual data line */}
            {sortedRecords.length > 0 && (
              <path
                d={sortedRecords
                  .filter((r) => r.ageMonths <= maxMonth)
                  .map((r, i) => {
                    const val =
                      activeMetric === "weight"
                        ? r.weight
                        : activeMetric === "height"
                        ? r.height
                        : r.headCircumference;
                    const x = getX(r.ageMonths + r.ageDays / 30);
                    const y = getY(val);
                    return `${i === 0 ? "M" : "L"} ${x} ${y}`;
                  })
                  .join(" ")}
                fill="none"
                stroke="#E8B85C"
                strokeWidth="2.5"
              />
            )}

            {/* Child's data points */}
            {sortedRecords
              .filter((r) => r.ageMonths <= maxMonth)
              .map((r) => {
                const val =
                  activeMetric === "weight"
                    ? r.weight
                    : activeMetric === "height"
                    ? r.height
                    : r.headCircumference;
                const x = getX(r.ageMonths + r.ageDays / 30);
                const y = getY(val);
                return (
                  <g key={`pt-${r.id}`}>
                    <circle cx={x} cy={y} r="4.5" fill="#E8B85C" stroke="#ffffff" strokeWidth="2" />
                  </g>
                );
              })}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-2 flex items-center justify-center gap-4 text-[10px] text-[#738397] font-medium border-t border-[#EDF2F7] pt-2">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[#E8B85C]" />
            Pertumbuhan Anak
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-3 bg-[#476B8E]" />
            Median WHO (P50)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-3 bg-[#EDF3F8] border border-[#CBD5E1]" />
            Rentang Normal (-2 s/d +2 SD)
          </span>
        </div>
      </div>

      {/* History Records Table */}
      <div className="rounded-2xl border border-[#E5EBF1] bg-white p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#263746]">
            Riwayat Pengukuran ({records.length})
          </h3>
          <span className="text-[11px] text-[#738397]">Urutan terbaru</span>
        </div>

        {records.length === 0 ? (
          <p className="text-xs text-[#738397] py-4 text-center">
            Belum ada data pengukuran yang dicatat.
          </p>
        ) : (
          <div className="divide-y divide-[#EDF2F7]">
            {[...sortedRecords].reverse().map((rec) => (
              <div key={rec.id} className="py-3 flex items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#263746]">{rec.date}</span>
                    <span className="text-[10px] font-semibold text-[#476B8E] bg-[#EAF0F6] px-2 py-0.5 rounded-full">
                      {rec.ageMonths} bln {rec.ageDays} hr
                    </span>
                  </div>
                  <div className="mt-1 flex items-center gap-3 text-xs text-[#738397]">
                    <span>
                      BB: <strong className="text-[#263746]">{rec.weight} kg</strong>
                    </span>
                    <span>
                      TB: <strong className="text-[#263746]">{rec.height} cm</strong>
                    </span>
                    <span>
                      LK: <strong className="text-[#263746]">{rec.headCircumference} cm</strong>
                    </span>
                  </div>
                  {rec.notes && (
                    <p className="mt-0.5 text-[11px] text-[#738397] italic">{rec.notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onEditRecord(rec)}
                    title="Edit catatan"
                    className="p-1.5 rounded-lg text-[#738397] hover:bg-[#EAF0F6] hover:text-[#476B8E]"
                  >
                    <EditIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Hapus catatan pengukuran ini?")) {
                        onDeleteRecord(rec.id);
                      }
                    }}
                    title="Hapus catatan"
                    className="p-1.5 rounded-lg text-[#738397] hover:bg-red-50 hover:text-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

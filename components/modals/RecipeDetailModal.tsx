"use client";

import React from "react";
import { MpasiRecipe } from "@/types";
import { CloseIcon } from "../icons";

interface RecipeDetailModalProps {
  recipe: MpasiRecipe | null;
  onClose: () => void;
  onCookRecipe?: (recipe: MpasiRecipe) => void;
}

export function RecipeDetailModal({
  recipe,
  onClose,
  onCookRecipe,
}: RecipeDetailModalProps) {
  if (!recipe) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-0 sm:p-4 backdrop-blur-xs">
      <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-t-[28px] sm:rounded-2xl bg-white text-[#263746] shadow-2xl p-5">
        <div className="flex items-center justify-between border-b border-[#E5EBF1] pb-3">
          <span className="rounded-full bg-[#EAF0F6] px-3 py-1 text-xs font-bold text-[#476B8E]">
            {recipe.ageRange}
          </span>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full text-[#738397] hover:bg-[#F5F8FC]"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto pt-3 space-y-4 text-xs">
          <div>
            <h3 className="text-lg font-bold text-[#263746] leading-tight">
              {recipe.title}
            </h3>
            <p className="mt-1 text-xs text-[#738397]">
              Waktu memasak: {recipe.prepTime}
            </p>
          </div>

          <div className="rounded-2xl bg-[#EAF0F6] p-3 border border-[#DCE4EE] text-[#476B8E] leading-relaxed">
            <span className="font-bold text-[11px] block uppercase tracking-wider mb-0.5">
              Highlight Nutrisi:
            </span>
            {recipe.highlight}
          </div>

          <div className="flex flex-wrap gap-1.5">
            {recipe.nutritionTags.map((tag) => (
              <span
                key={tag}
                className="rounded-lg bg-[#F5F8FC] border border-[#E5EBF1] px-2.5 py-1 text-[11px] font-semibold text-[#738397]"
              >
                ✓ {tag}
              </span>
            ))}
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#263746] uppercase tracking-wider mb-2">
              Bahan-Bahan:
            </h4>
            <ul className="space-y-1.5 pl-2">
              {recipe.ingredients.map((ing, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-[#263746]">
                  <span className="text-[#476B8E] font-bold">•</span>
                  <span>{ing}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-xs text-[#263746] uppercase tracking-wider mb-2">
              Cara Memasak:
            </h4>
            <ol className="space-y-2 pl-2">
              {recipe.instructions.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs text-[#263746]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EAF0F6] text-[10px] font-bold text-[#476B8E]">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {onCookRecipe && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onCookRecipe(recipe);
                  onClose();
                }}
                className="w-full rounded-xl bg-[#476B8E] py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#37536F] transition-all"
              >
                + Masukkan ke Catatan Makan Hari Ini
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

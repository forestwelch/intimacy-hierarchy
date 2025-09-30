"use client";
import React from "react";
import { Level } from "./types";

export default function Pyramid({
  levels,
  openId,
  onSelect,
}: {
  levels: Level[];
  openId: string | null;
  onSelect: (id: string) => void;
}) {
  const arranged = [...levels];
  const count = arranged.length;

  const topWidthPct = 60;
  const bottomWidthPct = 95;
  const slopeRange = bottomWidthPct - topWidthPct;

  const widths = arranged.map(
    (_, idx) => bottomWidthPct - (idx / Math.max(1, count - 1)) * slopeRange
  );
  // render top-to-bottom visually, but widths were computed bottom->top, so map by id
  const widthById = new Map<string, number>();
  arranged.forEach((lvl, idx) => widthById.set(lvl.id, widths[idx]));

  const renderOrder = [...arranged].reverse();

  return (
    <div className="md:col-span-2 flex items-center justify-center w-full">
      <div
        className="w-full max-w-xl flex flex-col items-center justify-center gap-6 overflow-visible min-h-[420px]"
        aria-hidden
      >
        {renderOrder.map((lvl) => {
          const width = widthById.get(lvl.id) ?? bottomWidthPct;
          const selected = openId === lvl.id;

          return (
            <div
              key={lvl.id}
              role="group"
              aria-labelledby={`lvl-${lvl.id}-label`}
              className={`w-full flex justify-center`}
            >
              <button
                onClick={() => onSelect(lvl.id)}
                aria-labelledby={`lvl-${lvl.id}-label`}
                style={{ width: `${width}%` }}
                className={`text-center flex flex-col items-center rounded-2xl px-6 py-6 bg-gradient-to-br ${
                  lvl.color
                } ${
                  lvl.colorTo
                } text-white/95 shadow-xl border border-white/8 transition-transform duration-200 ease-out ${
                  selected
                    ? "ring-2 ring-white/70 scale-[1.01]"
                    : "hover:-translate-y-1 hover:shadow-2xl"
                }`}
              >
                <span id={`lvl-${lvl.id}-label`} className="sr-only">
                  {lvl.title}
                </span>
                <span className="block font-semibold text-lg sm:text-xl leading-tight text-center">
                  {lvl.title}
                </span>
                {lvl.subtitle && (
                  <span className="block text-sm opacity-90 text-center mt-1">
                    {lvl.subtitle}
                  </span>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

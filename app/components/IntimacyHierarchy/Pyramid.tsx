"use client";
import React from "react";
// no extra icons needed here
import { Level } from "./types";
import { getIcon } from "./icons";

export default function Pyramid({
  levels,
  openId,
  onSelect,
}: {
  levels: Level[];
  openId: string | null;
  onSelect: (id: string) => void;
}) {
  // Render stacked trapezoid slices (bottom -> top) so layers form a pyramid
  const arranged = [...levels];
  const count = arranged.length;
  const topWidthPct = 40; // topmost width as %
  const bottomWidthPct = 100;
  const slopeRange = bottomWidthPct - topWidthPct; // 60

  // widths[idx] is the base width for layer idx (0 = bottom)
  const widths = arranged.map(
    (_, idx) => bottomWidthPct - (idx / Math.max(1, count - 1)) * slopeRange
  );

  return (
    <div className="md:col-span-2 flex items-center justify-center">
      <div className="w-full max-w-md relative h-[360px] pb-6" aria-hidden>
        {arranged.map((lvl, idx) => {
          const width = widths[idx];
          const heightPct = 100 / Math.max(1, count);
          const bottomPos = idx * heightPct;
          const left = (100 - width) / 2;

          return (
            <button
              key={lvl.id}
              onClick={() => onSelect(lvl.id)}
              style={{
                width: `${width}%`,
                left: `${left}%`,
                bottom: `${bottomPos}%`,
                height: `${heightPct}%`,
                zIndex: 10 + idx,
              }}
              className={`absolute transition-transform duration-200 ease-out transform hover:-translate-y-1 bg-gradient-to-br ${lvl.color} ${lvl.colorTo} text-white/95 shadow-md rounded-2xl flex items-center gap-4 px-4 py-3 border border-white/10 ${
                openId === lvl.id ? "ring-2 ring-white/70 scale-[1.02]" : ""
              }`}
            >
              <span className="inline-flex items-center justify-center rounded-xl bg-white/12 p-2">
                {getIcon(lvl.icon)}
              </span>
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base leading-tight">
                  {lvl.title}
                </div>
                {lvl.subtitle && (
                  <div className="text-xs opacity-80">{lvl.subtitle}</div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

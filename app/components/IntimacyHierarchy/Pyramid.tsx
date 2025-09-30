"use client";
import React from "react";
import { ChevronDown } from "lucide-react";
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
  return (
    <div className="md:col-span-2 flex flex-col gap-3">
      {levels.map((lvl) => (
        <button
          key={lvl.id}
          onClick={() => onSelect(lvl.id)}
          className={`group w-full text-left rounded-2xl p-4 border border-white/10 shadow-sm transition-all hover:shadow-md bg-gradient-to-br ${
            lvl.color
          } ${lvl.colorTo} text-white/95 ${
            openId === lvl.id ? "ring-2 ring-white/70" : "opacity-90"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center rounded-xl bg-white/15 p-2">
                {getIcon(lvl.icon)}
              </span>
              <div>
                <div className="font-semibold leading-tight">{lvl.title}</div>
                {lvl.subtitle && (
                  <div className="text-xs opacity-80">{lvl.subtitle}</div>
                )}
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 transition-transform ${
                openId === lvl.id ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </button>
      ))}
    </div>
  );
}

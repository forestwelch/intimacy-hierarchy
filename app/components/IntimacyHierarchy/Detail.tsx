"use client";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Level, Item } from "./types";
import { getIcon } from "./icons";

export default function Detail({
  level,
  onEdit,
  onDelete,
}: {
  level: Level | null;
  onEdit: (item?: Item) => void;
  onDelete: (itemId: string) => void;
}) {
  if (!level) return null;
  return (
    <div className="md:col-span-3">
      <Card>
        <CardHeader className="flex items-start md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <CardTitle className="flex items-center gap-2">
              <span
                className={`inline-flex items-center justify-center rounded-xl p-2 text-white bg-gradient-to-br ${level.color} ${level.colorTo}`}
              >
                {getIcon(level.icon)}
              </span>
              {level.title}
            </CardTitle>
            <p className="mt-2 text-sm opacity-80">{level.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onEdit()}>
              Add Item
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {level.items.map((it) => (
              <li
                key={it.id}
                className="group flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/60 dark:bg-neutral-800/60"
              >
                <Badge
                  className={`capitalize ${
                    it.type === "goal"
                      ? "bg-amber-100 text-amber-800"
                      : it.type === "practice"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {it.type}
                </Badge>
                <div className="flex-1 leading-relaxed">{it.text}</div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onEdit(it)}
                  >
                    Edit
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onDelete(it.id)}
                  >
                    Delete
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

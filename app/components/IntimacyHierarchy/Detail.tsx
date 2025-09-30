"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Level, Item } from "./types";
import { getIcon } from "./icons";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";

export default function Detail({
  level,
  onEdit,
  onDelete,
}: {
  level: Level | null;
  onEdit: (item?: Item) => void;
  onDelete: (itemId: string) => void;
}) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  if (!level)
    return (
      <div className="md:col-span-3 flex items-center justify-center text-muted">
        <p className="opacity-70">Select a level to see details</p>
      </div>
    );

  return (
    <div className="md:col-span-3">
      <AnimatePresence mode="wait">
        <motion.div
          key={level.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
        >
          <Card className="bg-neutral-900/95 text-neutral-100 border border-neutral-800">
            <CardHeader className="flex items-start md:flex-row md:items-center md:justify-between gap-4">
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
                <Button
                  variant="secondary"
                  onClick={() => onEdit()}
                  className="bg-neutral-800 text-neutral-100 border-neutral-700"
                >
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {level.items.map((it) => (
                  <motion.li
                    layout
                    key={it.id}
                    className="group flex items-start gap-3 p-3 rounded-xl border border-neutral-800 bg-neutral-900/85 shadow-sm"
                  >
                    <Badge
                      className={`capitalize px-3 py-1 rounded-full text-sm ${
                        it.type === "goal"
                          ? "bg-cyan-800 text-cyan-100"
                          : it.type === "practice"
                          ? "bg-emerald-800 text-emerald-100"
                          : "bg-violet-800 text-violet-100"
                      }`}
                    >
                      {it.type}
                    </Badge>
                    <div className="flex-1 leading-relaxed">{it.text}</div>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 items-center">
                      {/* Desktop: icon-only buttons */}
                      <div className="hidden md:flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onEdit(it)}
                          aria-label="Edit item"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => onDelete(it.id)}
                          aria-label="Delete item"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Mobile: compact overflow menu */}
                      <div className="md:hidden relative">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() =>
                            setOpenMenuId((prev) => (prev === it.id ? null : it.id))
                          }
                          aria-haspopup="true"
                          aria-expanded={openMenuId === it.id}
                          title="Actions"
                        >
                          <MoreHorizontal className="w-5 h-5" />
                        </Button>
                        {openMenuId === it.id && (
                          <div className="absolute right-0 mt-2 w-36 z-30 bg-card text-card-foreground rounded-md border shadow-md py-1">
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-accent/5"
                              onClick={() => {
                                setOpenMenuId(null);
                                onEdit(it);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              className="w-full text-left px-3 py-2 text-sm hover:bg-accent/5 text-destructive"
                              onClick={() => {
                                setOpenMenuId(null);
                                onDelete(it.id);
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

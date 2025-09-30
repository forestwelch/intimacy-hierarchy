"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import Pyramid from "./Pyramid";
import Detail from "./Detail";
import ItemEditor from "./ItemEditor";
import { seedLevels } from "./data";
import { Button } from "@/components/ui/button";
import { Level, EditorState, Item } from "./types";

export default function IntimacyHierarchy() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [openId, setOpenId] = useState<string | null>("physiology");
  const [editor, setEditor] = useState<EditorState>({ open: false });

  useEffect(() => {
    const raw = localStorage.getItem("intimacy-hierarchy-state-v1");
    if (raw) {
      try {
        const parsed = JSON.parse(raw) as Level[];
        const sanitized = parsed.filter((l) => l.id !== "exploration");
        setLevels(sanitized.length ? sanitized : seedLevels);
      } catch {
        setLevels(seedLevels);
      }
    } else setLevels(seedLevels);
  }, []);

  useEffect(() => {
    if (levels.length)
      localStorage.setItem(
        "intimacy-hierarchy-state-v1",
        JSON.stringify(levels)
      );
  }, [levels]);

  const currentLevel = useMemo(
    () => levels.find((l) => l.id === openId) || null,
    [levels, openId]
  );

  const upsertItem = (levelId: string, item: Item) =>
    setLevels((prev) =>
      prev.map((l) =>
        l.id === levelId
          ? {
              ...l,
              items: l.items.some((i) => i.id === item.id)
                ? l.items.map((i) => (i.id === item.id ? item : i))
                : [item, ...l.items],
            }
          : l
      )
    );

  const deleteItem = (levelId: string, itemId: string) =>
    setLevels((prev) =>
      prev.map((l) =>
        l.id === levelId
          ? { ...l, items: l.items.filter((i) => i.id !== itemId) }
          : l
      )
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-900 to-neutral-800 text-neutral-100">
      <header className="sticky top-0 z-30 backdrop-blur-sm border-b border-neutral-800 bg-neutral-900/95">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-center">
            Intimacy Hierarchy
          </h1>
          <div>
            <Button
              variant="secondary"
              onClick={() => {
                const KEY = "intimacy-hierarchy-state-v1";
                try {
                  localStorage.removeItem(KEY);
                } catch {}
                setLevels(seedLevels);
                setOpenId("physiology");
              }}
              className="bg-neutral-800 text-neutral-100 border-neutral-700"
            >
              Reset
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-[1400px] mx-auto px-8 py-10 grid md:grid-cols-6 gap-10">
        <motion.div
          layout
          className="md:col-span-2 flex items-start justify-center"
        >
          <div className="w-full flex items-center justify-center py-6">
            <Pyramid levels={levels} openId={openId} onSelect={setOpenId} />
          </div>
        </motion.div>

        <motion.div layout className="md:col-span-4 min-h-[420px]">
          <Detail
            level={currentLevel}
            onEdit={(it) =>
              setEditor({
                open: true,
                levelId: currentLevel?.id,
                item: it ?? null,
                mode: it ? "edit" : "create",
              })
            }
            onDelete={(id) => deleteItem(currentLevel!.id, id)}
          />
        </motion.div>
      </main>

      <ItemEditor editor={editor} setEditor={setEditor} onSave={upsertItem} />
    </div>
  );
}

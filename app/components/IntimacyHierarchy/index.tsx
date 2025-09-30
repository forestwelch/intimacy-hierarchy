"use client";
import React, { useEffect, useMemo, useState } from "react";
import Pyramid from "./Pyramid";
import Detail from "./Detail";
import ItemEditor from "./ItemEditor";
import { seedLevels } from "./data";
import { Level, EditorState, Item } from "./types";

export default function IntimacyHierarchy() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [openId, setOpenId] = useState<string | null>("physiology");
  const [editor, setEditor] = useState<EditorState>({ open: false });

  useEffect(() => {
    const raw = localStorage.getItem("intimacy-hierarchy-state-v1");
    if (raw) setLevels(JSON.parse(raw));
    else setLevels(seedLevels);
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
    <div className="min-h-screen bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-20 backdrop-blur border-b border-white/10 bg-white/50 dark:bg-neutral-900/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Intimacy Hierarchy
          </h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-5 gap-4">
        <Pyramid levels={levels} openId={openId} onSelect={setOpenId} />
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
      </main>

      <ItemEditor editor={editor} setEditor={setEditor} onSave={upsertItem} />
    </div>
  );
}

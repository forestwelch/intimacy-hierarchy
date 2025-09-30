"use client";
import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Sparkles,
  Anchor,
  Users,
  Flame,
  HeartHandshake as HeartHanded,
} from "lucide-react";

const getIcon = (id: string) => {
  switch (id) {
    case "anchor":
      return <Anchor className="w-5 h-5" />;
    case "users":
      return <Users className="w-5 h-5" />;
    case "flame":
      return <Flame className="w-5 h-5" />;
    case "heart":
      return <HeartHanded className="w-5 h-5" />;
    case "sparkles":
    default:
      return <Sparkles className="w-5 h-5" />;
  }
};

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

interface Item {
  id: string;
  type: "insight" | "goal" | "practice";
  text: string;
}

interface Level {
  id: string;
  // store icon as a small id so we never persist React elements to localStorage
  icon: string;
  title: string;
  subtitle?: string;
  color: string;
  colorTo: string;
  description: string;
  items: Item[];
}

const seedLevels: Level[] = [
  {
    id: "physiology",
    icon: "anchor",
    title: "1 · Physiology & Safety",
    subtitle: "Body first",
    color: "from-slate-900",
    colorTo: "to-slate-700",
    description:
      "Feeling safe, supported, and regulated enough to engage with intimacy without spiraling.",
    items: [
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Sleep 7–9h; morning light; hydration ritual.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Yoga + kettlebell 3x/week; gentle mobility on off days.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Daily pain plan: breath, heat/ice, stretches; track flare triggers.",
      },
      {
        id: crypto.randomUUID(),
        type: "insight",
        text: "Create a private, judgment-free space for self-touch & erotic exploration.",
      },
    ],
  },
  {
    id: "emotional",
    icon: "heart",
    title: "2 · Emotional Security & Trust",
    subtitle: "Self-trust, boundaries",
    color: "from-rose-900",
    colorTo: "to-pink-700",
    description:
      "Feeling anchored enough to explore desire without fear or collapse.",
    items: [
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Daily desire check-in (journal/voice): name wants without judgment.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Yes/No calibration: pause, breathe, body-scan before commitments.",
      },
      {
        id: crypto.randomUUID(),
        type: "goal",
        text: "Build a desire map: solo, with others, emotional, kink curiosities.",
      },
      {
        id: crypto.randomUUID(),
        type: "insight",
        text: "My needs are worthy; I can change my mind mid-scene/date.",
      },
    ],
  },
  {
    id: "relational",
    icon: "users",
    title: "3 · Relational Connection",
    subtitle: "Exploration with others",
    color: "from-indigo-900",
    colorTo: "to-indigo-700",
    description:
      "Safe, shame-free, consensual connection for touch, sex, and play.",
    items: [
      {
        id: crypto.randomUUID(),
        type: "goal",
        text: "Find 1–2 low-pressure partners (FWB/cuddle buddy/play) aligned on clarity + pace.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Name boundaries & aftercare needs explicitly; schedule check-ins.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Experiment safely: ability to slow down, take breaks, stop.",
      },
      {
        id: crypto.randomUUID(),
        type: "insight",
        text: "Pipeline mindset: more than one outlet → less projection on any one person.",
      },
    ],
  },
  {
    id: "intimacy",
    icon: "flame",
    title: "4 · Deep Intimacy",
    subtitle: "Integration & expression",
    color: "from-amber-900",
    colorTo: "to-orange-700",
    description:
      "Freedom to express sexuality fully, with or without a partner, without pressure.",
    items: [
      {
        id: crypto.randomUUID(),
        type: "goal",
        text: "Cultivate a longer-term partner/partners aligned on values & pace.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Celebrate others’ experiences as inspiration, not comparison.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Weave sensual rituals into daily life; art/creativity after scenes/dates.",
      },
    ],
  },
  {
    id: "exploration",
    icon: "sparkles",
    title: "Bonus · Topping/Bottoming Reboot",
    subtitle: "Skills refresh",
    color: "from-emerald-900",
    colorTo: "to-emerald-700",
    description:
      "Structured re-entry into topping & bottoming after time away.",
    items: [
      {
        id: crypto.randomUUID(),
        type: "goal",
        text: "List 3 topping scenes & 3 bottoming scenes I want to try again.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Solo skill drills: rope knots, impact rhythms, dirty talk, receiving practice.",
      },
      {
        id: crypto.randomUUID(),
        type: "practice",
        text: "Attend a consent/kink workshop; schedule 1 guided practice session.",
      },
    ],
  },
];

const LS_KEY = "intimacy-hierarchy-state-v1";

type EditorState = {
  open: boolean;
  levelId?: string;
  item?: Item | null;
  mode?: "create" | "edit";
  defaultType?: Item["type"];
};

export default function IntimacyHierarchyApp() {
  const [levels, setLevels] = useState<Level[]>([]);
  const [openId, setOpenId] = useState<string | null>("physiology");
  const [editor, setEditor] = useState<EditorState>({ open: false });

  useEffect(() => {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) setLevels(JSON.parse(raw));
    else setLevels(seedLevels);
  }, []);

  useEffect(() => {
    if (levels.length) localStorage.setItem(LS_KEY, JSON.stringify(levels));
  }, [levels]);

  const currentLevel = useMemo(
    () => levels.find((l) => l.id === openId) || null,
    [levels, openId]
  );

  const upsertItem = (levelId: string, item: Item) => {
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
  };

  const deleteItem = (levelId: string, itemId: string) => {
    setLevels((prev) =>
      prev.map((l) =>
        l.id === levelId
          ? { ...l, items: l.items.filter((i) => i.id !== itemId) }
          : l
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-100 to-neutral-200 dark:from-neutral-900 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-20 backdrop-blur border-b border-white/10 bg-white/50 dark:bg-neutral-900/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            Intimacy Hierarchy
          </h1>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                const n = levels.length + 1;
                const id = `custom-${n}-${Date.now()}`;
                setLevels([
                  ...levels,
                  {
                    id,
                    icon: "sparkles",
                    title: `${n + 1} · New Level`,
                    subtitle: "Describe me",
                    color: "from-zinc-900",
                    colorTo: "to-zinc-700",
                    description: "Write a short description of this level.",
                    items: [],
                  },
                ]);
                setOpenId(id);
              }}
            >
              <Plus className="w-4 h-4 mr-1" /> Add Level
            </Button>
            <Button
              onClick={() => {
                localStorage.removeItem(LS_KEY);
                setLevels(seedLevels);
                setOpenId("physiology");
              }}
            >
              <Save className="w-4 h-4 mr-1" /> Reset
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 grid md:grid-cols-5 gap-4">
        <div className="md:col-span-2 space-y-3">
          {levels.map((lvl) => (
            <button
              key={lvl.id}
              onClick={() => setOpenId(lvl.id)}
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
                    <div className="font-semibold leading-tight">
                      {lvl.title}
                    </div>
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

        <div className="md:col-span-3">
          <AnimatePresence mode="wait">
            {currentLevel && (
              <motion.div
                key={currentLevel.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <Card className="rounded-2xl border-white/10 bg-white/80 dark:bg-neutral-900/70 backdrop-blur">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        <span
                          className={`inline-flex items-center justify-center rounded-xl p-2 text-white bg-gradient-to-br ${currentLevel.color} ${currentLevel.colorTo}`}
                        >
                          {getIcon(currentLevel.icon)}
                        </span>
                        {currentLevel.title}
                      </CardTitle>
                      <p className="mt-2 text-sm opacity-80">
                        {currentLevel.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={() =>
                          setEditor({
                            open: true,
                            levelId: currentLevel.id,
                            mode: "create",
                            defaultType: "goal",
                          })
                        }
                      >
                        <Plus className="w-4 h-4 mr-1" /> Add Item
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {currentLevel.items.map((it) => (
                        <li
                          key={it.id}
                          className="group flex items-start gap-3 p-3 rounded-xl border border-white/10 bg-white/60 dark:bg-neutral-800/60"
                        >
                          <Badge
                            className={`${
                              it.type === "goal"
                                ? "bg-amber-100 text-amber-800"
                                : it.type === "practice"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-sky-100 text-sky-800"
                            } capitalize`}
                          >
                            {it.type}
                          </Badge>
                          <div className="flex-1 leading-relaxed">
                            {it.text}
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() =>
                                setEditor({
                                  open: true,
                                  levelId: currentLevel.id,
                                  item: it,
                                  mode: "edit",
                                })
                              }
                            >
                              <Pencil className="w-4 h-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => deleteItem(currentLevel.id, it.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>

      <ItemEditor editor={editor} setEditor={setEditor} onSave={upsertItem} />

      <footer className="max-w-5xl mx-auto px-4 py-8 text-xs opacity-70">
        Tip: your data saves to your browser (localStorage). Deploy to Vercel
        for multi-device later.
      </footer>
    </div>
  );
}

function ItemEditor({
  editor,
  setEditor,
  onSave,
}: {
  editor: {
    open: boolean;
    levelId?: string;
    item?: Item | null;
    mode?: "create" | "edit";
    defaultType?: Item["type"];
  };
  setEditor: React.Dispatch<React.SetStateAction<EditorState>>;
  onSave: (levelId: string, item: Item) => void;
}) {
  const [text, setText] = useState("");
  const [type, setType] = useState<Item["type"]>(editor.defaultType ?? "goal");

  useEffect(() => {
    if (editor.item) {
      setText(editor.item.text);
      setType(editor.item.type);
    } else {
      setText("");
      setType(editor.defaultType ?? "goal");
    }
  }, [editor]);

  const close = () => setEditor({ open: false });

  const save = () => {
    if (!editor.levelId) return;
    const newItem: Item = {
      id: editor.item?.id ?? crypto.randomUUID(),
      type,
      text: text.trim(),
    };
    if (!newItem.text) return;
    onSave(editor.levelId, newItem);
    close();
  };

  return (
    <Dialog open={editor.open} onOpenChange={(o) => (o ? null : close())}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {editor.mode === "edit" ? (
              <Pencil className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
            {editor.mode === "edit" ? "Edit Item" : "Add Item"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["goal", "practice", "insight"] as const).map((t) => (
              <button
                key={t}
                className={`px-3 py-1 rounded-full text-sm border ${
                  type === t
                    ? "bg-black text-white dark:bg-white dark:text-black"
                    : "bg-transparent"
                }`}
                onClick={() => setType(t)}
              >
                {t}
              </button>
            ))}
          </div>
          <Textarea
            placeholder="Write the item..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="min-h-[120px]"
          />
        </div>
        <DialogFooter className="flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={close}>
            <X className="w-4 h-4 mr-1" /> Cancel
          </Button>
          <Button onClick={save}>
            <Save className="w-4 h-4 mr-1" /> Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

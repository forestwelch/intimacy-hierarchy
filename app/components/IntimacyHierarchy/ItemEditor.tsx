"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Item, EditorState } from "./types";

export default function ItemEditor({
  editor,
  setEditor,
  onSave,
}: {
  editor: EditorState;
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
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.18 }}
        >
          <DialogHeader>
            <DialogTitle>
              {editor.mode === "edit" ? "Edit Item" : "Add Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              {(["goal", "practice", "insight"] as const).map((t) => (
                <button
                  key={t}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors ${
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
              Cancel
            </Button>
            <Button onClick={save}>Save</Button>
          </DialogFooter>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}

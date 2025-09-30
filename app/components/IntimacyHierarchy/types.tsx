import React from "react";

export interface Item {
  id: string;
  type: "insight" | "goal" | "practice";
  text: string;
}

export interface Level {
  id: string;
  icon: string; // small id, not React element
  title: string;
  subtitle?: string;
  color: string;
  colorTo: string;
  description: string;
  items: Item[];
}

export type EditorState = {
  open: boolean;
  levelId?: string;
  item?: Item | null;
  mode?: "create" | "edit";
  defaultType?: Item["type"];
};

export default {} as typeof React;

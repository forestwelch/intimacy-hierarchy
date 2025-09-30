import React from "react";
import {
  Anchor,
  Users,
  Flame,
  Sparkles,
  HeartHandshake as HeartHanded,
} from "lucide-react";

export const getIcon = (id: string) => {
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

export default getIcon;

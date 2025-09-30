import { Level } from "./types";
import rawSeed from "@/data/seedLevels.json";

// re-export with proper typing
export const seedLevels: Level[] = rawSeed as Level[];

"use client";

import LevelCard from "@/components/level-card/level-card";
import { getProgress } from "@/utils/progress";

const levels = ["n5", "n4", "n3", "n2", "n1"];
const levelColors = {
  n5: "bg-green-300",
  n4: "bg-blue-300",
  n3: "bg-purple-300",
  n2: "bg-orange-300",
  n1: "bg-red-300",
};

export default function Home() {
  const progress = getProgress();

  return (
    <div className="grid grid-cols-2 gap-4 p-6">
      {levels.map(level => (
        <LevelCard
          key={level}
          level={level}
          locked={!progress.unlockedLevels.includes(level)}
          color={levelColors[level] ?? "bg-gray-300"}
        />
      ))}
    </div>
  );
}

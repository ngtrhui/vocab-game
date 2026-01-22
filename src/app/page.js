"use client";

import { useEffect, useState } from "react";
import LevelCard from "@/components/level-card/level-card";
import { getProgress } from "@/utils/progress";

const LEVEL_COLORS = {
  n5: "bg-[#2E5B4F]",
  n4: "bg-[#3E5F8A]",
  n3: "bg-[#6A3FA0]",
  n2: "bg-[#9B3922]",
  n1: "bg-[#7A0E0E]",
};

export default function Home() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  const levels = ["n5", "n4", "n3", "n2", "n1"];

  if (!progress) {
    return (
      <div className="grid grid-cols-3 text-[#F5F3F0] gap-6 p-10">
        {levels.map((level) => (
          <LevelCard
            key={level}
            level={level}
            locked
            color={LEVEL_COLORS[level]}
            skeleton
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-10">
      {levels.map((level) => (
        <LevelCard
          key={level}
          level={level}
          locked={!progress.unlockedLevels.includes(level)}
          color={LEVEL_COLORS[level]}
        />
      ))}
    </div>
  );
}

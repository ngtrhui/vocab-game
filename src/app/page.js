"use client";

import { useEffect, useState } from "react";
import LevelCard from "@/components/level-card/level-card";
import { getProgress } from "@/utils/progress";

export default function Home() {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    setProgress(getProgress());
  }, []);

  if (!progress) {
    return (
      <div className="grid grid-cols-3 gap-6 p-10">
        {["n5", "n4", "n3", "n2", "n1"].map((level) => (
          <LevelCard
            key={level}
            level={level}
            locked={true}
            color="bg-gray-500"
            skeleton
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-6 p-10">
      {["n5", "n4", "n3", "n2", "n1"].map((level) => (
        <LevelCard
          key={level}
          level={level}
          locked={!progress.unlockedLevels.includes(level)}
          color="bg-blue-300"
        />
      ))}
    </div>
  );
}

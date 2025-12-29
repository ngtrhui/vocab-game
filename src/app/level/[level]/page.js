"use client";

import React from "react";
import Link from "next/link";
import { getLevelData } from "@/services/vocabularyService";
import { getProgress } from "@/utils/progress";

export default function LevelPage({ params }) {
    const { level } = React.use(params);
    const data = getLevelData(level);
    const progress = getProgress();

    const isUnlocked = progress.unlockedLevels.includes(level);


    const unlockedStage = progress.progress[level]?.unlockedStage || 1;

    return (
        <div className="p-6 text-black">
            <h1 className="text-2xl font-bold mb-4">
                {level.toUpperCase()}
            </h1>

            <div className="grid grid-cols-5 gap-3">
                {Array.from({ length: data.totalStages }).map((_, i) => {
                    const stage = i + 1;
                    const locked = stage > unlockedStage;

                    return locked ? (
                        <div
                            key={stage}
                            className="border p-3 text-center bg-gray-600 opacity-40 rounded"
                        >
                            {stage}
                        </div>
                    ) : (
                        <Link
                            key={stage}
                            href={`/game/${level}/${stage}`}
                        >
                            <div className="border p-3 text-center cursor-pointer hover:bg-indigo-500 hover:text-white rounded transition">
                                {stage}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

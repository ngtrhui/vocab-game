"use client";

import React from "react";
import Link from "next/link";
import { getLevelData } from "@/services/vocabularyService";
import { getProgress } from "@/utils/progress";

export default function LevelPage({ params }) {
    const { level } = React.use(params);
    const data = getLevelData(level);
    const progress = getProgress();

    const unlockedStage = progress.progress[level]?.unlockedStage || 0;

    return (
        <div className="p-6 text-black">
            <h1>{level.toUpperCase()}</h1>

            <div className="grid grid-cols-5 text-black gap-2">
                {data.stages.map(stage => {
                    const locked = stage.stage > unlockedStage;

                    return locked ? (
                        <div
                            key={stage.stage}
                            className="border p-2 text-center bg-gray-600 opacity-40"
                        >
                            {stage.stage}
                        </div>
                    ) : (
                        <Link
                            key={stage.stage}
                            href={`/game/${level}/${stage.stage}`}
                        >
                            <div className="border p-2 text-center cursor-pointer">
                                {stage.stage}
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}

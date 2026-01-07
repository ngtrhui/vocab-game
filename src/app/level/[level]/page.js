"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLevelData } from "@/services/vocabularyService";
import { getProgress } from "@/utils/progress";
import * as STRING from "@/constant/strings";

export default function LevelPage({ params }) {
    const { level } = React.use(params);
    const router = useRouter();
    const data = getLevelData(level);
    const [progress, setProgress] = useState(null);

    useEffect(() => {
        setProgress(getProgress());
    }, []);

    if (!progress) {
        return (
            <div className="p-6 text-black">
                <h1 className="text-2xl font-bold mb-4">
                    {level.toUpperCase()}
                </h1>

                <div className="grid grid-cols-5 gap-3">
                    {Array.from({ length: data.totalStages }).map((_, i) => (
                        <div
                            key={i}
                            className="border p-3 text-center bg-gray-600 opacity-40 rounded"
                        >
                            {STRING.SCENE} {i + 1}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    const unlockedStage =
        progress.progress[level]?.unlockedStage || 1;

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
                            {STRING.SCENE} {stage}
                        </div>
                    ) : (
                        <button
                            key={stage}
                            onClick={() =>
                                router.replace(`/game/${level}/${stage}`)
                            }
                            className="border p-3 text-center cursor-pointer hover:bg-indigo-500 hover:text-white rounded transition w-full"
                        >
                            {STRING.SCENE} {stage}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

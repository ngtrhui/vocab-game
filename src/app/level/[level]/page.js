"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getLevelData } from "@/services/vocabularyService";
import { getProgress } from "@/utils/progress";
import * as STRING from "@/constant/strings";
import { StageNode } from "@/components/stage-node/stage-node";

export default function LevelPage({ params }) {
    const { level } = React.use(params);
    const router = useRouter();
    const data = getLevelData(level);

    const [progress, setProgress] = useState(null);
    const currentStageRef = useRef(null);

    useEffect(() => {
        setProgress(getProgress());
    }, []);

    useEffect(() => {
        if (!currentStageRef.current) return;

        const t = setTimeout(() => {
            currentStageRef.current.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
        }, 300);

        return () => clearTimeout(t);
    }, [progress]);

    if (!progress) return null;

    const unlockedStage =
        progress.progress[level]?.unlockedStage || 1;

    return (
        <div className="h-screen overflow-y-auto scroll-smooth bg-[#0D0B14] text-white">
            <h1 className="text-3xl font-extrabold mb-10 text-center">
                {level.toUpperCase()}
            </h1>

            <div className="relative mx-auto max-w-md py-12">
                <div className="absolute left-1/2 top-0 -translate-x-1/2 h-full w-[3px] bg-gradient-to-b from-transparent via-white/20 to-transparent rounded-full" />

                <div className="relative flex flex-col gap-6">
                    {Array.from({ length: data.totalStages }).map((_, i) => {
                        const stage = i + 1;
                        const align = stage % 2 === 1 ? "left" : "right";

                        let status = "locked";
                        if (stage < unlockedStage) status = "done";
                        if (stage === unlockedStage) status = "current";

                        return (
                            <StageNode
                                key={stage}
                                stage={stage}
                                status={status}
                                align={align}
                                ref={status === "current" ? currentStageRef : null}
                                onClick={() =>
                                    router.replace(`/game/${level}/${stage}`)
                                }
                            />
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

"use client";

import React, { forwardRef } from "react";
import HeroWizard from "@/components/hero/hero-wizard";

export const StageNode = forwardRef(
    ({ stage, status, align, onClick }, ref) => {

        const offsetMap = {
            left: ["-translate-x-10", "-translate-x-16", "-translate-x-12"],
            right: ["translate-x-10", "translate-x-16", "translate-x-12"],
        };

        const offset =
            offsetMap[align][stage % offsetMap[align].length];

        const heroOffsetMap = {
            left: "-translate-x-38",
            right: "translate-x-38",
        };

        const base ="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 border-2";

        const styles = {
            done: `bg-secondary border-2 border-primary shadow-[0_6px_18px_rgba(101,165,154,0.35)]`,
            current: `bg-primary shadow-[0_0_35px_rgba(101,165,154,0.85)]`,
            locked: `bg-secondary opacity-30 grayscale cursor-not-allowed`,
        };

        return (
            <div
                ref={ref}
                className="relative flex justify-center h-32"
            >
                {status === "current" && (
                    <div
                        className={` absolute top-1/2 -translate-y-1/2 z-10 pointer-events-none drop-shadow-[0_0_25px_rgba(101,165,154,0.9)]
              ${offset}
              ${heroOffsetMap[align]}
              `}
                    >
                        <HeroWizard />
                    </div>
                )}

                <button
                    disabled={status === "locked"}
                    onClick={onClick}
                    className={`absolute ${offset} ${base} ${styles[status]}`}
                >
                    <span
                        className={`absolute inset-0 flex items-center justify-center text-sm font-extrabold tracking-wide
              ${status === "current" ? "text-secondary" : "text-forty"}
            `}
                    >
                        {stage}
                    </span>

                    {status === "locked" && (
                        <span className=" absolute -top-2 -right-2  w-6 h-6 rounded-full  bg-secondary  text-forty text-xs  flex items-center justify-center  ring-2 ring-primary/40"
                        >
                            🔒
                        </span>
                    )}
                </button>
            </div>
        );
    }
);

StageNode.displayName = "StageNode";

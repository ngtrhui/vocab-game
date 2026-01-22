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

        const base =
            "w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer active:scale-95";

        const styles = {
            done: `
        bg-gradient-to-br from-[#3A2A4D] to-[#2A1E3A]
        shadow-[0_6px_18px_rgba(168,85,247,0.35)]
      `,
            current: `
        bg-gradient-to-br from-violet-400 to-fuchsia-500
        shadow-[0_0_35px_rgba(192,132,252,0.85)]
      `,
            locked: `
        bg-[#2A2236]
        opacity-40
        grayscale
        cursor-not-allowed
      `,
        };

        return (
            <div
                ref={ref}
                className="relative flex justify-center h-32"
            >
                {/* HERO */}
                {status === "current" && (
                    <div
                        className={`
              absolute top-1/2 -translate-y-1/2
              ${offset}
              ${heroOffsetMap[align]}
              z-10 pointer-events-none
              drop-shadow-[0_0_25px_rgba(192,132,252,0.8)]
            `}
                    >
                        <HeroWizard />
                    </div>
                )}

                {/* NODE */}
                <button
                    disabled={status === "locked"}
                    onClick={onClick}
                    className={`absolute ${offset} ${base} ${styles[status]}`}
                >
                    {/* STAGE NUMBER */}
                    <span
                        className={`
              absolute inset-0 flex items-center justify-center
              text-sm font-extrabold tracking-wide
              ${status === "current"
                                ? "text-[#1A1026]"
                                : "text-[#F5F3F0]"}
            `}
                    >
                        {stage}
                    </span>

                    {/* LOCK ICON */}
                    {status === "locked" && (
                        <span
                            className="
                absolute -top-2 -right-2
                w-6 h-6 rounded-full
                bg-[#1A1026]
                text-slate-300 text-xs
                flex items-center justify-center
                ring-2 ring-violet-500/30
                shadow-[0_0_10px_rgba(139,92,246,0.4)]
              "
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

"use client";

import { motion } from "framer-motion";
import * as STRING from "@/constant/strings";

export default function Boss({ hp, hit }) {
    return (
        <motion.div
            animate={
                hit
                    ? {
                        x: [0, -10, 10, -6, 6, 0],
                        scale: [1, 1.08, 1],
                        filter: [
                            "brightness(1)",
                            "brightness(1.8)",
                            "brightness(1)"
                        ]
                    }
                    : {}
            }
            transition={{ duration: 0.3 }}
            className="relative"
        >
            {/* HP BAR */}
            <div className="absolute -top-6 left-0 w-full text-center text-white text-sm">
                {STRING.BLOOD}: {hp}
            </div>

            {/* BODY */}
            <div className="w-64 h-36 bg-red-700 rounded-xl shadow-2xl border-4 border-red-900" />
        </motion.div>
    );
}

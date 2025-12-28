"use client";

import { motion } from "framer-motion";

export default function Boss({
    hp = 100,        // % máu (0 – 100)
    isHit = false,   // bị đánh
    isHeal = false,  // đang hồi máu
    isDead = false   // chết
}) {
    return (
        <motion.div
            className="relative flex flex-col items-center"
            animate={
                isHit
                    ? {
                        x: [0, -12, 12, -8, 8, 0],
                        filter: [
                            "brightness(1)",
                            "brightness(1.6)",
                            "brightness(1)"
                        ]
                    }
                    : isHeal
                        ? {
                            filter: [
                                "brightness(1)",
                                "brightness(1.4)",
                                "brightness(1)"
                            ]
                        }
                        : {}
            }
            transition={{ duration: 0.3 }}
        >
            {/* ================= HP BAR ================= */}
            <div className="absolute -top-6 w-48 h-3 bg-red-900 rounded overflow-hidden">
                <motion.div
                    className="h-full bg-red-500"
                    animate={{ width: `${hp}%` }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                />
            </div>

            {/* ================= BOSS BODY ================= */}
            {!isDead ? (
                <motion.div
                    className="
                        w-64 h-40
                        bg-red-600
                        rounded-xl
                        shadow-xl
                    "
                    animate={{
                        scale: isHit ? 1.06 : isHeal ? 1.03 : 1
                    }}
                    transition={{ duration: 0.25 }}
                />
            ) : (
                <motion.div
                    className="
                        w-64 h-40
                        bg-gray-600
                        rounded-xl
                    "
                    initial={{ scale: 1, opacity: 1 }}
                    animate={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.5 }}
                />
            )}
        </motion.div>
    );
}

"use client";
import { motion } from "framer-motion";

export default function Hero({ isAttacking }) {
    console.log("Hero isAttacking:", isAttacking);

    return (
        <motion.img
            src="/hero.png"
            className="w-32 bg-red-500"
            animate={{
                opacity: isAttacking ? 0 : 1,
            }}
            transition={{ duration: 0.15 }}
        />
    );
}

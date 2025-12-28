"use client";
import { motion } from "framer-motion";

export default function Hero({ isAttacking }) {
    return (
        <motion.img
            src="/hero.png"
            className="w-32"
            animate={{
                x: isAttacking ? 20 : 0,
                rotate: isAttacking ? -10 : 0,
            }}
            transition={{ type: "spring", stiffness: 400 }}
        />
    );
}

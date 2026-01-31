import { useRef, useEffect, useState } from "react";
import { useMotionValue, animate } from "framer-motion";

export default function useHeroController() {
    const HERO_START_X = 80;
    const heroX = useMotionValue(HERO_START_X);
    const heroAnimationRef = useRef(null);
    const [heroState, setHeroState] = useState("idle");

    const heroJumpAttack = (bossXValue, onHit) => {
        heroAnimationRef.current?.stop();

        const heroTargetX = -(0 - bossXValue + 80);

        heroAnimationRef.current = animate(heroX, heroTargetX, {
            duration: 0.3,
            ease: "easeOut",
            onComplete: () => {
                setHeroState(
                    ["attack1", "attack2", "attack3"][
                    Math.floor(Math.random() * 3)
                    ]
                );

                onHit?.();

                setTimeout(() => {
                    heroAnimationRef.current = animate(heroX, HERO_START_X, {
                        duration: 0.35,
                        ease: "easeInOut",
                        onComplete: () => setHeroState("idle"),
                    });
                }, 250);
            },
        });
    };

    return { heroX, heroState, setHeroState, heroJumpAttack };
}

let bgm = null;

export function playBGM(src, volume = 0.3) {
    if (typeof window === "undefined") return;

    if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
    }

    bgm = new Audio(src);
    bgm.loop = true;
    bgm.volume = volume;
    bgm.play().catch(() => { });
}

export function stopBGM() {
    if (!bgm) return;
    bgm.pause();
    bgm.currentTime = 0;
}

export function playSFX(src, volume = 0.6) {
    if (typeof window === "undefined") return;

    const sfx = new Audio(src);
    sfx.volume = volume;
    sfx.play().catch(() => { });
}

const DEFAULT_PROGRESS = {
    currentLevel: "n5",
    unlockedLevels: ["n5"],
    progress: {
        n5: { unlockedStage: 1, completedStages: [] },
        n4: { unlockedStage: 0, completedStages: [] },
        n3: { unlockedStage: 0, completedStages: [] },
        n2: { unlockedStage: 0, completedStages: [] },
        n1: { unlockedStage: 0, completedStages: [] }
    }
};

export function getProgress() {
    if (typeof window === "undefined") return DEFAULT_PROGRESS;

    const saved = localStorage.getItem("vocab-progress");
    return saved ? JSON.parse(saved) : DEFAULT_PROGRESS;
}

export function saveProgress(data) {
    localStorage.setItem("vocab-progress", JSON.stringify(data));
}

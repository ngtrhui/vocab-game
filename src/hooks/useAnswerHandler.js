import { useRef } from "react";

export default function useAnswerHandler(answerResult, heroJumpAttack, getBossX, setCorrectCount, resetBoss) {
    const lastAnswerId = useRef(null);

    useEffect(() => {
        if (!answerResult) return;
        if (answerResult.id === lastAnswerId.current) return;
        lastAnswerId.current = answerResult.id;

        if (answerResult.correct) {
            setCorrectCount(c => {
                heroJumpAttack(getBossX());
                return c + 1;
            });
        } else {
            resetBoss();
        }
    }, [answerResult]);
}

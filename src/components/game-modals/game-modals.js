import OptionsModal from "@/components/options-modal/options-modal";
import * as STRING from "@/constant/strings";

export default function GameModals({
    type,
    onContinue,
    onRestart,
    onExit,
    onNext,
}) {
    if (!type) return null;

    if (type === "pause") {
        return (
            <OptionsModal
                title={`⏸ ${STRING.PAUSE}`}
                description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                options={[
                    { label: STRING.CONTINUE, onClick: onContinue },
                    { label: STRING.OUT, onClick: onExit },
                ]}
            />
        );
    }

    if (type === "fail") {
        return (
            <OptionsModal
                title={STRING.INCORRECT_ANSWER}
                description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                options={[
                    { label: STRING.START_AGAIN, onClick: onRestart },
                    { label: STRING.OUT, onClick: onExit },
                ]}
            />
        );
    }

    if (type === "next") {
        return (
            <OptionsModal
                title={STRING.COMPLETE}
                description={STRING.WHAT_DO_YOU_WANT_TO_DO_NEXT}
                options={[
                    { label: STRING.CONTINUE, onClick: onNext },
                    { label: STRING.OUT, onClick: onExit },
                ]}
            />
        );
    }
}

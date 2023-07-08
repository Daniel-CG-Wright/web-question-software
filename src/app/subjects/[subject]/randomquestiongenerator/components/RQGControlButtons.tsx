"use client"
import BaseButton from "@/components/BaseButton"

// Buttons for the RQG (Random Question Generator) component
// including next and previous buttons.

interface RQGControlButtonsProps {
    onClickGenerate: () => void;
    onClickNext: () => void;
    onClickPrevious: () => void;
    // whether the previous and next buttons should be disabled
    disablePrevious: boolean;
    disableNext: boolean;
    disableGenerate?: boolean;
}

/**
 * This class has 3 buttons - generate, previous and next
 */
const RQGControlButtons: React.FC<RQGControlButtonsProps> = ({
    onClickGenerate,
    onClickNext,
    onClickPrevious,
    disablePrevious,
    disableNext,
    disableGenerate = false,
}) => {

    return (
        <div className="flex space-x-4">
            <BaseButton
                text="Generate new pool"
                onClick={onClickGenerate}
                enabled={!disableGenerate}
            />
            <BaseButton
                text="Previous"
                onClick={onClickPrevious}
                enabled={!disablePrevious}
            />
            <BaseButton
                text="Next"
                onClick={onClickNext}
                enabled={!disableNext}
            />
        </div>
    )

}

export default RQGControlButtons;

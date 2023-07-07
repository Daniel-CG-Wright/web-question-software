"use client"
import BaseButton from "@/components/BaseButton"

// Buttons for the RQG (Random Question Generator) component
// including next and previous buttons.

interface RQGControlButtonsProps {
    onClickGenerate: () => void;
    onClickNext: () => void;
    onClickPrevious: () => void;
}

/**
 * This class has 3 buttons - generate, previous and next
 */
const RQGControlButtons: React.FC<RQGControlButtonsProps> = ({
    onClickGenerate,
    onClickNext,
    onClickPrevious,
}) => {

    return (
        <div className="flex space-x-4">
            <BaseButton
                text="Generate new pool"
                onClick={onClickGenerate}
            />
            <BaseButton
                text="Previous"
                onClick={onClickPrevious}
            />
            <BaseButton
                text="Next"
                onClick={onClickNext}
            />
        </div>
    )

}

export default RQGControlButtons;

"use client"
import BaseButton from "@/components/BaseButton"

// Buttons for the RQG (Random Question Generator) component
// including next and previous buttons.

interface RQGControlButtonsProps {
    onClickNext: () => void;
    onClickPrevious: () => void;
}

/**
 * This class has 2 buttons - previous and next
 */
const RQGControlButtons: React.FC<RQGControlButtonsProps> = ({
    onClickNext,
    onClickPrevious,
}) => {

    return (
        <div className="flex space-x-4">
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

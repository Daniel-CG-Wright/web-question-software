"use client"
import SliderToggle from "@/components/SliderInput";
import exp from "constants";

interface QuestionHeaderProps {
    selectedQuestionCode: string;
    displayAsImages: boolean;
    setDisplayAsImages: (displayAsImages: boolean) => void;
    displayMarkscheme: boolean;
    setDisplayMarkscheme: (displayMarkscheme: boolean) => void;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
    selectedQuestionCode,
    displayAsImages,
    setDisplayAsImages,
    displayMarkscheme,
    setDisplayMarkscheme,
}) => {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center">
                <h1 className="text-2xl font-bold text-white">Question {selectedQuestionCode}</h1>
                <SliderToggle
                    left="Display as images"
                    right="Display as text"
                    checkedValue={displayAsImages}
                    onChange={setDisplayAsImages}
                />
                <SliderToggle
                    left="Display question"
                    right="Display markscheme"
                    checkedValue={displayMarkscheme}
                    onChange={setDisplayMarkscheme}
                />
            </div>
        </div>
    );
}

export default QuestionHeader;

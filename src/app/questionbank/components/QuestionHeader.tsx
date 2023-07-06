"use client"
import StandardToggles from "@/components/StandardToggles";

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
                <StandardToggles
                    displayMarkscheme={displayMarkscheme}
                    setDisplayMarkscheme={setDisplayMarkscheme}
                    displayAsImages={displayAsImages}
                    setDisplayAsImages={setDisplayAsImages}
                />
            </div>
        </div>
    );
}

export default QuestionHeader;

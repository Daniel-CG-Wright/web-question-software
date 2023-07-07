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
        <div className="flex flex-row justify-between items-center w-full place-content-center mx-0">
            
            <h1 className="sm:text-xl text-lg text-white">{selectedQuestionCode}</h1>

            <StandardToggles
                displayMarkscheme={displayMarkscheme}
                setDisplayMarkscheme={setDisplayMarkscheme}
                displayAsImages={displayAsImages}
                setDisplayAsImages={setDisplayAsImages}
            />
        </div>
    );
}

export default QuestionHeader;

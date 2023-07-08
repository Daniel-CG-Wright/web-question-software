"use client"
import StandardToggles from "@/components/StandardToggles";
import { OutputData } from "@/types";

interface QuestionHeaderProps {
    outputData: OutputData;
    displayAsImages: boolean;
    setDisplayAsImages: (displayAsImages: boolean) => void;
    displayMarkscheme: boolean;
    setDisplayMarkscheme: (displayMarkscheme: boolean) => void;
}

const QuestionHeader: React.FC<QuestionHeaderProps> = ({
    outputData,
    displayAsImages,
    setDisplayAsImages,
    displayMarkscheme,
    setDisplayMarkscheme,
}) => {
    let questionCode = "";
    if (outputData.paperData.subject != "")
    {
        // if the subject is not empty, then we create the question code
        // question code is paper: (paper level) level (paper subject) (paper year) (paper component), question (question number)
        questionCode = `${outputData.paperData.level} ${outputData.paperData.subject.toUpperCase()} ${outputData.paperData.year} ${outputData.paperData.component.toUpperCase()}, Question ${outputData.questionNumber}`;
    }
    else
    {
        // if the subject is empty, then we just return an empty string
        questionCode = "";
    }
    return (
        <div className="flex flex-row justify-between items-center w-full place-content-center mx-0">
            
            <h1 className="sm:text-xl text-lg text-white">{questionCode}</h1>

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

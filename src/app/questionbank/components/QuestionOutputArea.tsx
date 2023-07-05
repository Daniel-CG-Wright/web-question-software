"use client"
import QuestionHeader from "./QuestionHeader";
import OutputView from "@/components/OutputItem";
import React, { useState, useEffect, use } from "react";

interface QuestionOutputAreaProps {
    selectedQuestionCode: string;
    // will either be question/ms text or image paths
    dataToDisplay: string[];
}

const QuestionOutputArea: React.FC<QuestionOutputAreaProps> = ({
    selectedQuestionCode,
    dataToDisplay,
}) => {
    const [displayAsImages, setDisplayAsImages] = useState(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState(false);

        
    return (
        <div className="flex flex-col h-full">
            <QuestionHeader
                selectedQuestionCode={selectedQuestionCode}
                displayAsImages={displayAsImages}
                setDisplayAsImages={setDisplayAsImages}
                displayMarkscheme={displayMarkscheme}
                setDisplayMarkscheme={setDisplayMarkscheme}
            />
            <OutputView items={dataToDisplay} isImage={displayAsImages} />
        </div>
    );
}

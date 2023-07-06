"use client"
import React, { useEffect, useState } from "react";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import RQGControlButtons from "./RQGControlButtons";
import RQGInfo from "./RQGinfoComponent";
import OutputView from "@/components/OutputItem";
import StandardToggles from "@/components/StandardToggles";

interface RandomQuestionGeneratorProps {
    questionPool: Question[];
}

const RandomQuestionGenerator: React.FC<RandomQuestionGeneratorProps> = ({
    questionPool,
}) => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [selectedMinMarks, setSelectedMinMarks] = useState<number>(0);
    const [selectedMaxMarks, setSelectedMaxMarks] = useState<number>(20);
    const [displayAsImages, setDisplayAsImages] = useState<boolea
    const [displayMarkscheme, setDisplayMarkscheme] = useState<boolean>(false);

    return (
        <div className="flex flex-col space-y-4">
            <SearchComponentCollection
                topics={topics}
                selectedTopics={selectedTopic}
                setSelectedTopics={setSelectedTopic}
                value=""
                setValue={() => {}}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                levels={levels}
                components={components}
                includeSearchBar={false}
            />
            <RQGControlButtons
                onClickNext={onClickNext}
                onClickPrevious={onClickPrevious}
            />
            <RQGInfo
                numQuestions={numQuestions}
                totalMarks={totalMarks}
            />
            <StandardToggles
                displayAsImages={displayAsImages}
                displayMarkscheme={displayMarkscheme}
                setDisplayAsImages={setDisplayAsImages}
                setDisplayMarkscheme={setDisplayMarkscheme}
            />
            <OutputView
                outputData={outputData}
                displayAsImages={displayAsImages}
                displayMarkscheme={displayMarkscheme}
            />
        </div>
    )
    )
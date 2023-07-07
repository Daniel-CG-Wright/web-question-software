"use client"
import React, { useEffect, useState } from "react";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import RQGControlButtons from "./RQGControlButtons";
import RQGInfo from "./RQGinfoComponent";
import OutputView from "@/components/OutputItem";
import StandardToggles from "@/components/StandardToggles";
import { Question } from "@/types";

interface RandomQuestionGeneratorProps {
    questionPool: Question[];
    topics: string[];
    levels: string[];
    components: string[];
}

const RandomQuestionGenerator: React.FC<RandomQuestionGeneratorProps> = ({
    questionPool,
    topics,
    levels,
    components,
}) => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [selectedMinMarks, setSelectedMinMarks] = useState<number>(0);
    const [selectedMaxMarks, setSelectedMaxMarks] = useState<number>(20);
    const [displayAsImages, setDisplayAsImages] = useState<boolean>(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState<boolean>(false);
    const [outputData, setOutputData] = useState<Question[]>([]);
    const [numQuestions, setNumQuestions] = useState<number>(0);
    const [totalMarks, setTotalMarks] = useState<number>(0);


    return (
        <div className="flex flex-col space-y-4">
            <SearchComponentCollection
                topics={topics}
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
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
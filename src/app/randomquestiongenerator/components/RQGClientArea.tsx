"use client"
import React, { useEffect, useState } from "react";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import RQGControlButtons from "./RQGControlButtons";
import RQGInfo from "./RQGinfoComponent";
import OutputView from "@/components/OutputItem";
import StandardToggles from "@/components/StandardToggles";
import { OutputData, RQGQuestionData } from "@/types";
import { useRouter } from "next/router";
import { useDebounce } from "@/hooks/useDebounce";
import getRQGData from "@/actions/getRQGData";

interface RandomQuestionGeneratorProps {
    // array of question IDs
    questionPool: RQGQuestionData[];
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
    const [numQuestions, setNumQuestions] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);

    const totalMarks = questionPool.reduce((acc, curr) => acc + curr.questionMarks, 0);

    const onClickGenerate = () => {
        // call a server action to get a new question pool
        searchParams = 
    }

    const onClickNext = () => {
        if (currentQuestion < numQuestions - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const onClickPrevious = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    // get the output data from the
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
                onClickGenerate={onClickGenerate}
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
                isImage={displayAsImages}
                displayMarkscheme={displayMarkscheme}
            />
        </div>
    );
}
"use client"
import React, { useEffect, useState } from "react";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import RQGControlButtons from "./RQGControlButtons";
import RQGInfo from "./RQGinfoComponent";
import OutputView from "@/components/OutputItem";
import QuestionHeader from "@/components/QuestionHeader";
import { OutputData } from "@/types";
import { useRouter } from "next/router";
import qs from "query-string";


// the question pool is handled on the server, we just feed through
// individual questions to the client, and the client sends search criteria
// to the server to get a new question pool.
interface RandomQuestionGeneratorProps {
    // number of questions in the question pool
    numQuestions: number;
    currentQuestionData: OutputData;
    // total marks of remaining questions
    totalMarks: number;
    topics: string[];
    levels: string[];
    components: string[];
}

const RandomQuestionGenerator: React.FC<RandomQuestionGeneratorProps> = ({
    numQuestions,
    currentQuestionData,
    totalMarks,
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
    const [currentQuestionNum, setCurrentQuestionNum] = useState<number>(0);
    const router = useRouter();

    useEffect(() => {
        let query = {
            topics: selectedTopics,
            level: selectedLevel,
            component: selectedComponent,
            minMarks: selectedMinMarks,
            maxMarks: selectedMaxMarks,
            currentQuestionNum: currentQuestionNum
        };

        const url = qs.stringifyUrl({
            url: "/randomquestiongenerator",
            query: query,
        });

        router.push(url);
    }, [selectedTopics, selectedLevel, selectedComponent, selectedMinMarks, selectedMaxMarks, currentQuestionNum]);

    const onClickGenerate = () => {
        // call a server action to get a new question pool
        // and reset the current question number to 0
        setCurrentQuestionNum(0);
        let query = {
            topics: selectedTopics,
            level: selectedLevel,
            component: selectedComponent,
            minMarks: selectedMinMarks,
            maxMarks: selectedMaxMarks,
            currentQuestionNum: currentQuestionNum
        };

        const url = qs.stringifyUrl({
            url: "/randomquestiongenerator",
            query: query,
        });

        router.push(url);

    }

    const onClickNext = () => {
        if (currentQuestionNum < numQuestions - 1) {
            setCurrentQuestionNum(currentQuestionNum + 1);
        }
    };

    const onClickPrevious = () => {
        if (currentQuestionNum > 0) {
            setCurrentQuestionNum(currentQuestionNum - 1);
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
            <QuestionHeader
                outputData={currentQuestionData}
                displayAsImages={displayAsImages}
                displayMarkscheme={displayMarkscheme}
                setDisplayAsImages={setDisplayAsImages}
                setDisplayMarkscheme={setDisplayMarkscheme}
            />
            <OutputView
                outputData={currentQuestionData}
                isImage={displayAsImages}
                displayMarkscheme={displayMarkscheme}
            />
        </div>
    );
}

export default RandomQuestionGenerator;

"use client"
import React, { useEffect, useState } from "react";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import RQGControlButtons from "./RQGControlButtons";
import RQGInfo from "./RQGinfoComponent";
import OutputView from "@/components/OutputItem";
import QuestionHeader from "@/components/QuestionHeader";
import { OutputData, RQGQuestionData, SearchCriteria } from "@/types";
import { shuffleArray } from "@/server-util/helpers";
import { getOutputData, searchQuestions } from "@/app/Actions";


interface RandomQuestionGeneratorProps {
    topics: string[];
    levels: string[];
    components: string[];
    subject: number;
}

const RandomQuestionGenerator: React.FC<RandomQuestionGeneratorProps> = ({
    topics,
    levels,
    components,
    subject,
}) => {
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedLevel, setSelectedLevel] = useState<string>("");
    const [selectedComponent, setSelectedComponent] = useState<string>("");
    const [selectedMinMarks, setSelectedMinMarks] = useState<number>(0);
    const [selectedMaxMarks, setSelectedMaxMarks] = useState<number>(20);
    const [displayAsImages, setDisplayAsImages] = useState<boolean>(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState<boolean>(false);
    const [currentQuestionNum, setCurrentQuestionNum] = useState<number>(0);
    const [questionPool, setQuestionPool] = useState<RQGQuestionData[]>([]);
    // convenience triggers, may affect performance
    const [generateQuestionTrigger, setGenerateQuestionTrigger] = useState<boolean>(false);
    const [isGenerateEnabled, setIsGenerateEnabled] = useState<boolean>(true);
    const [outputData, setOutputData] = useState<OutputData>({
        text: {
            questionContents: "",
            markschemeContents: "",
        },
        images: [],
        paperData: {
            year: "",
            component: "",
            level: "",
        },
        totalMarks: 0,
        questionNumber: -1,
    });


    const numQuestions = questionPool.length;
    let questionsRemaining = numQuestions - currentQuestionNum;
    
    // calculate the total marks of the remaining questions
    // in the question pool
    let totalMarks = 0;
    questionPool.slice(currentQuestionNum).forEach((question) => {
        totalMarks += question.questionMarks;
    });

    useEffect(() => {
        // if any of the search criteria change, then enable the generate question button
        isGenerateEnabled || setIsGenerateEnabled(true);
    }, [selectedTopics, selectedLevel, selectedComponent, selectedMinMarks, selectedMaxMarks]);

    useEffect(() => {
        if (questionPool.length > 0 && currentQuestionNum >= 0) {
            getOutputData(questionPool[currentQuestionNum].questionID).then(
                (res) => {
                    setOutputData(res);
                }
            );
        }
    }, [currentQuestionNum, generateQuestionTrigger]);

    const onClickGenerate = () => {
        // call a server action to get a new question pool
        // and reset the current question number to 0
        
        let query: SearchCriteria = {
            topics: selectedTopics,
            level: selectedLevel,
            component: selectedComponent,
            minMarks: selectedMinMarks,
            maxMarks: selectedMaxMarks,
            id: -1,
            text: "",
            paperYear: "",
            searchInMarkscheme: false,
            subject: subject
        };

        // get question pool from server
        searchQuestions(query).then((res) => {
            // map the question objects to the RQGQuestionData type
            let questionPool: RQGQuestionData[] = res.map((question) => {
                return {
                    questionID: question.id,
                    questionMarks: question.marks,
                };
            });
            // random shuffle the question pool
            questionPool = shuffleArray(questionPool);
            setQuestionPool(questionPool);
            setCurrentQuestionNum(0);
            setGenerateQuestionTrigger(!generateQuestionTrigger);
            setIsGenerateEnabled(false);
        }
        );
    };

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
        <div className="flex flex-col space-y-4 m-5">
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
                disableNext={currentQuestionNum >= numQuestions - 1}
                disablePrevious={currentQuestionNum <= 0}
                disableGenerate={!isGenerateEnabled}
            />
            <RQGInfo
                remainingQuestions={questionsRemaining}
                totalMarks={totalMarks}
            />
            <div className="flex justify-center">
            <div className="w-full max-w-full mx-5">
                <progress value={questionsRemaining} max={numQuestions} className="w-full h-4 bg-blue-500 text-white rounded-md shadow-sm" />
            </div>
            </div>
            <QuestionHeader
                outputData={outputData}
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

export default RandomQuestionGenerator;

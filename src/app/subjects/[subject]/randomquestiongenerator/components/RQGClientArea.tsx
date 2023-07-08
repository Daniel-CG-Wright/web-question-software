"use client"
import React, { useEffect, useState } from "react";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import RQGControlButtons from "./RQGControlButtons";
import RQGInfo from "./RQGinfoComponent";
import OutputView from "@/components/OutputItem";
import QuestionHeader from "@/components/QuestionHeader";
import { OutputData, RQGQuestionData, SearchCriteria } from "@/types";
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
    console.log("current question num: " + currentQuestionNum);
    
    // calculate the total marks of the remaining questions
    // in the question pool
    let totalMarks = 0;
    questionPool.slice(currentQuestionNum).forEach((question) => {
        totalMarks += question.questionMarks;
    });
    
    useEffect(() => {
        if (questionPool.length > 0 && currentQuestionNum >= 0) {
            // this gvies a warning adfter generate new pool is pressed.
            getOutputData(questionPool[currentQuestionNum].questionID).then(
                (res) => {
                    setOutputData(res);
                }
            );
        }
    }, [currentQuestionNum]);

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
            setQuestionPool(questionPool);
            setCurrentQuestionNum(0);
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

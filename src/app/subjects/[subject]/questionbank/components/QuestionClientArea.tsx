"use client"
import QuestionHeader from "@/components/QuestionHeader";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import {OutputData, Question, SearchCriteria, Components} from "@/types";
import QuestionTable from "./QuestionTable";
import OutputView from "@/components/OutputItem";
import { searchQuestions, getOutputData } from "@/app/Actions";


// base client area with all interactables.

interface QuestionOutputAreaProps {
    topics: string[];
    subject: number;
    levels: string[];
    components: Components;
    defaultMaxMarks: number;
}

const QuestionOutputArea: React.FC<QuestionOutputAreaProps> = ({
    topics,
    subject,
    levels,
    components,
    defaultMaxMarks
}) => {
    const [displayAsImages, setDisplayAsImages] = useState(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState(false);
    const router = useRouter();
    const [value, setValue] = useState("");
    const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedComponent, setSelectedComponent] = useState("");
    const [selectedID, setSelectedID] = useState(-1);
    const debouncedValue = useDebounce(value, 500);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [maxMarks, setMaxMarks] = useState(defaultMaxMarks);
    const [minMarks, setMinMarks] = useState(0);
    // use outputdata, setting a default value of an empty object
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

    // switch components if the level changes
    
    useEffect(() => {
        // if all the search criteria are default, then don't search
        let searchCriteria: SearchCriteria = {
            text: debouncedValue,
            topics: selectedTopics,
            level: selectedLevel,
            component: selectedComponent,
            id: -1,
            minMarks: minMarks,
            maxMarks: maxMarks,
            paperYear: "",
            searchInMarkscheme: false,
            subject: subject,
        };

        // get the questions from the server
        searchQuestions(searchCriteria).then((questions) => {
            setQuestions(questions);
        }
        );

    }, [debouncedValue, router, selectedTopics, selectedLevel, selectedComponent,
    minMarks, maxMarks]);
    
    useEffect(() => {
        // if the selectedID is -1, then we don't need to get the output data
        if (selectedID === -1) {
            return;
        }
        // get the output data from the server
        getOutputData(selectedID).then((outputData) => {
            setOutputData(outputData);
        }
        );
    }, [selectedID]);

    return (
        <div className="h-full">
            <SearchComponentCollection
                topics={topics}
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
                value={value}
                setValue={setValue}
                setSelectedLevel={setSelectedLevel}
                setSelectedComponent={setSelectedComponent}
                levels={levels}
                components={components}
                selectedLevel={selectedLevel}
                setMaxMarks={setMaxMarks}
                maxMarks={maxMarks}
                minMarks={minMarks}
                setMinMarks={setMinMarks}
            />
            <QuestionTable
                questions={questions}
                onClickRow={(id) => {
                    setSelectedID(id);
                }
                }
                />
            <QuestionHeader
                outputData={outputData}
                displayAsImages={displayAsImages}
                setDisplayAsImages={setDisplayAsImages}
                displayMarkscheme={displayMarkscheme}
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

export default QuestionOutputArea;
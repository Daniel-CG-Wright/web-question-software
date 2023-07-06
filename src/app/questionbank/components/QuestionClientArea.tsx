"use client"
import QuestionHeader from "./QuestionHeader";
import SearchComponentCollection from "./SearchComponentCollection";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import useDebounce from "@/hooks/useDebounce";
import {OutputData, Question} from "@/types";
import QuestionTable from "./QuestionTable";
import OutputView from "@/components/OutputItem";

// base client area with all interactables.

interface QuestionOutputAreaProps {
    selectedQuestionCode: string;
    topics: string[];
    questions: Question[];
    outputData: OutputData;
}

const QuestionOutputArea: React.FC<QuestionOutputAreaProps> = ({
    selectedQuestionCode,
    topics,
    questions,
    outputData
}) => {
    const [displayAsImages, setDisplayAsImages] = useState(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState(false);
    const router = useRouter();
    const [value, setValue] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedComponent, setSelectedComponent] = useState("");
    const [selectedID, setSelectedID] = useState(-1);
    const debouncedValue = useDebounce(value, 500);

    let levels = ["A", "AS"];
    let components = ["Component 1", "Component 2"];
    useEffect(() => {
        // if all the search criteria are default, then don't search
        let query = {};
        if (
            debouncedValue === "" &&
            selectedTopic === "" &&
            selectedLevel === "" &&
            selectedComponent === "" &&
            selectedID < 0
        ) {
            query = {};
        }
        else
        {
            query = {
                id: -1,
                text: debouncedValue,
                topics: selectedTopic,
                level: selectedLevel,
                component: selectedComponent,
                minMarks: -1,
                maxMarks: 100,
                paperYear: "",
                searchInMarkscheme: false,
                selectedID: selectedID,
                };
        }

        const url = qs.stringifyUrl({
        url: "/questionbank",
        query,
        });

        router.push(url);
    }, [debouncedValue, router, selectedTopic, selectedLevel, selectedComponent,
        selectedID]);
    
    return (
        <div className="h-full">
            <SearchComponentCollection
                topics={topics}
                selectedTopic={selectedTopic}
                setSelectedTopic={setSelectedTopic}
                value={value}
                setValue={setValue}
                selectedLevel={selectedLevel}
                setSelectedLevel={setSelectedLevel}
                selectedComponent={selectedComponent}
                setSelectedComponent={setSelectedComponent}
                levels={levels}
                components={components}
            />
            <QuestionTable
                questions={questions}
                onClickRow={(id) => {
                    setSelectedID(id);
                }
                }
                />
            <QuestionHeader
                selectedQuestionCode={selectedQuestionCode}
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
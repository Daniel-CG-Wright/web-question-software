"use client"
import QuestionHeader from "./QuestionHeader";
import SearchComponentCollection from "./SearchComponentCollection";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import useDebounce from "@/hooks/useDebounce";

interface QuestionOutputAreaProps {
    selectedQuestionCode: string;
    topics: string[];
    questionTable: React.ReactNode;
}

const QuestionOutputArea: React.FC<QuestionOutputAreaProps> = ({
    selectedQuestionCode,
    topics,
    questionTable,
}) => {
    const [displayAsImages, setDisplayAsImages] = useState(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState(false);
    const router = useRouter();
    const [value, setValue] = useState("");
    const [selectedTopic, setSelectedTopic] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedComponent, setSelectedComponent] = useState("");
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
            displayAsImages === true &&
            displayMarkscheme === false
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
                displayAsImages: displayAsImages,
                displayMarkscheme: displayMarkscheme,
                };
        }

        const url = qs.stringifyUrl({
        url: "/questionbank",
        query,
        });

        router.push(url);
    }, [debouncedValue, router, selectedTopic, selectedLevel, selectedComponent]);
        
    return (
        <div className="flex flex-col h-full">
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
            {questionTable}
            <QuestionHeader
                selectedQuestionCode={selectedQuestionCode}
                displayAsImages={displayAsImages}
                setDisplayAsImages={setDisplayAsImages}
                displayMarkscheme={displayMarkscheme}
                setDisplayMarkscheme={setDisplayMarkscheme}
            />
        </div>
    );
}

export default QuestionOutputArea;
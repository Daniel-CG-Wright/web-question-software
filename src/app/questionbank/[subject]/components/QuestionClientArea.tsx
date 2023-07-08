"use client"
import QuestionHeader from "@/components/QuestionHeader";
import SearchComponentCollection from "@/components/SearchComponentCollection";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useDebounce from "@/hooks/useDebounce";
import {OutputData, Question, SearchCriteria} from "@/types";
import QuestionTable from "./QuestionTable";
import OutputView from "@/components/OutputItem";
import { searchQuestions, getOutputData } from "@/app/Actions";

// base client area with all interactables.

interface QuestionOutputAreaProps {
    topics: string[];
}

const QuestionOutputArea: React.FC<QuestionOutputAreaProps> = ({
    topics,
}) => {
    const [displayAsImages, setDisplayAsImages] = useState(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState(false);
    const router = useRouter();
    const [value, setValue] = useState("");
    const [selectedTopics, setSelectedTopics] = useState(topics);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedComponent, setSelectedComponent] = useState("");
    const [selectedID, setSelectedID] = useState(-1);
    const debouncedValue = useDebounce(value, 500);
    const [questions, setQuestions] = useState<Question[]>([]);
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
            subject: "",
        },
        totalMarks: 0,
        questionNumber: -1,
    });

    // TODO may need to make these changeable by making them props, for different subjects
    let levels = ["A", "AS"];
    let components = ["Component 1", "Component 2"];
    useEffect(() => {
        // if all the search criteria are default, then don't search
        let searchCriteria: SearchCriteria = {
            text: debouncedValue,
            topics: selectedTopics,
            level: selectedLevel,
            component: selectedComponent,
            id: -1,
            minMarks: 0,
            maxMarks: 100,
            paperYear: "",
            searchInMarkscheme: false,
        };

        // get the questions from the server
        searchQuestions(searchCriteria).then((questions) => {
            setQuestions(questions);
        }
        );

    }, [debouncedValue, router, selectedTopics, selectedLevel, selectedComponent]);
    
    const handleRowClick = (id: number) => {
        setSelectedID(id);
        // get the output data from the server
        getOutputData(id).then((outputData) => {
            setOutputData(outputData);
        }
        );
    }
    return (
        <div className="h-full">
            <SearchComponentCollection
                topics={topics}
                selectedTopics={selectedTopics}
                setSelectedTopics={setSelectedTopics}
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
                    handleRowClick(id);
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
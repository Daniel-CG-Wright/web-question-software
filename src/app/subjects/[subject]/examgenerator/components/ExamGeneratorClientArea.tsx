"use client"
import { OutputData, Components } from "@/types";
import { useState, useEffect } from "react";
import ExamPaperSearchArea from "./ExamPaperSearchArea";
import ExamPaperHeader from "./ExamPaperHeader";
import OutputView from "@/components/OutputItem";

interface Props {
    //topics: string[];
    subject: number;
    levels: string[];
    components: Components;
}

/**
 * The client-side component for the client-side components of the exam paper generator.
 * Consists of the search component collection and the exam paper header and the output area.
 */
const ExamGeneratorClientArea: React.FC<Props> = ({ subject, components, levels }) => {
    const [displayAsImages, setDisplayAsImages] = useState(true);
    const [displayMarkscheme, setDisplayMarkscheme] = useState(false);
    const [selectedLevel, setSelectedLevel] = useState("");
    const [selectedComponent, setSelectedComponent] = useState("");
    const [minMarks, setMinMarks] = useState(90);
    const [maxMarks, setMaxMarks] = useState(110);
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

    

    return (
        <>
            <ExamPaperSearchArea
                levels={levels}
                components={currentComponents}
                setSelectedLevel={setSelectedLevel}
                setSelectedComponent={setSelectedComponent}
                minMarks={minMarks}
                setMinMarks={setMinMarks}
                maxMarks={maxMarks}
                setMaxMarks={setMaxMarks}

            />
            <ExamPaperHeader
                displayAsImages={displayAsImages}
                setDisplayAsImages={setDisplayAsImages}
                displayMarkscheme={displayMarkscheme}
                setDisplayMarkscheme={setDisplayMarkscheme}
                
                />

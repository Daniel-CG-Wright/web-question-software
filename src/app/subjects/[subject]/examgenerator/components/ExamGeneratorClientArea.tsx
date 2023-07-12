"use client"
import { OutputData, Components, SmallOutputData, SearchCriteria } from "@/types";
import { useState, useEffect } from "react";
import ExamPaperSearchArea from "./ExamPaperSearchArea";
import ExamPaperHeader from "./ExamPaperHeader";
import OutputView from "@/components/OutputItem";
import { generateExamPaper } from "@/app/Actions";

interface Props {
    //topics: string[];
    subject: number;
    levels: string[];
    components: Components;
    topics: string[];
}

/**
 * The client-side component for the client-side components of the exam paper generator.
 * Consists of the search component collection and the exam paper header and the output area.
 * @param {string[]} topics - the list of topics that can be used in a search.
 */
const ExamGeneratorClientArea: React.FC<Props> = ({ subject, components, levels, topics }) => {
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

    let totalMarks = 0;
    let numQuestions = 0;
    const handleGenerate = () => {
        // create a search criteria object
        const searchCriteria: SearchCriteria = {
            level: selectedLevel,
            component: selectedComponent,
            minMarks: minMarks,
            maxMarks: maxMarks,
            id: -1,
            subject: subject,
            text: "",
            searchInMarkscheme: false,
            topics: [],
            paperYear: "",
        };
        // get the output data from the server
        generateExamPaper(searchCriteria, topics).then((data) => {
            /* for each smallOutputData in the data, add the marks to the total marks, increment the number of questions,
            and add the properties of the smallOutputData to the outputData */
            console.log(data);
            data.forEach((smallOutputData: SmallOutputData) => {
                totalMarks += smallOutputData.totalMarks;
                numQuestions++;
                setOutputData((prevOutputData) => {
                    return {
                        text: {
                            questionContents: prevOutputData.text.questionContents + smallOutputData.text.questionContents,
                            markschemeContents: prevOutputData.text.markschemeContents + smallOutputData.text.markschemeContents,
                        },
                        images: [...prevOutputData.images, ...smallOutputData.images],
                        paperData: {
                            year: "",
                            component: "",
                            level: "",
                        },
                        totalMarks: smallOutputData.totalMarks,
                        questionNumber: -1,
                    };
                });
            }
            );
            
        });
    };


    // switch components if the level changes
    const currentComponents = levels.includes(selectedLevel) ? components[selectedLevel] : components["all"];

    return (
        <>
            <ExamPaperSearchArea
                levels={levels}
                components={currentComponents}
                setLevel={setSelectedLevel}
                setComponent={setSelectedComponent}
                minMarks={minMarks}
                setMinMarks={setMinMarks}
                maxMarks={maxMarks}
                setMaxMarks={setMaxMarks}
                onGenerate={handleGenerate}
            />
            <ExamPaperHeader
                displayAsImages={displayAsImages}
                setDisplayAsImages={setDisplayAsImages}
                displayMarkscheme={displayMarkscheme}
                setDisplayMarkscheme={setDisplayMarkscheme}
                numQuestions={numQuestions}
                totalMarks={totalMarks}
                />
            <OutputView
                outputData={outputData}
                isImage={displayAsImages}
                displayMarkscheme={displayMarkscheme}
                />
        </>
    );

}

export default ExamGeneratorClientArea;

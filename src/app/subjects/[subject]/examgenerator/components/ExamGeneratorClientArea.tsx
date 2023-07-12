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
    const [outputDatas, setOutputDatas] = useState<OutputData[]>([]);

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
            // reset total marks, num questions, and output data
            setOutputDatas([]);
            totalMarks = 0;
            numQuestions = 0;
            data.forEach((smallOutputData: SmallOutputData) => {
                totalMarks += smallOutputData.totalMarks;
                numQuestions++;
                setOutputDatas((prevOutputData) => {
                    return [...prevOutputData,{
                        text: {
                            questionContents: smallOutputData.text.questionContents,
                            markschemeContents: smallOutputData.text.markschemeContents,
                        },
                        images: smallOutputData.images,
                        paperData: {
                            year: "",
                            component: "",
                            level: "",
                        },
                        totalMarks: smallOutputData.totalMarks,
                        questionNumber: numQuestions,
                    }];
                });
            }
            );
            
        });
    };

    // get the total marks and number of questions
    totalMarks = 0;
    numQuestions = 0;
    outputDatas.forEach((outputDatas) => {
        totalMarks += outputDatas.totalMarks;
        numQuestions++;
    });

    console.log(outputDatas);
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
            <div>
            {
outputDatas.map((outputData, index) => {
    return (
      <div key={index}>
        <h2>Question {index + 1}</h2>
        <OutputView
          outputData={outputData}
          isImage={displayAsImages}
          displayMarkscheme={displayMarkscheme}
        />
      </div>
    );
  })
  
            }
            </div>
        </>
    );

}

export default ExamGeneratorClientArea;

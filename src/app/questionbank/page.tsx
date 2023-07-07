import QuestionOutputArea from "./components/QuestionClientArea";
import searchQuestions from "@/actions/searchQuestions";
import getOutputData from "@/actions/getOutputData";
import getTopics from "@/actions/getTopics";

import { OutputData, SearchCriteria, ServerResponseOutputData } from "@/types";

interface SearchProps {
    searchParams: SearchCriteria;
};

const Search: React.FC<SearchProps> = async ({ searchParams }) => {
    console.log("searchParams: ", searchParams);
    const questions = await searchQuestions(searchParams);
    const topics = await getTopics();

    // we return all the image and text data for question and markscheme
    // so that we can display them in the question client area
    // and we do not need server traffic whenever we switch between question and markscheme
    // or when we switch between image and text
    let serverOutputData: ServerResponseOutputData;
    let outputData: OutputData;
    // get the output data for the selected question
    // there is a nested statement which could probably be simplified
    // but it would be harder to understand and waterproof.
    // possible simplification: store the empty output data in a variable
    // and then use that instead of writing it twice.
    if (searchParams.selectedID && searchParams.selectedID >= 0) {
        serverOutputData = await getOutputData(
                searchParams.selectedID
        )
        if (serverOutputData.errorOutput)
        {
            // if there is an error, then we just return empty output data
            outputData = {
                totalMarks: 0,
                paperData: {
                    component: "",
                    level: "",
                    year: "",
                    subject: "",
                },
                images: [],
                text: {
                    questionContents: "",
                    markschemeContents: "",
                },
                questionNumber: -1,
            };
        }
        else
        {
            // correct output data
            outputData = serverOutputData.outputData as OutputData;
        }
    }
    else {
        // if no question is selected, then we just return empty output data
        outputData = {
            totalMarks: 0,
            paperData: {
                component: "",
                level: "",
                year: "",
                subject: "",
            },
            images: [],
            text: {
                questionContents: "",
                markschemeContents: "",
            },
            questionNumber: -1,
        };
    }

    let questionCode = "";
    if (outputData.paperData.subject != "")
    {
        // if the subject is not empty, then we create the question code
        // question code is paper: (paper level) level (paper subject) (paper year) (paper component), question (question number)
        questionCode = `${outputData.paperData.level} ${outputData.paperData.subject.toUpperCase()} ${outputData.paperData.year} ${outputData.paperData.component.toUpperCase()}, Question ${outputData.questionNumber}`;
    }
    else
    {
        // if the subject is empty, then we just return an empty string
        questionCode = "";
    }

    return (
        <>
            <QuestionOutputArea
                selectedQuestionCode={questionCode}
                topics={topics}
                questions={questions}
                outputData={outputData}
            />
        </>
    );

}

export default Search;
import { SearchCriteria, RQGQuestionData, OutputData, ServerResponseOutputData } from "@/types";
import getRQGData from "@/routerResponses/getRQGData";
import getOutputData from "@/routerResponses/getOutputData";
import RandomQuestionGenerator from "./components/RQGClientArea";

interface RQGProps {
    subject: string;
    selectedTopics: string[];
    level: string;
    component: string;
    minMarks: number;
    maxMarks: number;
    currentQuestionNum: number;
}

interface RQGSearchCriteria {
    params: RQGProps;
}

/**
 * Page for the random question generator. Receives RQGProps as search params from the route.
 * Also has the subject in the route.
 */
const RQGPage: React.FC<RQGSearchCriteria> = async ({
        params
    }) => {
        let { subject, selectedTopics, level, component, minMarks, maxMarks, currentQuestionNum } = params;
        // convert the searchParams to the searchCriteria type then get the question pool
        const searchCriteria: SearchCriteria = {
            id: -1,
            text: "",
            paperYear: "",
            searchInMarkscheme: false,
            selectedID: -1,
            topics: selectedTopics,
            level: level,
            component: component,
            minMarks: minMarks,
            maxMarks: maxMarks,
        };

        const questionPool: RQGQuestionData[] = await getRQGData(searchCriteria);

        // calculate the total marks as the sum of all the marks ahead of the current question in the question pool (including the current question)
        let totalMarks = 0;
        for (let i = 0; i <= currentQuestionNum; i++)
        {
            totalMarks += questionPool[i].questionMarks;
        }

        // get the current question data
        const serverResponseData = await getOutputData(questionPool[currentQuestionNum].questionID);
        let outputData: OutputData;
        if (serverResponseData.errorOutput)
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
            outputData = serverResponseData.outputData as OutputData;
        }

        // get the levels, components and topics from the database to be displayed in the search widgets.
        const { levels, components, topics } = 
        return (
            <>

                <RandomQuestionGenerator
                    topics={topics}
                    levels={levels}
                    components={components}
                    currentQuestionData={outputData}
                    totalMarks={totalMarks}
                    numQuestions={questionPool.length}
                />
            </>
        );
}

export default RQGPage;

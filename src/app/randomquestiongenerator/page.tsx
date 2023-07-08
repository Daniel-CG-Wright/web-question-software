import { SearchCriteria, RQGQuestionData, OutputData, ServerResponseOutputData } from "@/types";
import getRQGData from "@/routerResponses/getRQGData";
import getOutputData from "@/routerResponses/getOutputData";
import RandomQuestionGenerator from "./components/RQGClientArea";

interface RQGProps {
    topics: string[];
    levels: string[];
    components: string[];
    minMarks: number;
    maxMarks: number;
    currentQuestionNum: number;
}
/**
 * Page for the random question generator. Receives RQGProps as search params from the route
 */
const RQGPage: React.FC<RQGProps> = async ({
    searchParams
    }) => {
        
        // convert the searchParams to the searchCriteria type then get the question pool
        const searchCriteria: SearchCriteria = {
            topics: searchParams.topics,
            level: searchParams.level,
            component: searchParams.component,
            minMarks: searchParams.minMarks,
            maxMarks: searchParams.maxMarks,
            id: -1,
            text: "",
            paperYear: "",
            searchInMarkscheme: false,
            selectedID: -1,            
        };

        const questionPool: RQGQuestionData[] = await getRQGData(searchCriteria);

        // calculate the total marks as the sum of all the marks ahead of the current question in the question pool (including the current question)
        let totalMarks = 0;
        for (let i = 0; i <= searchParams.currentQuestionNum; i++)
        {
            totalMarks += questionPool[i].questionMarks;
        }

        // get the current question data
        const serverResponseData = await getOutputData(questionPool[searchParams.currentQuestionNum].questionID);
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

        return (
            <>

                <RandomQuestionGenerator
                    topics={searchParams.topics}
                    levels={searchParams.levels}
                    components={searchParams.components}
                    currentQuestionData={outputData}
                    totalMarks={totalMarks}
                    numQuestions={questionPool.length}
                />
            </>
        );
}

export default RQGPage;

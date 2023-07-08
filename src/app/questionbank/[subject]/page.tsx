import QuestionOutputArea from "./components/QuestionClientArea";
import searchQuestions from "@/routerResponses/searchQuestions";
import getOutputData from "@/routerResponses/getOutputData";
import getTopics from "@/routerResponses/getTopics";

import { OutputData, SearchCriteria, ServerResponseOutputData } from "@/types";


interface Params {
    params: { subject: string; };
}

const Search: React.FC<Params> = async ({ params }) => {
    console.log("searchParams: ", params);
    //const questions = await searchQuestions(searchParams);
    const topics = await getTopics();

    // we return all the image and text data for question and markscheme
    // so that we can display them in the question client area
    // and we do not need server traffic whenever we switch between question and markscheme
    // or when we switch between image and text
    // get the output data for the selected question
    // there is a nested statement which could probably be simplified
    // but it would be harder to understand and waterproof.
    // possible simplification: store the empty output data in a variable
    // and then use that instead of writing it twice.
    
    

    return (
        <>
            <QuestionOutputArea
                topics={topics}
            />
        </>
    );

}

export default Search;
import QuestionOutputArea from "./components/QuestionClientArea";
import searchQuestions from "@/actions/searchQuestions";
import getOutputData from "@/actions/getOutputData";
import getTopics from "@/actions/getTopics";

import { OutputData, SearchCriteria } from "@/types";

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
    let outputData: OutputData;
    // get the output data for the selected question
    if (searchParams.selectedID && searchParams.selectedID >= 0) {
        outputData = await getOutputData(
                searchParams.selectedID
        )
    }
    else {
        outputData = {
            images: [],
            text: {
                questionContents: "",
                markschemeContents: "",
            },
        };
    }

    return (
        <>
            <QuestionOutputArea
                selectedQuestionCode={-1}
                topics={topics}
                questions={questions}
                outputData={outputData}
            />
        </>
    );

}

export default Search;
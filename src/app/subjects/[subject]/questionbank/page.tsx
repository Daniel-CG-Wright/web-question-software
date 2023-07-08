import QuestionOutputArea from "./components/QuestionClientArea";
import searchQuestions from "@/ServerFunctions/searchQuestions";
import getOutputData from "@/ServerFunctions/getOutputData";
import { dbGetTopics } from "@/server-util/db";

import { OutputData, SearchCriteria } from "@/types";


interface Params {
    params: { subject: number; };
}

// @todo at some point we will need to add checks to make sure the user has paid for this subject
// before allowing them to access it. This will be done by checking the user's subscription status
// in the database.

const Search: React.FC<Params> = async ({ params }) => {
    console.log("searchParams: ", params);
    //const questions = await searchQuestions(searchParams);
    const subject = params.subject;
    const topics = await dbGetTopics(subject);
    // fetching data for interactive components is performed in the output area client component.

    return (
        <>
            <QuestionOutputArea
                topics={topics}
                subject={subject}
            />
        </>
    );

}

export default Search;
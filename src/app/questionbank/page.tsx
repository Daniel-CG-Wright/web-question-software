import SearchComponentCollection from "./components/SearchComponentCollection";
import QuestionTable from "./components/QuestionTable";
import searchQuestions from "@/actions/searchQuestions";
import getTopics from "@/actions/getTopics";

import { SearchCriteria } from "@/types";

interface SearchProps {
    searchParams: {
        id: number;
        text: string;
        topics: string[];
        level: string;
        component: string;
        minMarks: number;
        maxMarks: number;
        paperYear: string;
        searchInMarkscheme: boolean;
    }
};

const Search: React.FC<SearchProps> = async ({ searchParams }) => {
    console.log("searchParams: ", searchParams);
    const questions = await searchQuestions(searchParams);
    const topics = await getTopics();

    return (
        <>
            <SearchComponentCollection topics={topics}/>
            <QuestionTable questions={questions} />
        </>
    );

}

export default Search;
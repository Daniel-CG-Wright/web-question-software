import {dbGetQuestions} from '@/server-util/db';
import { Question } from '@/types';
import { SearchCriteria } from '@/types';

const searchQuestions = async (searchCriteria: SearchCriteria): Promise<Question[]> => {
    // if search criteria has nothing in it
    if (Object.keys(searchCriteria).length === 0)
    {
        // make an empty search criteria
        searchCriteria = {
            id: -1,
            text: "",
            topics: [],
            level: "",
            component: "",
            minMarks: 0,
            maxMarks: 20,
            paperYear: "",
            searchInMarkscheme: false
    };
    }
    let questions = await dbGetQuestions(searchCriteria);
    return (questions as any || [])
}

export default searchQuestions;


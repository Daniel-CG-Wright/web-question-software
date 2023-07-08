// get the data for the random question generator
import { dbGetQuestions } from '@/server-util/db';
import { SearchCriteria, RQGQuestionData } from '@/types';
/**
 * Takes in search criteria and returns a promise for the results of the query, to be used in the question pool for the random question generator
 * @param {SearchCriteria} searchCriteria - the search criteria to use
 * @returns {Promise<RQGQuestionData[]>} - a promise for the results of the query - an array of objects containing the questionID and questionMarks
 */

const getRQGData = async (
    searchCriteria: SearchCriteria,
): Promise<RQGQuestionData[]> => {
    // get the questions and return them as RQGQuestionData[]
    const questions = await dbGetQuestions(searchCriteria);
    return questions.map((question) => {
        return {
            questionID: question.id,
            questionMarks: question.marks,
        };
    }
    );
}

export default getRQGData;
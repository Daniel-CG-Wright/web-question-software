// Function to generate a random exam paper using specific parameters in searchCriteria

import { SearchCriteria, Question, PaperData, Image, Text, OutputData, SmallOutputData } from '@/types';
import { dbGetExamPaperOutputData } from '@/server-util/db';

/**
 * Generate and return a random exam paper using the given search criteria.
 * The paper is returned as a list of output data so that it can be displayed in the output view.
 * Topics is also a parameter - this is the topics that questions will be selected from.
 * @param {SearchCriteria} searchCriteria The search criteria to use when generating the paper.
 * @param {string[]} topics The topics to select questions from.
 * @returns {List[SmallOutputData]} The generated paper.
 */
export async function generateExamPaper(searchCriteria: SearchCriteria, topics: string[]): SmallOutputData[] {
    let { minMarks, maxMarks } = searchCriteria;
    // Get the questions from the database
    const questions: SmallOutputData[] = await dbGetExamPaperOutputData(searchCriteria);

    // @todo - add an option to have a long answer question at the end of the paper.

    // select 1 random question from each topic until the total is between minMarks and maxMarks.
    // If the total is less than minMarks, add a random question from any topic.
    // If the total is greater than maxMarks, remove a random question from any topic.
    // @todo - SEPARATE TOPICS BY COMPONENT AND LEVEL
    let totalMarks = 0;
    let chosenQuestions: SmallOutputData[] = [];
    let chosenTopics: string[] = [];
    // randomly select questions from each topic until the total is between minMarks and maxMarks
    while (totalMarks < minMarks || totalMarks > maxMarks) {
        // choose a random topic
        let topic = topics[Math.floor(Math.random() * topics.length)];
        // if the topic has already been chosen, choose another topic
        while (chosenTopics.includes(topic)) {
            topic = topics[Math.floor(Math.random() * topics.length)];
            if (chosenTopics.length === topics.length) {
                break;
            }
        }
        // add the topic to the chosen topics
        chosenTopics.push(topic);
        // choose a random question from the topic
        let question = questions.filter(q => q.topics.includes(topic))[Math.floor(Math.random() * questions.filter(q => q.topics.includes(topic)).length)];
        // add the question to the chosen questions
        chosenQuestions.push(question);
        // add the question's marks to the total
        totalMarks += question.totalMarks;
    }
    
}

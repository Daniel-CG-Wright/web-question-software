// actions used throuhgout the app.
"use server"
import { dbGetQuestions, dbGetOutputData, dbGetExamPaperOutputData } from "@/server-util/db"
import { SearchCriteria, SmallOutputData } from "@/types"


export async function searchQuestions(searchParams: SearchCriteria) {
    "use server"
    const questions = await dbGetQuestions(searchParams);
    return questions;
}

export async function getOutputData(id: number) {
    "use server"
    const outputData = await dbGetOutputData(id);
    return outputData;
}

// Function to generate a random exam paper using specific parameters in searchCriteria
/**
 * Generate and return a random exam paper using the given search criteria.
 * The paper is returned as a list of output data so that it can be displayed in the output view.
 * Topics is also a parameter - this is the topics that questions will be selected from.
 * @param {SearchCriteria} searchCriteria The search criteria to use when generating the paper.
 * @param {string[]} topics The topics to select questions from.
 * @returns {Promise<SmallOutputData[]>} The generated paper.
 */
export async function generateExamPaper(searchCriteria: SearchCriteria, topics: string[]): Promise<SmallOutputData[]> {
    "use server"
    let { minMarks, maxMarks } = searchCriteria;
    if (topics.length === 0) {
        return [];
    }
    // Get the questions from the database
    return dbGetExamPaperOutputData(searchCriteria)
        .then((questions: SmallOutputData[]) => {
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
            console.log("looping");
            // choose a random topic
            let topic = topics[Math.floor(Math.random() * topics.length)];
            // if the topic has already been chosen, choose another topic
            while (chosenTopics.includes(topic)) {
                topic = topics[Math.floor(Math.random() * topics.length)];
                if (chosenTopics.length === topics.length) {
                    break;
                }
            }
            console.log("topic: " + topic);
            // add the topic to the chosen topics
            chosenTopics.push(topic);
            // choose a random question from the topic
            let question = questions.filter(q => q.topics.includes(topic))[Math.floor(Math.random() * questions.filter(q => q.topics.includes(topic)).length)];
            // add the question to the chosen questions
            chosenQuestions.push(question);
            // add the question's marks to the total
            totalMarks += question.totalMarks;
            console.log("totalMarks: " + totalMarks);

            // if the total is greater than maxMarks, remove random questions until the total is between minMarks and maxMarks
            while (totalMarks > maxMarks) {
                // choose a random question
                let question = chosenQuestions[Math.floor(Math.random() * chosenQuestions.length)];
                // remove the question from the chosen questions
                chosenQuestions = chosenQuestions.filter(q => q !== question);
                // remove the question's marks from the total
                totalMarks -= question.totalMarks;
            }

        }
        
        // return the chosen questions
        console.log("chosen questions: " + chosenQuestions);
        return chosenQuestions;

    })
    .catch((error: Error) => {
        console.error(error);
        return [];
    }
    );
    
}

// Search criteria used when interacting with the database using dbGetQuestions
export interface SearchCriteria {
    id: number,
    text: string,
    topics: string[],
    level: string,
    component: string,
    minMarks: number,
    maxMarks: number,
    paperYear: string,
    searchInMarkscheme: boolean,
}

// Data for a specific question, used primarily for the question bank table.
export interface Question {
    id: number,
    text: string,
    number: number,
    topics: string[],
    paperCode: string,
    marks: number,
    markscheme: string,
}

// Data for a specific paper
export interface PaperData {
    year: string,
    component: string,
    level: string,
    subject: string,
}

// image ID and whether the image is part of the markscheme, so that it can be displayed differently
export interface Image {
    id: number,
    isMS: number,
}

// text for question and markscheme for a specific question
export interface Text {
    questionContents: string,
    markschemeContents: string,
}

// Interface used for actions outputting server responses
export interface ServerResponseOutputData {
    outputData: OutputData | null,
    errorOutput: string | null,
}

// This is the type used for exporting questions to a viewable format using OutputView (in OutputItem.tsx)
export interface OutputData {
    paperData: PaperData,
    images: Image[],
    questionNumber: number,
    text: Text,
    totalMarks: number,
}

// Data format for RQG, presented as a list of these to get the question IDs without
// getting overhead data like the question text and images
export interface RQGQuestionData {
    questionID: number,
    questionMarks: number,
}
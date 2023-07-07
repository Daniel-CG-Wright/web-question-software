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
    selectedID: number,
}

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
export interface Image {
    id: number,
    isMS: number,
}

export interface Text {
    questionContents: string,
    markschemeContents: string,
}

// Interface used for actions outputting server responses
export interface ServerResponseOutputData {
    outputData: OutputData | null,
    errorOutput: string | null,
}

export interface OutputData {
    paperData: PaperData,
    images: Image[],
    questionNumber: number,
    text: Text,
}
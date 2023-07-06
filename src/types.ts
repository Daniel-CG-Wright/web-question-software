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

export interface Image {
    id: number,
    isMS: number,
}

export interface Text {
    questionContents: string,
    markschemeContents: string,
}


export interface OutputData {
    images: Image[],
    text: Text,
}
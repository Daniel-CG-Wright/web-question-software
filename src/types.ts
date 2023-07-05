export interface SearchCriteria {
    id: number,
    text: string,
    topics: string[],
    level: string,
    component: string,
    minMarks: number,
    maxMarks: number,
    paperYear: string,
    searchInMarkscheme: boolean
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

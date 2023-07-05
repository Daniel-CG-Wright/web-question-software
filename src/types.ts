export interface SearchCriteria {
    id: number,
    text: string,
    topics: string[],
    level: string,
    component: string,
    minMarks: number,
    maxMarks: number,
    paperYear: number,
    searchInMarkscheme: boolean
}

export interface Question {
    id: number,
    text: string,
    topics: string[],
    level: string,
    component: string,
    marks: number,
    paperYear: number,
    markscheme: string,
}

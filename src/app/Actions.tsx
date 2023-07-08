// actions used throuhgout the app.
"use server"
import { dbGetQuestions, dbGetOutputData } from "@/server-util/db"
import { SearchCriteria } from "@/types"


export async function searchQuestions(searchParams: SearchCriteria) {
    "use server"
    const questions = await dbGetQuestions(searchParams);
    return questions;
}

export async function getOutputData(id: number) {
    "use server"
    console.log("getOutputData called with id: " + id)
    const outputData = await dbGetOutputData(id);
    console.log("outputData: ", outputData);
    return outputData;
}

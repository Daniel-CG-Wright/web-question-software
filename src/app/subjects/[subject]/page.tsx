// the direction page for a given subject - go to question bank, RQG or exam paper generator
import Link from "next/link";
import getSubjectName from "@/ServerFunctions/getSubjectName";
import {toTitleCase} from "@/server-util/helpers";

interface Params {
    params: { subject: number; };
}

export default async function SubjectHome({ params }: Params) {
    const subject = params.subject;
    // subject name in title case
    let subjectName = await getSubjectName(subject)
    // the first space is always between the level and subject name, so the final subject name
    // should be the capitalised level + the title cased subject name
    subjectName = subjectName.slice(0, subjectName.indexOf(" ")).toUpperCase() + toTitleCase(subjectName.slice(subjectName.indexOf(" ")));

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-4xl text-white">{subjectName} Home</h1>
            <div className="flex flex-row justify-center items-center w-full place-content-center mx-0 space-x-5">
                <Link href={`/subjects/${subject}/questionbank`}>
                    <button className="basebutton">
                        Question Bank
                    </button>
                </Link>
                <Link href={`/subjects/${subject}/randomquestiongenerator`}>
                    <button className="basebutton">
                        Random Question Generator
                    </button>
                </Link>
                <Link href={`/subjects/${subject}/examgenerator`}>
                    <button className="basebutton">
                        Exam Paper Generator
                    </button>
                </Link>
            </div>
        </div>
    );
}

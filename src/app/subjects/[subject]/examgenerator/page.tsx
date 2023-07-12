// page for the exam paper generator
import { dbGetTopics } from "@/server-util/db";
import getInitData from "@/ServerFunctions/getInitData";
import ExamGeneratorClientArea from "./components/ExamGeneratorClientArea";


interface Params {
    params: { subject: number; };
}

// @todo at some point we will need to add checks to make sure the user has paid for this subject
// before allowing them to access it. This will be done by checking the user's subscription status
// in the database.

const ExamGeneratorPage: React.FC<Params> = async ({ params }) => {
    //const questions = await searchQuestions(searchParams);
    const subject = params.subject;
    const topics = await dbGetTopics(subject);
    const {
        components,
        levels
    }
        = await getInitData(subject);
    // fetching data for interactive components is performed in the output area client component.

    return (
        <>
            <h1>Exam Paper Generator</h1>
            <ExamGeneratorClientArea
                subject={subject}
                topics={topics}
                components={components}
                levels={levels}
            />
        </>
    );

}

export default ExamGeneratorPage;
import RandomQuestionGenerator from "./components/RQGClientArea";
import getInitData from "@/ServerFunctions/getInitData";

interface Params {
    params: { subject: number; };
}
/**
 * Page for the random question generator. Receives RQGProps as search params from the route
 */
const RQGPage: React.FC<Params> = async ({
    params
    }) => {
        const subject = params.subject;
        // components will be a dictionary of all the components
        // for each of the levels
        const {
            topics,
            levels,
            components,
            defaultMaxMarks,
        }
            = await getInitData(subject);
            

        return (
            <>

                <RandomQuestionGenerator
                    topics={topics}
                    levels={levels}
                    components={components}
                    subject={params.subject}
                    maxMarks={defaultMaxMarks}
                />
            </>
        );
}

export default RQGPage;

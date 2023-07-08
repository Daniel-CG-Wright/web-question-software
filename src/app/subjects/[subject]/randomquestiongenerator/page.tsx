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
        const {
            topics,
            levels,
            components,
        }
            = await getInitData(subject);
            

        return (
            <>

                <RandomQuestionGenerator
                    topics={topics}
                    levels={levels}
                    components={components}
                    subject={params.subject}
                />
            </>
        );
}

export default RQGPage;

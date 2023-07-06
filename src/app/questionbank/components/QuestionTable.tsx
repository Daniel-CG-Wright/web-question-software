"use client"
import { Question } from "@/types";

interface QuestionTableProps {
    questions: Question[];
    onClickRow?: (id: number) => void;
}

interface QuestionTableRowProps {
    question: Question;
    onClick?: (id: number) => void;
}

/**
 * Clickable question table row.
 * @param {Object} props - The props object, containing the question.
 * @returns {HTML} HTML section containing a clickable question table row.
 * */
const ClickableQuestionTableRow: React.FC<QuestionTableRowProps> = ({ 
    question,
    onClick,
 }) => {

    const handleClick = (): void => {
        if (onClick) {
            return onClick(question.id);
        }
    };

    question.text = question.text.trim();
    return (
        // make a hover effect, and make the rows slightly rounded and have a white border.
        // They should be slightly separated from each other, and the text should be centered.

        <tr className={`
            hover:bg-gray-800
            bg-[#8b8b8b]
            cursor-pointer
            border-2
            border-[#8b8b8b]
            text-sm
            text-white
            font-medium
            text-center
            py-2
            px-4
            rounded-full
            `}
        onClick={handleClick}
        >
            <td className="rounded-bl-xl rounded-tl-xl">{question.id}</td>
            <td>{question.paperCode}</td>
            <td>{question.number}</td>
            <td className={`overflow-hidden h-12 text-ellipsis max-w-fit`}>
                {// have a max length of 100 characters, and then add an ellipsis
                question.text.length > 100 ? question.text.slice(0, 100) + "..." : question.text
                }
                </td>
            <td>{question.marks}</td>
            <td className={`whitespace-normal rounded-tr-xl rounded-br-xl w-[48px] h-12`}>{question.topics}</td>
        </tr>
    );
}

/**
 * Question table.
 * @param {Object} props - The props object, containing the questions.
 * @returns {HTML} HTML section containing a question table.
 * */
const QuestionTable: React.FC<QuestionTableProps> = ({ questions, onClickRow }) => {
    if (questions.length === 0) {
        return (
            <div className="text-center text-lg font-bold">
                <h2>No results found</h2>
                <p>Try changing your search criteria</p>
            </div>
        );
    }
    return (
        <div className="flex flex-center overflow-y-scroll h-1/2 m-5 rounded-xl scrollbar">
        <table className="table-auto border-separate border-spacing-y-3 bg-gray-900 bl-rounded-xl tl-rounded-xl w-full">
            <thead>
                <tr className="py-2 px-4 bg-transparent text-white rounded-xl sticky">
                    <th>ID</th>
                    <th>Paper Code</th>
                    <th>No.</th>
                    <th>Question</th>
                    <th>Marks</th>
                    <th>Topics</th>
                </tr>
            </thead>
            <tbody className="
            divide-y
            divide-gray-200
            border-2
            border-[#8b8b8b]
        ">
                {questions.map((question) => (
                    <ClickableQuestionTableRow key={question.id} question={question} onClick={onClickRow} />
                ))}
            </tbody>
        </table>
        </div>
    );
}

export default QuestionTable;

"use client"
import { Question } from "@/types";
import { int } from "aws-sdk/clients/datapipeline";

interface QuestionTableProps {
    questions: Question[];
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

    return (
        <tr className="clickable" onClick={handleClick}>
            <td>{question.id}</td>
            <td>{question.paperCode}</td>
            <td>{question.text}</td>
            <td>{question.marks}</td>
            <td>{question.topics}</td>
        </tr>
    );
}

/**
 * Question table.
 * @param {Object} props - The props object, containing the questions.
 * @returns {HTML} HTML section containing a question table.
 * */
const QuestionTable: React.FC<QuestionTableProps> = ({ questions }) => {
    if (questions.length === 0) {
        return (
            <div className="no-results">
                <h2>No results found</h2>
                <p>Try changing your search criteria</p>
            </div>
        );
    }
    return (
        <table className="question-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Paper Code</th>
                    <th>Question</th>
                    <th>Marks</th>
                    <th>Topics</th>
                </tr>
            </thead>
            <tbody>
                {questions.map((question) => (
                    <ClickableQuestionTableRow key={question.id} question={question} />
                ))}
            </tbody>
        </table>
    );
}

export default QuestionTable;

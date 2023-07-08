"use client"
// Shows the data about the random questions selected (e.g. number of questions, total marks, etc.)
// also shows the toggles for markscheme and question image

interface RQGInfoProps {
    remainingQuestions: number;
    totalMarks: number;
}

/**
 * 
 * @param {RQGInfoProps} props - The props object, containing the number of questions and total marks.
 * @returns {HTML} HTML section containing the number of questions and total marks.
 */
const RQGInfo: React.FC<RQGInfoProps> = ({ remainingQuestions, totalMarks }) => {
    return (
        <div className="flex sm:flex-row flex-col justify-between sm:m-5">
            <p className="sm:text-2xl text-xl text-center">Questions remaining: {remainingQuestions}</p>
            <p className="sm:text-2xl text-xl text-center">The total marks of all these questions is {totalMarks}.</p>
        </div>
        
    )
}

export default RQGInfo;

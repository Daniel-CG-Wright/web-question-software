"use client"
// Shows the data about the random questions selected (e.g. number of questions, total marks, etc.)
// also shows the toggles for markscheme and question image

interface RQGInfoProps {
    numQuestions: number;
    totalMarks: number;
}

/**
 * 
 * @param {RQGInfoProps} props - The props object, containing the number of questions and total marks.
 * @returns {HTML} HTML section containing the number of questions and total marks.
 */
const RQGInfo: React.FC<RQGInfoProps> = ({ numQuestions, totalMarks }) => {
    return (
        <div className="flex sm:flex-row flex-col items-center justify-center">
            <p className="sm:text-2xl text-xl text-center">Questions in pool: {numQuestions}</p>
            <p className="sm:text-2xl text-xl text-center">The total marks of all these questions is {totalMarks}.</p>
        </div>
        
    )
}

export default RQGInfo;

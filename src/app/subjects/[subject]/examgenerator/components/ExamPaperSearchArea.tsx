// the search component collection for the exam paper generator
// Contains the 
// @todo add subject-speciifc option to have a long answer question at the end
// (e.g. CS has a long answer question at the end of the paper, but maths doesn't)
import MinMaxMarks from "@/components/MinMaxMarks";
import LevelSelect from "@/components/LevelSelect";
import ComponentSelect from "@/components/ComponentSelect";
import BaseButton from "@/components/BaseButton";


interface Props {
    components: string[];
    levels: string[];
    SetMinMarks: (marks: number) => void;
    SetMaxMarks: (marks: number) => void;
    SetComponent: (component: string) => void;
    SetLevel: (level: string) => void;
    onGenerate: () => void;
    minMarks: number;
    maxMarks: number;
}

/**
 * Has level and component selection, and min/max marks, and a button to generate the exam paper.
 */
const ExamPaperSearchArea: React.FC<Props> = ({
    components,
    levels,
    SetMinMarks,
    SetMaxMarks,
    SetComponent,
    SetLevel,
    onGenerate,
    minMarks,
    maxMarks,
}) => {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex flex-col md:flex-row space-y-4 md:space-x-4">
                <div className="flex flex-row space-x-4">
                    <ComponentSelect
                        components={components}
                        selectComponent={SetComponent}
                    />
                    <LevelSelect levels={levels}  setSelectedLevel={SetLevel}/>
                </div>
                <MinMaxMarks
                    setMinMarks={SetMinMarks}
                    setMaxMarks={SetMaxMarks}
                    minMarks={minMarks}
                    maxMarks={maxMarks}
                />
            </div>
            <BaseButton text="Generate" onClick={onGenerate} className="w-full" />
        </div>
    );
}

export default ExamPaperSearchArea;
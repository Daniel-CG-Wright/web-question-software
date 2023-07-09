// the search component collection for the exam paper generator
// Contains the 
// @todo add subject-speciifc option to have a long answer question at the end
// (e.g. CS has a long answer question at the end of the paper, but maths doesn't)
import MinMaxMarks from "@/components/MinMaxMarks";
import LevelSelect from "@/components/LevelSelect";
import ComponentSelect from "@/components/ComponentSelect";


interface Props {
    components: string[];
    levels: string[];
    SetMinMarks: (marks: number) => void;
    SetMaxMarks: (marks: number) => void;
    SetComponent: (component: string) => void;
    SetLevel: (level: string) => void;
}

const ExamPaperSearchArea: React.FC<Props> = ({
    components,
    levels,
    SetMinMarks,
    SetMaxMarks,
    SetComponent,
    SetLevel,
}) => {
    return (
        <div className="flex flex-col md:flex-row space-y-4 md:space-x-4">
            <div className="flex flex-row space-x-4">
                <ComponentSelect
                    components={components}
                    selectComponent={SetComponent}
                />
                <LevelSelect levels={levels}  setSelectedLevel={SetLevel}/>
            </div>
            <MinMaxMarks
                defaultMaxMarks={100}
                setMinMarks={SetMinMarks}
                setMaxMarks={SetMaxMarks}
            />
        </div>
    );
}
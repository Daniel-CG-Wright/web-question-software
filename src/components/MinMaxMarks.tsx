// element for the min and max marks spinboxes

interface Props {
    defaultMaxMarks: number;
    setMinMarks: (marks: number) => void;
    setMaxMarks: (marks: number) => void;
}

const MinMaxMarks: React.FC<Props> = ({ defaultMaxMarks, setMinMarks, setMaxMarks }) => {
    return (
        <div className="flex flex-row space-x-2 justify-between">
            <div className="flex flex-row justify-between">
                <label htmlFor="minMarks">Min marks:</label>
                <input
                    type="number"
                    id="minMarks"
                    name="minMarks"
                    value={0}
                    onChange={(e) => setMinMarks(parseInt(e.target.value))}
                    className="spinbox"
                />
            </div>
            <div className="flex flex-row justify-between">
                <label htmlFor="maxMarks">Max marks:</label>
                <input
                    type="number"
                    id="maxMarks"
                    name="maxMarks"
                    value={defaultMaxMarks}
                    onChange={(e) => setMaxMarks(parseInt(e.target.value))}
                    className="spinbox"
                />
            </div>
        </div>
    );
}

export default MinMaxMarks;

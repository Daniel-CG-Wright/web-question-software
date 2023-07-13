"use client"
import { Question } from "@/types";
import { AutoSizer, Column, Table } from 'react-virtualized';
import 'react-virtualized/styles.css';


interface QuestionTableProps {
    questions: Question[];
    onClickRow?: (id: number) => void;
}

interface QuestionTableRowProps {
    question: Question;
    onClick?: (id: number) => void;
    style: React.CSSProperties;
    rowStyles: {
        row: string;
        idColumn: string;
        ellipsisColumn: string;
        topicsColumn: string;
    };
}

/**
 * Clickable question table row.
 * @param {Object} props - The props object, containing the question.
 * @param {Question} props.question - The question to display.
 * @param {Function} props.onClick - The function to call when the row is clicked.
 * @param {Object} props.style - The style object to apply to the row.
 * @returns {HTML} HTML section containing a clickable question table row.
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
  
    const handleClickRow = (row: { index: number }): void => {
      if (onClickRow) {
        onClickRow(questions[row.index].id);
      }
    };
  
    const rowClassName = ({ index }: { index: number }): string => {
        if (index < 0) {
            return ``;
        }
        const question = questions[index];
        return `
          hover:bg-gray-800
          bg-[#8b8b8b]
          cursor-pointer
          border-2
          border-black
          text-sm
          text-white
          font-medium
          text-center
          py-2
          px-4
        `;
      };
    
      return (
        <div className="flex flex-center h-1/2 m-5 rounded-xl bg-black">
            <AutoSizer>
              {({ width, height }) => (
                <Table
                  width={width}
                  height={height}
                  rowCount={questions.length}
                  rowHeight={50}
                  headerHeight={50}
                  rowGetter={({ index }) => questions[index]}
                  onRowClick={handleClickRow}
                  rowClassName={rowClassName}
                  headerClassName="
                  text-center
                  "
                  gridClassName="scrollbar"
                  
                >
              <Column label="ID" dataKey="id" width={50} flexGrow={1} />
              <Column label="Paper Code" dataKey="paperCode" width={100} flexGrow={2} />
              <Column label="No." dataKey="number" width={50} flexGrow={1} />
              <Column label="Question" dataKey="text" width={400} flexGrow={8} />
              <Column label="Marks" dataKey="marks" width={50} flexGrow={1} />
              <Column label="Topics" dataKey="topics" width={150} flexGrow={3} />
            </Table>
          )}
        </AutoSizer>
      </div>
    );
  };

export default QuestionTable;
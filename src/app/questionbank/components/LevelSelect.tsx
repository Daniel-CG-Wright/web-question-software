"use client"
import React, { ChangeEvent } from 'react';

interface LevelSelectProps {
  selectedLevel: string;
  setSelectedLevel: (level: string) => void;
  levels: string[];
}

const LevelSelect: React.FC<LevelSelectProps> = ({ selectedLevel, setSelectedLevel, levels }) => {
  const handleLevelChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedLevel(event.target.value);
  };

  return (
    <div className="search">
      <select value={selectedLevel} onChange={handleLevelChange}>
        <option value="">All levels</option>
        {levels.map((level, index) => (
          <option value={level.toLowerCase()} key={index}>
            {level}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LevelSelect;

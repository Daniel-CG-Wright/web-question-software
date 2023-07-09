"use client"
import React, { ChangeEvent } from 'react';

interface LevelSelectProps {
  setSelectedLevel: (level: string) => void;
  levels: string[];
}

const LevelSelect: React.FC<LevelSelectProps> = ({ setSelectedLevel, levels }) => {
  const handleLevelChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedLevel(event.target.value);
  };

  // if there is only 1 level, disable the dropdown
  if (levels.length === 1)
  {
    return (
      <select className = "dropdown" onChange={handleLevelChange} value={levels[0]} disabled>
        <option value={levels[0]}>{levels[0]}</option>
      </select>
    );
  }

  return (
    <div>
      <select className = "dropdown" onChange={handleLevelChange}>
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

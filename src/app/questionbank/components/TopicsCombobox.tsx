"use client"
import React, { ChangeEvent } from 'react';

interface TopicsComboboxProps {
  selectedTopic: string;
  setSelectedTopic: (topic: string) => void;
  topics: string[];
}

const TopicsCombobox: React.FC<TopicsComboboxProps> = ({ selectedTopic, setSelectedTopic, topics }) => {
  const handleTopicChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setSelectedTopic(event.target.value);
  };

  return (
    <div className="search">
      <select value={selectedTopic} onChange={handleTopicChange}>
        <option value="">All topics</option>
        {topics.map(topic => (
          <option value={topic} key={topic}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
};

export default TopicsCombobox;

"use client"
import classNames from "classnames";
import React, { ChangeEvent, useState } from 'react';

interface TopicsComboboxProps {
  selectedTopics: string[];
  setSelectedTopics: (topics: string[]) => void;
  topics: string[];
}

const TopicsCombobox: React.FC<TopicsComboboxProps> = ({ selectedTopics, setSelectedTopics, topics }) => {
  const [allTopicsSelected, setAllTopicsSelected] = useState(true);

  const handleTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const topic = event.target.value;
    if (selectedTopics.includes(topic)) {
      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
    } else {
      setSelectedTopics([...selectedTopics, topic]);
    }
  };

  const handleAllTopicsChange = (event: ChangeEvent<HTMLInputElement>) => {
    const allTopicsSelected = event.target.checked;
    setAllTopicsSelected(allTopicsSelected);
    setSelectedTopics([]);
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex flex-row items-center space-x-2">
        <input
          type="checkbox"
          id="allTopics"
          name="allTopics"
          checked={allTopicsSelected}
          onChange={handleAllTopicsChange}
        />
        <label htmlFor="allTopics">All Topics</label>
      </div>
      <select
        multiple
        className={classNames(
          'border-white',
          'rounded-md',
          'p-2',
          {
            'opacity-0': allTopicsSelected,
            'opacity-100': !allTopicsSelected,
            'pointer-events-none': allTopicsSelected,
          },
          'scrollbar'
        )}
        id="topics"
        name="topics"
        value={selectedTopics} // Set the selected options using the value prop
        onChange={handleTopicChange}
      >
        {topics.map((topic) => (
          <option key={topic} value={topic} className={selectedTopics.includes(topic) ? "bg-blue-500" : ""}>
            {topic}
          </option>
        ))}
      </select>
    </div>
  );
}

export default TopicsCombobox;

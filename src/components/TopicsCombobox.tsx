"use client"
import classNames from "classnames";
import React, { ChangeEvent, useState } from 'react';

interface TopicsComboboxProps {
  selectedTopics: string[];
  setSelectedTopics: (topics: string[]) => void;
  topics: string[];
}


/**
 * Allows the user to select 1 or more topics from a list, or select all topics using a checkbox.
 */
const TopicsCombobox: React.FC<TopicsComboboxProps> = ({ selectedTopics, setSelectedTopics, topics}) => {
  
    const [allTopicsSelected, setAllTopicsSelected] = useState(true);

    // add a listener to detect when a topic is selected or deselected
    const handleTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
      const topic = event.target.value;
      if (selectedTopics.includes(topic)) {
        setSelectedTopics(selectedTopics.filter((t) => t !== topic));
      } else {
        setSelectedTopics([...selectedTopics, topic]);
      }
    };
  
    // add a listener to the checkbox to select all topics
    const handleAllTopicsChange = (event: ChangeEvent<HTMLInputElement>) => {
      const allTopicsSelected = event.target.checked;
      setAllTopicsSelected(allTopicsSelected);
      if (allTopicsSelected) {
        setSelectedTopics(topics);
      } else {
        setSelectedTopics([]);
      }
    };
  
    // this will display a checkbox to select all topics, and a list of topics to select individually
    // the list is only shown if the checkbox is not selected, and animations are used to show/hide the list.
    // The transparency is changed to 100/0 and pointer-events are enabled/disabled to allow the user to interact with the list or not.
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
        <select multiple className={
          classNames(
            'border-white',
            'rounded-md',
            'p-2',
            {
              'opacity-0': allTopicsSelected,
              'opacity-100': !allTopicsSelected,
              'pointer-events-none': allTopicsSelected,
            },
            'scrollbar'
          )
        } id="topics" name="topics" size={10} onChange={handleTopicChange}>
          {topics.map((topic) => (
            <option key={topic} value={topic} selected={selectedTopics.includes(topic)} className={selectedTopics.includes(topic) ? "bg-blue-500" : ""}>
              {topic}
            </option>
          ))}
        </select>

      </div>
    );
  }

export default TopicsCombobox;

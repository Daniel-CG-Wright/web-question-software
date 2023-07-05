"use client"
import React, { useEffect, useState } from "react";
import SearchInput from "./SearchBar";
import TopicsCombobox from "./TopicsCombobox";
import LevelSelect from "./LevelSelect";
import ComponentSelect from "./ComponentSelect";


interface SearchComponentCollectionProps {
  topics: string[];
    selectedTopic: string;
    setSelectedTopic: (topic: string) => void;
    value: string;
    setValue: (value: string) => void;
    selectedLevel: string;
    setSelectedLevel: (level: string) => void;
    selectedComponent: string;
    setSelectedComponent: (component: string) => void;
    levels: string[];
    components: string[];
}

const SearchComponentCollection: React.FC<SearchComponentCollectionProps> = ({
  topics,
  selectedTopic,
    setSelectedTopic,
    value,
    setValue,
    selectedLevel,
    setSelectedLevel,
    selectedComponent,
    setSelectedComponent,
    levels,
    components,
}) => {

  return (
    <div className="
    flex
    flex-col
    md:flex-row
    md:justify-between
    md:items-center
    md:space-x-4
    space-y-4
    md:space-y-0
    m-4
    ">
      <SearchInput
        value={value}
        setValue={setValue}
      />
      <TopicsCombobox
        selectedTopic={selectedTopic}
        setSelectedTopic={setSelectedTopic}
        topics={topics}
      />
      <LevelSelect
        selectedLevel={selectedLevel}
        setSelectedLevel={setSelectedLevel}
        levels={levels}
      />
      <ComponentSelect
        selectedComponent={selectedComponent}
        selectComponent={setSelectedComponent}
        components={components}
        selectedLevel = {selectedLevel}
      />
    </div>
  );
};

export default SearchComponentCollection;

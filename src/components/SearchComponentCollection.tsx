"use client"
import React, { useEffect, useState } from "react";
import SearchInput from "./SearchBar";
import TopicsCombobox from "./TopicsCombobox";
import LevelSelect from "./LevelSelect";
import ComponentSelect from "./ComponentSelect";


interface SearchComponentCollectionProps {
  topics: string[];
    selectedTopics: string[];
    setSelectedTopics: (topics: string[]) => void;
    value: string;
    setValue: (value: string) => void;
    setSelectedLevel: (level: string) => void;
    selectedComponent: string;
    setSelectedComponent: (component: string) => void;
    levels: string[];
    components: string[];
    includeSearchBar?: boolean;
}

const SearchComponentCollection: React.FC<SearchComponentCollectionProps> = ({
  topics,
  selectedTopics,
    setSelectedTopics,
    value,
    setValue,
    setSelectedLevel,
    selectedComponent,
    setSelectedComponent,
    levels,
    components,
    includeSearchBar = true,
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
      {includeSearchBar && <SearchInput
        value={value}
        setValue={setValue}
      />}
      <TopicsCombobox
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
        topics={topics}
      />
      <LevelSelect
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

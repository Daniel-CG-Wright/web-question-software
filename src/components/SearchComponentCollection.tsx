"use client"
import React, { useEffect, useState } from "react";
import SearchInput from "./SearchBar";
import TopicsCombobox from "./TopicsCombobox";
import LevelSelect from "./LevelSelect";
import ComponentSelect from "./ComponentSelect";
import MinMaxMarks from "./MinMaxMarks";
import { Components } from "@/types";


interface SearchComponentCollectionProps {
  topics: string[];
    selectedTopics: string[];
    setSelectedTopics: (topics: string[]) => void;
    value: string;
    selectedLevel: string;
    setValue: (value: string) => void;
    setSelectedLevel: (level: string) => void;
    setSelectedComponent: (component: string) => void;
    setMinMarks: (minMarks: number) => void;
    setMaxMarks: (maxMarks: number) => void;
    levels: string[];
    components: Components;
    includeSearchBar?: boolean;
    minMarks: number;
    maxMarks: number;
    searchInMarkscheme: boolean;
    setSearchInMarkscheme: (searchInMarkscheme: boolean) => void;
}

/*
Collection of all the search components, including the search bar, topics combobox, level select, component select, and min/max marks.
Handles switching components based on the selected level.
*/
const SearchComponentCollection: React.FC<SearchComponentCollectionProps> = ({
  topics,
  selectedTopics,
    setSelectedTopics,
    value,
    setValue,
    setSelectedLevel,
    setSelectedComponent,
    setMinMarks,
    setMaxMarks,
    selectedLevel,
    levels,
    components,
    includeSearchBar = true,
    minMarks,
    maxMarks,
    searchInMarkscheme,
    setSearchInMarkscheme,
}) => {

  let componentsForSelectedLevel;
  if (selectedLevel == "") {
    componentsForSelectedLevel = components["all"]
  } else {
    componentsForSelectedLevel = components[selectedLevel.toLowerCase()]
  }
  

  console.log("selected level: " + selectedLevel)
  console.log("components for selected level: " + componentsForSelectedLevel)
  console.log("components: " + components)
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
        searchInMarkscheme={searchInMarkscheme}
        setSearchInMarkscheme={setSearchInMarkscheme}
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
        selectComponent={setSelectedComponent}
        components={componentsForSelectedLevel}
      />
      <MinMaxMarks
        setMinMarks={setMinMarks}
        setMaxMarks={setMaxMarks}
        maxMarks={maxMarks}
        minMarks={minMarks}
      />
    </div>
  );
};

export default SearchComponentCollection;

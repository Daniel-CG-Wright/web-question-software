"use client"
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import qs from "query-string";
import SearchInput from "./SearchBar";
import TopicsCombobox from "./TopicsCombobox";
import LevelSelect from "./LevelSelect";
import ComponentSelect from "./ComponentSelect";
import useDebounce from "@/hooks/useDebounce";

interface SearchComponentCollectionProps {
  topics: string[];
}

const SearchComponentCollection: React.FC<SearchComponentCollectionProps> = ({
  topics,
}) => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [selectedComponent, setSelectedComponent] = useState("");
  const debouncedValue = useDebounce(value, 500);

  let levels = ["A", "AS"];
  let components = ["Component 1", "Component 2"];
  useEffect(() => {
    // if all the search criteria are default, then don't search
    let query = {};
    if (
        debouncedValue === "" &&
        selectedTopic === "" &&
        selectedLevel === "" &&
        selectedComponent === ""
    ) {
        query = {};
    }
    else
    {
        query = {
            id: -1,
            text: debouncedValue,
            topics: selectedTopic,
            level: selectedLevel,
            component: selectedComponent,
            minMarks: -1,
            maxMarks: 100,
            paperYear: "",
            searchInMarkscheme: false,
            };
    }

    const url = qs.stringifyUrl({
      url: "/questionbank",
      query,
    });

    router.push(url);
  }, [debouncedValue, router, selectedTopic, selectedLevel, selectedComponent]);




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

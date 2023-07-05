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

  useEffect(() => {
    const query = {
        id: -1,
        text: debouncedValue,
        topics: [selectedTopic],
        level: selectedLevel,
        component: selectedComponent,
        minMarks: -1,
        maxMarks: 100,
        paperYear: -1,
        searchInMarkscheme: false,
        };


    console.log("query 100 !!! ", query);
    const url = qs.stringifyUrl({
      url: "/questionbank",
      query,
    });

    router.push(url);
  }, [debouncedValue, router]);

  const levels = ["A, AS"];
  const components: string[] = [];
  if (selectedLevel === "AS")
  {
    components.push("component 1");
  }
  else
  {
    components.push("component 1");
    components.push("component 2");
  }

  return (
    <div className="search">
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
      />
    </div>
  );
};

export default SearchComponentCollection;

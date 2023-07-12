// Component collection without search bar
import MinMaxMarks from "./MinMaxMarks";
import LevelSelect from "./LevelSelect";
import ComponentSelect from "./ComponentSelect";
import TopicsCombobox from "./TopicsCombobox";
import React from "react";
import { Components } from "@/types";

interface NoSearchBarComponentCollectionProps {
    selectedTopics: string[];
    setSelectedTopics: (topics: string[]) => void;
    selectedLevel: string;
    setSelectedLevel: (level: string) => void;
    setSelectedComponent: (component: string) => void;
    setMinMarks: (minMarks: number) => void;
    setMaxMarks: (maxMarks: number) => void;
    levels: string[];
    components: Components;
    minMarks: number;
    maxMarks: number;
    topics: string[];
}

/**
 * Contains search props without the search bar. This includes the topics combobox, level select, component select, and min/max marks.
 * Automatic switching of components based on the selected level.
 */
const NoSearchBarComponentCollection: React.FC<NoSearchBarComponentCollectionProps> = ({
    selectedTopics,
    setSelectedTopics,
    selectedLevel,
    setSelectedLevel,
    setSelectedComponent,
    setMinMarks,
    setMaxMarks,
    levels,
    components,
    minMarks,
    maxMarks,
    topics,
}) => {

    let componentsForSelectedLevel;
    if (selectedLevel == "") {
        componentsForSelectedLevel = components["all"]
    } else {
        componentsForSelectedLevel = components[selectedLevel.toLowerCase()]
    }

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
}

export default NoSearchBarComponentCollection;

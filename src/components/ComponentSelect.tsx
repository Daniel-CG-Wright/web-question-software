"use client"
import React, { ChangeEvent } from 'react';

interface ComponentSelectProps {
  components: string[];
  selectedComponent: string;
  selectComponent: (component: string) => void;
  selectedLevel: string;
}

/**
 * ComponentSelect is a dropdown menu that allows the user to select a component.
 */
const ComponentSelect: React.FC<ComponentSelectProps> = ({
  components,
  selectedComponent,
  selectComponent,
  selectedLevel,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    selectComponent(event.target.value);
  };

  // if the user selects AS, then disable the component select as there is only one component.
  // will need to change this for other subjects
  if (selectedLevel.toLowerCase() === "as")
  {
    return (
      <select className="dropdown" value={"component 1"} onChange={handleChange} disabled>
        <option value="component 1">Component 1</option>
      </select>
    );
  }
  return (
    <select className="dropdown" value={selectedComponent} onChange={handleChange}>
      <option value="">All components</option>
      {components.map((component) => (
        <option key={component} value={component}>
          {component}
        </option>
      ))}
    </select>
  );
};

export default ComponentSelect;

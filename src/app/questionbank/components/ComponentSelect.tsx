"use client"
import React, { ChangeEvent } from 'react';

interface ComponentSelectProps {
  components: string[];
  selectedComponent: string;
  selectComponent: (component: string) => void;
  selectedLevel: string;
}

const ComponentSelect: React.FC<ComponentSelectProps> = ({
  components,
  selectedComponent,
  selectComponent,
  selectedLevel,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    selectComponent(event.target.value);
  };

  if (selectedLevel.toLowerCase() === "as")
  {
    return (
      <select className="select" value={"component 1"} onChange={handleChange} disabled>
        <option value="component 1">Component 1</option>
      </select>
    );
  }
  return (
    <select className="select" value={selectedComponent} onChange={handleChange}>
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

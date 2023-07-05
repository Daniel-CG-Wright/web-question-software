"use client"
import React, { ChangeEvent } from 'react';

interface ComponentSelectProps {
  components: string[];
  selectedComponent: string;
  selectComponent: (component: string) => void;
}

const ComponentSelect: React.FC<ComponentSelectProps> = ({
  components,
  selectedComponent,
  selectComponent,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    selectComponent(event.target.value);
  };

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

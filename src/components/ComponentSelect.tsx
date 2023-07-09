"use client"
import React, { ChangeEvent } from 'react';

interface ComponentSelectProps {
  components: string[];
  selectComponent: (component: string) => void;
}

/**
 * ComponentSelect is a dropdown menu that allows the user to select a component.
 * Feed in the components that can be selected as "components".
 */
const ComponentSelect: React.FC<ComponentSelectProps> = ({
  components,
  selectComponent,
}) => {
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    selectComponent(event.target.value);
  };

  // if there is only
  if (components.length === 1)
  {
    return (
      <select className="dropdown" onChange={handleChange} value={components[0]} disabled>
        <option value={components[0]}>{components[0]}</option>
      </select>
    );
  }

  return (
    <select className="dropdown" onChange={handleChange}>
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

"use client"
import React, { ChangeEvent } from 'react';

interface SliderToggleProps {
  left: string;
  right: string;
  checkedValue: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * HTML section containing a checkbox styled to look like a slider.
 * @param {Object} props - The props object, containing the left and right text of the checkbox.
 * @returns {HTML} HTML section containing a checkbox styled to look like a slider.
 * @example
 * <SliderToggle left="All questions" right="Markschemes only" />
 * */
function SliderToggle({ left, right, checkedValue, onChange }: SliderToggleProps): JSX.Element {
  const handleToggleChange = (event: ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.checked);
  };

  return (
    <div className="flex items-center">
      {left && <span className="mr-2">{left}</span>}
      <label
        className={`${
          checkedValue ? "bg-blue-500" : "bg-gray-200"
        } relative inline-flex items-center h-6 rounded-full w-12 transition-colors duration-300`}
      >
        <input
          type="checkbox"
          className="sr-only"
          checked={checkedValue}
          onChange={handleToggleChange}
        />
        <span
          className={`${
            checkedValue ? "translate-x-7" : "translate-x-1"
          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300`}
        />
      </label>
      {right && <span className="ml-2">{right}</span>}
    </div>

  );
}

export default SliderToggle;

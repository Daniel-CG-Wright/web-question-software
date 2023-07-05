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
    <div>
      <span>{left}</span>
      <input
        type="checkbox"
        id="toggle-switch"
        className=""
        checked={checkedValue}
        onChange={handleToggleChange}
      />
      <label htmlFor="toggle-switch" className=""></label>
      <span>{right}</span>
    </div>
  );
}

export default SliderToggle;

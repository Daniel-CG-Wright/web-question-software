"use client"
import React, { ChangeEvent } from 'react';
import SliderToggle from './SliderInput';

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
  searchInMarkscheme: boolean;
  setSearchInMarkscheme: (searchInMarkscheme: boolean) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, setValue, searchInMarkscheme, setSearchInMarkscheme }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  // search bar, and a slider toggle switch underneath to search in markscheme
  /*
  <input type="text" placeholder="Search..." value={value} onChange={handleInputChange}
      className='bg-transparent border-2 border-white text-white w-64 px-4 py-2 rounded-md
      '/>
      */
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-center w-full">
        <input type="text" placeholder="Search..." value={value} onChange={handleInputChange}
          className='bg-transparent border-2 border-white text-white w-full px-4 py-2 rounded-md
      ' />
      </div>
        <div className="flex flex-row items-center space-x-2">
          <p className="text-white">Search in: </p>
          <SliderToggle
          left="question"
          right="markscheme"
          checkedValue={searchInMarkscheme}
          onChange={setSearchInMarkscheme}
            />
        
      </div>
    </div>
  );
};

export default SearchInput;

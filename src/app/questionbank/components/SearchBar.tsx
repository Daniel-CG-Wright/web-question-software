"use client"
import React, { ChangeEvent } from 'react';

interface SearchInputProps {
  value: string;
  setValue: (value: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, setValue }) => {
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <div className="search">
      <input type="text" placeholder="Search..." value={value} onChange={handleInputChange}
      className='bg-transparent border-2 border-white text-white w-64 px-4 py-2 rounded-md
      '/>
    </div>
  );
};

export default SearchInput;

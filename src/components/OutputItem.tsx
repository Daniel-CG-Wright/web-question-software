import React from 'react';

interface OutputItemProps {
  isImage: boolean;
  text: string;
}

/**
 * A single item in the output view
 * @param {Object} data - the data to display
 * @param {boolean} data.isImage - true if the item is an image
 * @param {string} data.text - the text or image path
 * @returns {JSX.Element} - the item
 */
function OutputItem({ isImage, text }: OutputItemProps): JSX.Element {
  return (
    <div className="">
      {isImage ? <img src={text} alt="Output Item" /> : text}
    </div>
  );
}

interface OutputViewProps {
  items: string[];
  isImage: boolean;
}

/**
 * The output view - a scroll area which can show a list of text or image items
 * @param {Object} data - the data
 * @param {string[]} data.items - the list of text or image paths
 * @param {boolean} data.isImage - true if the items are images
 * @returns {JSX.Element} - the output view
 */
export default function OutputView({ items, isImage }: OutputViewProps): JSX.Element {
  return (
    <div className="
    flex
    flex-col
    overflow-y-auto
    ">
      {items.map((item, index) => (
        <OutputItem key={index} isImage={isImage} text={item} />
      ))}
    </div>
  );
}

import React from 'react';
import { OutputData } from '@/types';
import { Image, Text } from '@/types';
import ImageComponent from 'next/image';

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
  // console.log("OutputItem: ", text);
  if ( isImage )
  {
    // convert image file to path from public folder
    text = `/questionImages/${text}.png`

  }
  return (
    <div style={{width: '100%', height: '400px', position: 'relative'}}>
      {isImage ? <ImageComponent src={text} alt="Output Item" fill style={{objectFit: 'contain'}}/> : <p className="whitespace-pre-wrap">{text}</p>
}
    </div>
  );
}

interface OutputViewProps {
  outputData: OutputData;
  isImage: boolean;
  displayMarkscheme: boolean;
}

/**
 * The output view - a scroll area which can show a list of text or image items
 * @param {Object} data - the data
 * @param {OutputData} data.outputData - the outputData
 * @param {boolean} data.isImage - true if the items are images
 * @param {boolean} data.displayMarkscheme - true if the MS should be displayed
 * @returns {JSX.Element} - the output view
 */
export default function OutputView({ outputData, isImage, displayMarkscheme }: OutputViewProps): JSX.Element {
  console.log('OutputView: ', outputData.images);
  let outputComponents: (string)[] = [];
 if (!isImage && !displayMarkscheme) {
    outputComponents.push(outputData.text.questionContents);
  } else if (!isImage && displayMarkscheme) {
    outputComponents.push(outputData.text.markschemeContents);
  } else if (isImage) {
    // outputComponents is all the images which have isMS = displayMarkscheme
    for (let i = 0; i < outputData.images.length; i++) {
      if (!!outputData.images[i].isMS === displayMarkscheme) {
        outputComponents.push(outputData.images[i].id.toString());
      }
    }
  }
  console.log(displayMarkscheme)
  console.log("chosen images: ", outputComponents);
  // clear previous output data and add new output data
  return (
    <div className="flex flex-col items-center">
      {outputComponents.map((item, index) => (
        <OutputItem key={index} isImage={isImage} text={item} />
      ))}
    </div>
  );

}

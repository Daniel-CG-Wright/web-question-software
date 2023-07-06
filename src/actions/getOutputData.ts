import { dbGetText, dbGetImages } from '@/server-util/db';
import { OutputData } from '@/types';

/**
 * 
 * @param id - the questionID to get the output data for
 * @returns - a promise for the results of the query - an object with the images and text
 */
const getOutputData = async (
    
        id: number,
    
): Promise<OutputData> => {
    // get the text and images and return them as output data
    console.log(id)
    if(id < 0) {
        return {
            images: [],
            text: {
                questionContents: '',
                markschemeContents: '',
            },
        };
    }
    let text = await dbGetText(id);
    let images = await dbGetImages(id);
    console.log(images)
    // return the output data
    return {
        images: images,
        text: text,
    };

}

export default getOutputData;

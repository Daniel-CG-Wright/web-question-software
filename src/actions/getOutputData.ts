import { dbGetText, dbGetImages } from '@/server-util/db';
import { ServerResponseOutputData } from '@/types';

/**
 * 
 * @param id - the questionID to get the output data for
 * @returns - a promise for the results of the query - an object with the images and text
 */
const getOutputData = async (
    
        id: number,
    
): Promise<ServerResponseOutputData> => {
    // get the text and images and return them as output data
    console.log(id)
    if(id < 0) {
        return {
            outputData: null,
            errorOutput: "Invalid question ID",
        };
    }
    let text = await dbGetText(id);
    let images = await dbGetImages(id);
    console.log(images)
    // return the output data
    return {
        outputData: {
            
            text: text,
            images: images,
        },
        errorOutput: null,
    };

}

export default getOutputData;

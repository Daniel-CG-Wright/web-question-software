import { dbGetOutputData } from '@/server-util/db';
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
    const outputData = await dbGetOutputData(id);
    console.log(outputData)
    return {
        outputData,
        errorOutput: null,
    };
}

export default getOutputData;

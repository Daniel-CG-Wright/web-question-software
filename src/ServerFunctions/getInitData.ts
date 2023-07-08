// used to get initialization data for the tools.
// Runs 3 db queries to get the following data:
// 1. components
// 2. topics
// 3. levels

import {dbGetComponents, dbGetTopics, dbGetLevels} from '@/server-util/db';
import { ToolInitData } from '@/types';

/**
 * @param {number} - subject ID
 * @returns ToolInitData
 */
const getInitData = async (subjectID: number): Promise<ToolInitData> => {
    let components = await dbGetComponents(subjectID);
    let topics = await dbGetTopics(subjectID);
    let levels = await dbGetLevels(subjectID);
    return {
        components: components,
        topics: topics,
        levels: levels,
    }
}

export default getInitData;
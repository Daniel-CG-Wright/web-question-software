// used to get initialization data for the tools.
// Runs 3 db queries to get the following data:
// 1. components
// 2. topics
// 3. levels

import {dbGetComponents, dbGetTopics, dbGetLevels, dbGetMaxMarks} from '@/server-util/db';
import { ToolInitData } from '@/types';

/**
 * @param {number} - subject ID
 * @returns ToolInitData
 */
const getInitData = async (subjectID: number): Promise<ToolInitData> => {
    // dictionary of all display components for all the levels
    let components = await dbGetComponents(subjectID);
    let topics = await dbGetTopics(subjectID);
    let levels = await dbGetLevels(subjectID);
    let defaultMaxMarks = await dbGetMaxMarks(subjectID);
    return {
        components: components,
        topics: topics,
        levels: levels,
        defaultMaxMarks: defaultMaxMarks
    }
}

export default getInitData;
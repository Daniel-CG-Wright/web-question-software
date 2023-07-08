// get a subject name from a subject ID
import { dbGetSubjectName } from '@/server-util/db';

/**
 * @param {number} - subject ID
 * @returns {string} - levels + subject name
 * @throws {Error} - if subject ID is not found
 * */
const getSubjectName = async (subjectID: number): Promise<string> => {
    let subjectName = await dbGetSubjectName(subjectID);
    if (subjectName == null) {
        throw new Error("Subject ID not found");
    }
    return subjectName;
}

export default getSubjectName;
import { dbGetTopics } from '@/server-util/db';

const getTopics = async (): Promise<string[]> => {
    let topics = await dbGetTopics();
    return (topics as any || [])
}

export default getTopics;

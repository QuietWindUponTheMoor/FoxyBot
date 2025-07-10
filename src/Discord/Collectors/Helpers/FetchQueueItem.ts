import { WildMongo } from "wildmongowhispers";

/**
 * 
 * @param mongo WildMongo instance
 * @param queue Specifies which queue collection type to use, 'queue' or 'queue-nsfw'
 * @returns Mongo find result
 */
export async function FetchQueueItem(mongo: WildMongo, queue: string) {
    let [result] = await mongo.database.collection(queue)
        .find({})
        .sort({ _id: 1 })
        .limit(1)
        .toArray();

    return result;
}
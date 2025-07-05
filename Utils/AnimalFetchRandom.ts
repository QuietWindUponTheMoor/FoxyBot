import { WildMongo } from "./Mongo";

export async function AnimalFetchRandom(mongo: WildMongo, animalType: string) {
    await mongo.client.connect();

    let [result] = await mongo.database.collection(`foxybot-${animalType}`).aggregate([
        { $sample: { size: 1 } }
    ]).toArray();

    return [result.image, result.fact];
}
import { WildMongo } from "./Mongo";

export async function AnimalCounterIncrement(mongo: WildMongo, animalType: string) {
    let result = await mongo.findOneAndUpdate(`foxybot-factcounter`, { animalType }, {
        $setOnInsert: { animal: animalType },
        $inc: { counter: 1 }
    });

    return result;
}
import { WildMongo } from "wildmongowhispers";

export async function AnimalCounterIncrement(mongo: WildMongo, animalType: string) {
    let result = await mongo.findOneAndUpdate(`factcounter`, { animalType }, {
        $setOnInsert: { animal: animalType },
        $inc: { counter: 1 }
    });

    return result;
}
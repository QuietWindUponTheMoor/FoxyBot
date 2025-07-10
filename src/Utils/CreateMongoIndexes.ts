import { WildMongo } from "wildmongowhispers";

export async function CreateMongoIndexes(mongo: WildMongo) {
    await mongo.database.collection("animal-intervals").createIndex(
        { guildID: 1, channelID: 1, animalType: 1, foxxoOrNotFoxxo: 1 },
        { unique: true }
    );
}
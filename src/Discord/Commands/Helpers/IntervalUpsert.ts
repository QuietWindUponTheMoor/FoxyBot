import { WildMongo } from "wildmongowhispers";

import { FoxxoIntervalOptions } from "../../../Interfaces/FoxxoIntervalOptions";

export async function IntervalUpsert(mongo: WildMongo, options: FoxxoIntervalOptions) {
    let { interval, guildID, channelID, animalType, foxxoOrNotFoxxo } = options;

    return await mongo.updateOne(
        "animal-intervals", // 'animal-intervals' is indexed to not allow duplicates
        { guildID: guildID, channelID: channelID, animalType: animalType, foxxoOrNotFoxxo: foxxoOrNotFoxxo },
        {
            $set: {
                interval: interval
            },
            $setOnInsert: {
                guildID: guildID,
                channelID: channelID,
                animalType: animalType,
                foxxoOrNotFoxxo: foxxoOrNotFoxxo
            }
        },
        true
    );
}
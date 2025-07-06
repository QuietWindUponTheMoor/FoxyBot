import { WildMongo } from "wildmongowhispers";

import { FoxxoIntervalOptions } from "../../../Interfaces/FoxxoIntervalOptions";

export async function FoxxoIntervalUpsert(mongo: WildMongo, options: FoxxoIntervalOptions, foxxoOrNotFoxxo: string = "foxxo") {
    let { interval, guildID, channelID } = options;

    return await mongo.updateOne(`foxybot-${foxxoOrNotFoxxo}-intervals`, { guildID: guildID, channelID: channelID }, {
            $setOnInsert: {
                interval: interval,
                guildID: guildID,
                channelID: channelID
            }
        },
        true
    );
}
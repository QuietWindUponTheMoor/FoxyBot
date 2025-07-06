import { NodeCron } from "node-cron";
import { WildMongo } from "wildmongowhispers";
import { Client, GuildTextBasedChannel } from "discord.js";

import { FoxxoExecute } from "../Commands/Helpers/FoxxoExecute";
import { NotFoxxoExecute } from "../Commands/Helpers/NotFoxxoExecute";

export async function AnimalsOnATimer(client: Client, mongo: WildMongo, cron: NodeCron) {
    let foxxoIntervals = {
        1: [],
        5: [],
        10: [],
        15: [],
        20: [],
        25: [],
        30: [],
    };
    let notfoxxoIntervals = {
        1: [],
        5: [],
        10: [],
        15: [],
        20: [],
        25: [],
        30: [],
    };

    for (let key in foxxoIntervals) {
        let interval = parseInt(key);
        let findInterval = (interval * 60 * 1000);
        foxxoIntervals[key] = await mongo.find("foxybot-foxxo-intervals", { interval: findInterval });
    }

    for (let key in notfoxxoIntervals) {
        let interval = parseInt(key);
        let findInterval = (interval * 60 * 1000);
        notfoxxoIntervals[key] = await mongo.find("foxybot-notfoxxo-intervals", { interval: findInterval });
    }

    // Iterate over them again, but this time, schedule the cron jobs
    for (let key in foxxoIntervals) {
        console.log(`[${new Date().toISOString()}] Scheduling foxxo timers on interval ${key}`);

        cron.schedule(`*/${key} * * * *`, async () => {
            for (let timerRecord of foxxoIntervals[key]) {
                try {
                    let { interval, guildID, channelID } = timerRecord;
                    let guild = await client.guilds.fetch(guildID);
                    let channel = await guild.channels.fetch(channelID) as GuildTextBasedChannel; // User isn't able to enter a non-text-based channel, so this can safely be forced

                    try {
                        FoxxoExecute(mongo, channel);
                    } catch (error) {
                        console.error(`[${new Date().toISOString()}] FoxxoExecute failed for ${channelID}`, error);
                    }
                } catch (error) {
                    console.error(`[${new Date().toISOString()}] Failed to run scheduled foxxo command for ${timerRecord.guildID}/${timerRecord.channelID}`, error);
                }
            }
        });
    }

    for (let key in notfoxxoIntervals) {
        console.log(`[${new Date().toISOString()}] Scheduling notfoxxo timers on interval ${key}`);

        cron.schedule(`*/${key} * * * *`, async () => {
            for (let timerRecord of notfoxxoIntervals[key]) {
                try {
                    let { interval, guildID, channelID } = timerRecord;
                    let guild = await client.guilds.fetch(guildID);
                    let channel = await guild.channels.fetch(channelID) as GuildTextBasedChannel; // User isn't able to enter a non-text-based channel, so this can safely be forced

                    try {
                        NotFoxxoExecute(mongo, channel);
                    } catch (error) {
                        console.error(`[${new Date().toISOString()}] NotFoxxoExecute failed for ${channelID}`, error);
                    }
                } catch (error) {
                    console.error(`[${new Date().toISOString()}] Failed to run scheduled notfoxxo command for ${timerRecord.guildID}/${timerRecord.channelID}`, error);
                }
            }
        });
    }
}
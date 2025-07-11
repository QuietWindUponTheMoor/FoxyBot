"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnimalsOnATimer = AnimalsOnATimer;
const FoxxoExecute_1 = require("../../Discord/Commands/Helpers/FoxxoExecute");
const NotFoxxoExecute_1 = require("../../Discord/Commands/Helpers/NotFoxxoExecute");
const FoxxoOrNotFoxxo_1 = require("../../Enums/FoxxoOrNotFoxxo");
const AnimalTypes_1 = require("../../Enums/AnimalTypes");
function AnimalsOnATimer(client, mongo, cron) {
    return __awaiter(this, void 0, void 0, function* () {
        // Interval cache
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
        // Populate interval cache
        yield refreshIntervalCache();
        cron.schedule(`*/30 * * * *`, () => __awaiter(this, void 0, void 0, function* () { yield refreshIntervalCache(); })); // Refresh cache every 30 minutes
        // Iterate over them again, but this time, schedule the cron jobs
        for (let key in foxxoIntervals) {
            console.log(`[${new Date().toISOString()}] Scheduling foxxo timers on interval ${key}`);
            cron.schedule(`*/${key} * * * *`, () => __awaiter(this, void 0, void 0, function* () {
                for (let timerRecord of foxxoIntervals[key]) {
                    try {
                        let { interval, guildID, channelID } = timerRecord;
                        let guild = yield client.guilds.fetch(guildID);
                        let channel = yield guild.channels.fetch(channelID); // User isn't able to enter a non-text-based channel, so this can safely be forced
                        try {
                            (0, FoxxoExecute_1.FoxxoExecute)(mongo, channel);
                        }
                        catch (error) {
                            console.error(`[${new Date().toISOString()}] FoxxoExecute failed for ${channelID}`, error);
                        }
                    }
                    catch (error) {
                        console.error(`[${new Date().toISOString()}] Failed to run scheduled foxxo command for ${timerRecord.guildID}/${timerRecord.channelID}`, error);
                    }
                }
            }));
        }
        for (let key in notfoxxoIntervals) {
            console.log(`[${new Date().toISOString()}] Scheduling notfoxxo timers on interval ${key}`);
            cron.schedule(`*/${key} * * * *`, () => __awaiter(this, void 0, void 0, function* () {
                for (let timerRecord of notfoxxoIntervals[key]) {
                    try {
                        let { interval, guildID, channelID } = timerRecord;
                        let guild = yield client.guilds.fetch(guildID);
                        let channel = yield guild.channels.fetch(channelID); // User isn't able to enter a non-text-based channel, so this can safely be forced
                        try {
                            (0, NotFoxxoExecute_1.NotFoxxoExecute)(mongo, channel);
                        }
                        catch (error) {
                            console.error(`[${new Date().toISOString()}] NotFoxxoExecute failed for ${channelID}`, error);
                        }
                    }
                    catch (error) {
                        console.error(`[${new Date().toISOString()}] Failed to run scheduled notfoxxo command for ${timerRecord.guildID}/${timerRecord.channelID}`, error);
                    }
                }
            }));
        }
        // Cache refresh helper, kept in same scope as updater function
        function refreshIntervalCache() {
            return __awaiter(this, void 0, void 0, function* () {
                for (let key in foxxoIntervals) {
                    let interval = parseInt(key);
                    let findInterval = (interval * 60 * 1000);
                    foxxoIntervals[key] = yield mongo.find("animal-intervals", { interval: findInterval, foxxoOrNotFoxxo: FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.Foxxo, animalType: AnimalTypes_1.AnimalTypes.NotFurry });
                }
                for (let key in notfoxxoIntervals) {
                    let interval = parseInt(key);
                    let findInterval = (interval * 60 * 1000);
                    notfoxxoIntervals[key] = yield mongo.find("animal-intervals", { interval: findInterval, foxxoOrNotFoxxo: FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.NotFoxxo, animalType: AnimalTypes_1.AnimalTypes.NotFurry });
                }
            });
        }
    });
}
//# sourceMappingURL=AnimalsOnATimer.js.map
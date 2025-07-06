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
exports.FoxxoIntervalUpsert = FoxxoIntervalUpsert;
function FoxxoIntervalUpsert(mongo_1, options_1) {
    return __awaiter(this, arguments, void 0, function* (mongo, options, foxxoOrNotFoxxo = "foxxo") {
        let { interval, guildID, channelID } = options;
        return yield mongo.updateOne(`foxybot-${foxxoOrNotFoxxo}-intervals`, { guildID: guildID, channelID: channelID }, {
            $setOnInsert: {
                interval: interval,
                guildID: guildID,
                channelID: channelID
            }
        }, true);
    });
}

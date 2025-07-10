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
exports.IntervalUpsert = IntervalUpsert;
function IntervalUpsert(mongo, options) {
    return __awaiter(this, void 0, void 0, function* () {
        let { interval, guildID, channelID, animalType, foxxoOrNotFoxxo } = options;
        return yield mongo.updateOne("animal-intervals", // 'animal-intervals' is indexed to not allow duplicates
        { guildID: guildID, channelID: channelID, animalType: animalType, foxxoOrNotFoxxo: foxxoOrNotFoxxo }, {
            $set: {
                interval: interval
            },
            $setOnInsert: {
                guildID: guildID,
                channelID: channelID,
                animalType: animalType,
                foxxoOrNotFoxxo: foxxoOrNotFoxxo
            }
        }, true);
    });
}
//# sourceMappingURL=IntervalUpsert.js.map
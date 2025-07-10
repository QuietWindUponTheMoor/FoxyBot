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
exports.FoxxoOnATimerButtonHandler = FoxxoOnATimerButtonHandler;
const IntervalUpsert_1 = require("../../../../Discord/Commands/Helpers/IntervalUpsert");
const AnimalTypes_1 = require("../../../../Enums/AnimalTypes");
const FoxxoOrNotFoxxo_1 = require("../../../../Enums/FoxxoOrNotFoxxo");
function FoxxoOnATimerButtonHandler(mongo, interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!interaction.isButton())
            return;
        // Ignore unrelated buttons
        if (!interaction.customId.startsWith("ft|"))
            return;
        // Get button data
        let data = interaction.customId.split("|")[1];
        let { t, gid, cid, i } = JSON.parse(data);
        let type = t === FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.Foxxo.valueOf() ? "foxxo" : "notfoxxo";
        let interval = Math.floor(i * 60 * 1000); // Convert to milliseconds
        // Insert into db
        yield (0, IntervalUpsert_1.IntervalUpsert)(mongo, { interval: interval, guildID: gid, channelID: cid, animalType: AnimalTypes_1.AnimalTypes.NotFurry, foxxoOrNotFoxxo: type });
        yield interaction.update({
            content: `Success! The \`/${type}\` command will run in the specified channel every ${Math.floor(interval / 1000 / 60)} minutes.`,
            components: []
        });
        console.log(`[${new Date().toISOString()}] Guild ${gid} configured a new foxxo-on-a-timer for channel ${cid}`);
    });
}
//# sourceMappingURL=FoxxoOnATimerButtonHandler.js.map
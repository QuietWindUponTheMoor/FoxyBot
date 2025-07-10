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
exports.default = default_1;
const discord_js_1 = require("discord.js");
function default_1(interaction, mongo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (interaction.commandName !== "clear-notfoxxo-on-a-timer")
            return;
        let guildID = interaction.guildId;
        let channelID = interaction.channelId;
        let result = yield mongo.find("animal-intervals", { guildID: guildID, channelID: channelID, foxxoOrNotFoxxo: "notfoxxo" });
        if (result.length === 0) {
            yield interaction.reply({
                content: "There are no notfoxxo intervals to clear for this channel!",
                flags: discord_js_1.MessageFlags.Ephemeral
            });
            return;
        }
        for (let intervalRecord of result) {
            yield mongo.deleteByID("animal-intervals", intervalRecord._id);
        }
        yield interaction.reply({
            content: "All notfoxxo intervals were cleared for this channel!",
            flags: discord_js_1.MessageFlags.Ephemeral
        });
    });
}
//# sourceMappingURL=ClearNotFoxxoOnATimer.js.map
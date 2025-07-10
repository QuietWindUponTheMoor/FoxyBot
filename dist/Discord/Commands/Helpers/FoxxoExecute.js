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
exports.FoxxoExecute = FoxxoExecute;
const discord_js_1 = require("discord.js");
// Local import
const AnimalCounterIncrement_1 = require("../../../Discord/Commands/Helpers/AnimalCounterIncrement");
const AnimalFetchRandom_1 = require("../../../Discord/Commands/Helpers/AnimalFetchRandom");
const AnimalTypes_1 = require("../../../Enums/AnimalTypes");
function FoxxoExecute(mongo, recipient) {
    return __awaiter(this, void 0, void 0, function* () {
        let foxxoOrNotFoxxo = "foxxo";
        // Fetch random fox image
        let { message, result } = yield (0, AnimalFetchRandom_1.AnimalFetchRandom)(mongo, foxxoOrNotFoxxo, AnimalTypes_1.AnimalTypes.NotFurry);
        if (!result) {
            // If recipient is from direct command interaction
            if ("isChatInputCommand" in recipient && typeof recipient.isChatInputCommand === "function")
                yield recipient.reply({ content: message });
            // If recipient is from channel (probably from an interval command)
            if ("send" in recipient && typeof recipient.send === "function")
                yield recipient.send({ content: message });
            return;
        }
        let imageFile = new discord_js_1.AttachmentBuilder(result.image);
        // Increment fox fact
        let counterResult = yield (0, AnimalCounterIncrement_1.AnimalCounterIncrement)(mongo, foxxoOrNotFoxxo);
        let funFactCounter = counterResult.counter;
        let contents = {
            content: `# Random, fun ${result.animal} fact #${funFactCounter}: \n${result.fact}`,
            files: [imageFile],
            //flags: MessageFlags.Ephemeral
        };
        if ("isChatInputCommand" in recipient && typeof recipient.isChatInputCommand === "function") {
            yield recipient.reply(contents);
            return;
        }
        let channel = recipient;
        yield channel.send(contents);
    });
}
//# sourceMappingURL=FoxxoExecute.js.map
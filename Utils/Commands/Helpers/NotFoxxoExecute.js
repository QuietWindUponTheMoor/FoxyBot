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
exports.NotFoxxoExecute = NotFoxxoExecute;
const discord_js_1 = require("discord.js");
// Local import
const AnimalCounterIncrement_1 = require("../Helpers/AnimalCounterIncrement");
const AnimalFetchRandom_1 = require("../Helpers/AnimalFetchRandom");
const Animals_1 = require("../../../Enums/Animals");
function NotFoxxoExecute(mongo, recipient) {
    return __awaiter(this, void 0, void 0, function* () {
        // Select random animal but exclude foxes
        let animal;
        do {
            animal = (0, Animals_1.GetRandomAnimal)();
        } while (animal === "fox");
        // Fetch random animal image
        let [image, fact] = yield (0, AnimalFetchRandom_1.AnimalFetchRandom)(mongo, animal);
        let imageFile = new discord_js_1.AttachmentBuilder(image);
        // Increment animal fact
        let counterResult = yield (0, AnimalCounterIncrement_1.AnimalCounterIncrement)(mongo, animal);
        let funFactCounter = counterResult.counter;
        let contents = {
            content: `Random, fun ${animal} fact #${funFactCounter}: ${fact}`,
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

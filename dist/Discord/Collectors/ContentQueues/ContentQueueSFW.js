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
exports.ContentQueueSFW = ContentQueueSFW;
const discord_js_1 = require("discord.js");
const AnimalTypes_1 = require("Enums/AnimalTypes");
const NextQueueItem_1 = require("Discord/Collectors/Helpers/NextQueueItem");
function ContentQueueSFW(interaction, mongo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (interaction.commandName !== "mod-content-sfw")
            return;
        let DEV_SERVER_ID = "1391519617125715968";
        let PERMISSIVE_ROLE_ID = "1391521224068169779";
        // Return if the guild isn't the development server
        if (interaction.guildId !== DEV_SERVER_ID)
            return;
        // Return if the user doesn't have the appropriate role
        // But first make sure the member is cached
        let member = interaction.member;
        if (!member || !(member instanceof discord_js_1.GuildMember)) {
            yield interaction.reply({
                content: "# OOPS! \n### We were unable to fetch your member data.",
                flags: discord_js_1.MessageFlags.Ephemeral
            });
            return;
        }
        if (!member.roles.cache.has(PERMISSIVE_ROLE_ID)) {
            yield interaction.reply({
                content: "# OOPS! \n### You do not have permission to use this command. Only content moderators for Foxy™ can use this command.",
                flags: discord_js_1.MessageFlags.Ephemeral
            });
            return;
        }
        // Fetch, process, & send the first item
        let message = yield (0, NextQueueItem_1.NextQueueItem)(interaction, mongo, "queue", true); // Shut up, compiler
        let collector = message.createMessageComponentCollector({
            componentType: discord_js_1.ComponentType.Button,
            time: 30 * 60000, // 30 mins
            filter: i => i.user.id === interaction.user.id,
        });
        collector.on("collect", (i) => __awaiter(this, void 0, void 0, function* () {
            let { queueItemID, action } = JSON.parse(i.customId);
            let queueItem = yield mongo.findByID("queue", queueItemID);
            if (action === 1) { // Approve
                yield mongo.insertOne("animals", {
                    type: queueItem.animal === AnimalTypes_1.AnimalTypes.Furry.valueOf() ? AnimalTypes_1.AnimalTypes.Furry : AnimalTypes_1.AnimalTypes.NotFurry,
                    animal: queueItem.animal,
                    image: queueItem.image,
                    fact: queueItem.fact
                });
            }
            else if (action === 2) { // Reject
                yield mongo.insertOne("queue-rejected", {
                    type: queueItem.animal === AnimalTypes_1.AnimalTypes.Furry.valueOf() ? AnimalTypes_1.AnimalTypes.Furry : AnimalTypes_1.AnimalTypes.NotFurry,
                    animal: queueItem.animal,
                    image: queueItem.image,
                    fact: queueItem.fact
                });
            }
            // Delete queue item from queue
            yield mongo.deleteByID("queue", queueItemID);
            let status = yield (0, NextQueueItem_1.NextQueueItem)(i, mongo, "queue");
            if (status === "empty-queue") {
                collector.stop();
            }
        }));
    });
}
//# sourceMappingURL=ContentQueueSFW.js.map
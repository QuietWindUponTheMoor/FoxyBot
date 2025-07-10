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
exports.NextQueueItem = NextQueueItem;
const discord_js_1 = require("discord.js");
const FetchQueueItem_1 = require("../../../Discord/Collectors/Helpers/FetchQueueItem");
const ButtonBuilderWrapper_1 = require("../../../Discord/InteractionButtons/ButtonBuilderWrapper");
/**
 *
 * @param interaction The initial or button interaction
 * @param mongo WildMongo instance
 * @param queue Specifies which queue collection type to use, 'queue' or 'queue-nsfw'
 * @param initialMessage (Optional) Specifies if this is the first message in the collector flow
 * @returns Promise<Message | string>
 */
function NextQueueItem(interaction_1, mongo_1, queue_1) {
    return __awaiter(this, arguments, void 0, function* (interaction, mongo, queue, initialMessage = false) {
        var _a;
        // Fetch next queue item
        let queueItem = yield (0, FetchQueueItem_1.FetchQueueItem)(mongo, queue);
        if (!queueItem) {
            yield interaction.reply({
                content: "There are no more items left in this queue!",
                components: []
            });
            return "empty-queue";
        }
        // Create interaction buttons
        let buttons = yield (0, ButtonBuilderWrapper_1.ButtonBuilderWrapper)([
            {
                customID: JSON.stringify({
                    queueItemID: queueItem._id.toString(),
                    action: 1 // Accept
                }), // This might not work, will have to test later
                label: "Accept",
                style: discord_js_1.ButtonStyle.Success
            },
            {
                customID: JSON.stringify({
                    queueItemID: queueItem._id.toString(),
                    action: 2 // Reject
                }), // This might not work, will have to test later
                label: "Reject",
                style: discord_js_1.ButtonStyle.Danger
            }
        ]);
        let contents = `# Accept, or Reject, Queue Item? \n\n### Fact: \n${(_a = queueItem.fact) !== null && _a !== void 0 ? _a : "N/A"}`;
        if (initialMessage) {
            let message = (yield interaction.reply({
                content: contents,
                components: [buttons],
                files: [new discord_js_1.AttachmentBuilder(queueItem.image)],
                flags: discord_js_1.MessageFlags.Ephemeral,
                withResponse: true
            })).resource.message;
            return message;
        }
        let button = interaction;
        yield button.update({
            content: contents,
            components: [buttons],
            files: [new discord_js_1.AttachmentBuilder(queueItem.image)]
        });
        return "move-next";
    });
}
//# sourceMappingURL=NextQueueItem.js.map
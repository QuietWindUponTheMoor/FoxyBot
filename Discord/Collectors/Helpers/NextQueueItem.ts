import { ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, Message, MessageFlags, AttachmentBuilder } from "discord.js";
import { FetchQueueItem } from "./FetchQueueItem";
import { ButtonBuilderWrapper } from "../../InteractionButtons/ButtonBuilderWrapper";
import { WildMongo } from "wildmongowhispers";

/**
 * 
 * @param interaction The initial or button interaction
 * @param mongo WildMongo instance
 * @param queue Specifies which queue collection type to use, 'queue' or 'queue-nsfw'
 * @param initialMessage (Optional) Specifies if this is the first message in the collector flow
 * @returns Promise<Message | string>
 */
export async function NextQueueItem(interaction: ChatInputCommandInteraction | ButtonInteraction, mongo: WildMongo, queue: string, initialMessage: boolean = false): Promise<Message | string> {
    // Fetch next queue item
    let queueItem = await FetchQueueItem(mongo, queue);
    if (!queueItem) {
        await interaction.reply({
            content: "There are no more items left in this queue!",
            components: []
        });

        return "empty-queue";
    }

    // Create interaction buttons
    let buttons = await ButtonBuilderWrapper([
        {
            customID: JSON.stringify({
                queueItemID: queueItem._id.toString(),
                action: 1 // Accept
            }), // This might not work, will have to test later
            label: "Accept",
            style: ButtonStyle.Success
        },
        {
            customID: JSON.stringify({
                queueItemID: queueItem._id.toString(),
                action: 2 // Reject
            }), // This might not work, will have to test later
            label: "Reject",
            style: ButtonStyle.Danger
        }
    ]);

    let contents = `# Accept, or Reject, Queue Item? \n\n### Fact: \n${queueItem.fact ?? "N/A"}`;

    if (initialMessage) {
        let message = (await interaction.reply({
            content: contents,
            components: [buttons],
            files: [new AttachmentBuilder(queueItem.image)],
            flags: MessageFlags.Ephemeral,
            withResponse: true
        })).resource.message;

        return message;
    }

    let button = interaction as ButtonInteraction;
    
    await button.update({
        content: contents,
        components: [buttons],
        files: [new AttachmentBuilder(queueItem.image)]
    });

    return "move-next";
}
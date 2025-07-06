import { ChatInputCommandInteraction, AttachmentBuilder, MessageFlags, GuildTextBasedChannel } from "discord.js";
import { WildMongo } from "wildmongowhispers";

// Local import
import { AnimalCounterIncrement } from "../Helpers/AnimalCounterIncrement";
import { AnimalFetchRandom } from "../Helpers/AnimalFetchRandom";

export async function FoxxoExecute(mongo: WildMongo, recipient: ChatInputCommandInteraction | GuildTextBasedChannel) {
    // Fetch random fox image
    await mongo.client.connect();
    let [image, fact] = await AnimalFetchRandom(mongo, "fox");
    let imageFile = new AttachmentBuilder(image);

    // Increment fox fact
    let counterResult = await AnimalCounterIncrement(mongo, "fox");
    let funFactCounter = counterResult.counter;

    let contents = {
        content: `Random, fun fox fact #${funFactCounter}: ${fact}`,
        files: [imageFile],
        //flags: MessageFlags.Ephemeral
    };

    if ("isChatInputCommand" in recipient && typeof recipient.isChatInputCommand === "function") {
        await recipient.reply(contents);

        return;
    }
    
    let channel = recipient as GuildTextBasedChannel;
    await channel.send(contents);
}
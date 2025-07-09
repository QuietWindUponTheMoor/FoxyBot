import { ChatInputCommandInteraction, AttachmentBuilder, MessageFlags, GuildTextBasedChannel } from "discord.js";
import { WildMongo } from "wildmongowhispers";

// Local import
import { AnimalCounterIncrement } from "./AnimalCounterIncrement";
import { AnimalFetchRandom, AnimalFetchRandomReturn } from "./AnimalFetchRandom";
import { AnimalTypes } from "../../../Enums/AnimalTypes";

export async function NotFoxxoExecute(mongo: WildMongo, recipient: ChatInputCommandInteraction | GuildTextBasedChannel) {
    let foxxoOrNotFoxxo = "notfoxxo";

    // Fetch random animal image
    let { message, result }: AnimalFetchRandomReturn = await AnimalFetchRandom(mongo, foxxoOrNotFoxxo, AnimalTypes.NotFurry);
    
    if (!result) {
        // If recipient is from direct command interaction
        if ("isChatInputCommand" in recipient && typeof recipient.isChatInputCommand === "function") await recipient.reply({ content: message });

        // If recipient is from channel (probably from an interval command)
        if ("send" in recipient && typeof recipient.send === "function") await recipient.send({ content: message });

        return;
    }

    let imageFile = new AttachmentBuilder(result.image);

    // Increment animal fact
    let counterResult = await AnimalCounterIncrement(mongo, foxxoOrNotFoxxo);
    let funFactCounter = counterResult.counter;

    let contents = {
        content: `# Random, fun ${result.animal} fact #${funFactCounter}: \n${result.fact}`,
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
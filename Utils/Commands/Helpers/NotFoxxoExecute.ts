import { ChatInputCommandInteraction, AttachmentBuilder, MessageFlags, GuildTextBasedChannel } from "discord.js";
import { WildMongo } from "wildmongowhispers";

// Local import
import { AnimalCounterIncrement } from "../Helpers/AnimalCounterIncrement";
import { AnimalFetchRandom } from "../Helpers/AnimalFetchRandom";
import { GetRandomAnimal } from "../../../Enums/Animals";

export async function NotFoxxoExecute(mongo: WildMongo, recipient: ChatInputCommandInteraction | GuildTextBasedChannel) {
    // Select random animal but exclude foxes
    let animal: string;
    do {
        animal = GetRandomAnimal();
    } while (animal === "fox");

    // Fetch random animal image
    let [image, fact] = await AnimalFetchRandom(mongo, animal);
    let imageFile = new AttachmentBuilder(image);

    // Increment animal fact
    let counterResult = await AnimalCounterIncrement(mongo, animal);
    let funFactCounter = counterResult.counter;

    let contents = {
        content: `Random, fun ${animal} fact #${funFactCounter}: ${fact}`,
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
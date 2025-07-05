import { ChatInputCommandInteraction, AttachmentBuilder, MessageFlags } from "discord.js";
import { WildMongo } from "../../Mongo";

// Local import
import { AnimalCounterIncrement } from "../../AnimalCounterIncrement";
import { AnimalFetchRandom } from "../../AnimalFetchRandom";
import { GetRandomAnimal } from "../../../Enums/Animals";

export default async function (interaction: ChatInputCommandInteraction, mongo: WildMongo) {
    if (interaction.commandName !== "notfoxxo") return;

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

    await interaction.reply({
        content: `Random, fun ${animal} fact #${funFactCounter}: ${fact}`,
        files: [imageFile],
        //flags: MessageFlags.Ephemeral
    });
}
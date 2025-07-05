import { ChatInputCommandInteraction, AttachmentBuilder } from "discord.js";
import { WildMongo } from "../../Mongo";

// Local import
import { AnimalCounterIncrement } from "../../AnimalCounterIncrement";
import { AnimalFetchRandom } from "../../AnimalFetchRandom";

export default async function (interaction: ChatInputCommandInteraction, mongo: WildMongo) {
    if (interaction.commandName !== "foxxo") return;

    // Fetch random fox image
    await mongo.client.connect();
    let [image, fact] = await AnimalFetchRandom(mongo, "fox");
    let imageFile = new AttachmentBuilder(image);

    // Increment fox fact
    let counterResult = await AnimalCounterIncrement(mongo, "fox");
    let funFactCounter = counterResult.counter;

    await interaction.reply({
        content: `Random, fun fox fact #${funFactCounter}: ${fact}`,
        files: [imageFile]
    });

    // Close mongo connection
    await mongo.client.close();
}
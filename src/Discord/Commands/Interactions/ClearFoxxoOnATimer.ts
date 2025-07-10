import { ChatInputCommandInteraction, MessageFlags } from "discord.js";
import { WildMongo } from "wildmongowhispers";

export default async function (interaction: ChatInputCommandInteraction, mongo: WildMongo) {
    if (interaction.commandName !== "clear-foxxo-on-a-timer") return;

    let guildID = interaction.guildId;
    let channelID = interaction.channelId;

    let result = await mongo.find("animal-intervals", { guildID: guildID, channelID: channelID, foxxoOrNotFoxxo: "foxxo" });

    if (result.length === 0) {
        await interaction.reply({
            content: "There are no foxxo intervals to clear for this channel!",
            flags: MessageFlags.Ephemeral
        });

        return;
    }

    for (let intervalRecord of result) {
        await mongo.deleteByID("animal-intervals", intervalRecord._id);
    }

    await interaction.reply({
        content: "All foxxo intervals were cleared for this channel!",
        flags: MessageFlags.Ephemeral
    });
}
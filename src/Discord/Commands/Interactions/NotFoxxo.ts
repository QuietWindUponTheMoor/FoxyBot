import { ChatInputCommandInteraction } from "discord.js";
import { WildMongo } from "wildmongowhispers";

// Local import
import { NotFoxxoExecute } from "Discord/Commands/Helpers/NotFoxxoExecute";

export default async function (interaction: ChatInputCommandInteraction, mongo: WildMongo) {
    if (interaction.commandName !== "notfoxxo") return;

    await NotFoxxoExecute(mongo, interaction);
}
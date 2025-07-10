import { ChatInputCommandInteraction } from "discord.js";
import { WildMongo } from "wildmongowhispers";

// Local import
import { FoxxoExecute } from "../../../Discord/Commands/Helpers/FoxxoExecute";

export default async function (interaction: ChatInputCommandInteraction, mongo: WildMongo) {
    if (interaction.commandName !== "foxxo") return;

    await FoxxoExecute(mongo, interaction);
}
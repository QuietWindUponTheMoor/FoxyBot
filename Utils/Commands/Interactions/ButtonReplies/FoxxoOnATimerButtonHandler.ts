import { Client, ButtonInteraction, MessageFlags } from "discord.js";
import { WildMongo } from "wildmongowhispers";

import { FoxxoIntervalUpsert } from "../../Helpers/FoxxoIntervalUpsert";

export async function FoxxoOnATimerButtonHandler(mongo: WildMongo, interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    // Get button data
    let { t, gid, cid, i } = JSON.parse(interaction.customId);
    let type = parseInt(t) === 1 ? "foxxo" : "notfoxxo";
    let interval = Math.floor(i * 60 * 1000); // Convert to milliseconds

    // Insert into db
    await FoxxoIntervalUpsert(mongo, { interval: interval, guildID: gid, channelID: cid });

    await interaction.reply({
        content: `Success! The \`/${type}\` command will run in the specified channel every ${Math.floor(interval / 1000 / 60)} minutes.`,
        flags: MessageFlags.Ephemeral
    });

    console.log(`[${new Date().toISOString()}] Guild ${gid} configured a new foxxo-on-a-timer for channel ${cid}`);
}
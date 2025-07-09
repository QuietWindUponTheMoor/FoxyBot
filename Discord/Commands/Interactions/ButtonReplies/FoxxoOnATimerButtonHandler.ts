import { ButtonInteraction, MessageFlags } from "discord.js";
import { WildMongo } from "wildmongowhispers";

import { IntervalUpsert } from "../../Helpers/IntervalUpsert";
import { AnimalTypes } from "../../../../Enums/AnimalTypes";
import { FoxxoOrNotFoxxo } from "../../../../Enums/FoxxoOrNotFoxxo";

export async function FoxxoOnATimerButtonHandler(mongo: WildMongo, interaction: ButtonInteraction) {
    if (!interaction.isButton()) return;

    // Ignore unrelated buttons
    if (!interaction.customId.startsWith("ft|")) return;

    // Get button data
    let data = interaction.customId.split("|")[1];
    let { t, gid, cid, i } = JSON.parse(data);
    let type = t === FoxxoOrNotFoxxo.Foxxo.valueOf() ? "foxxo" : "notfoxxo";
    let interval = Math.floor(i * 60 * 1000); // Convert to milliseconds

    // Insert into db
    await IntervalUpsert(mongo, { interval: interval, guildID: gid, channelID: cid, animalType: AnimalTypes.NotFurry, foxxoOrNotFoxxo: type as FoxxoOrNotFoxxo });

    await interaction.update({
        content: `Success! The \`/${type}\` command will run in the specified channel every ${Math.floor(interval / 1000 / 60)} minutes.`,
        components: []
    });

    console.log(`[${new Date().toISOString()}] Guild ${gid} configured a new foxxo-on-a-timer for channel ${cid}`);
}
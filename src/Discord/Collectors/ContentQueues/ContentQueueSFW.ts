import { ChatInputCommandInteraction, ComponentType, GuildMember, Message, MessageFlags } from "discord.js";
import { WildMongo } from "wildmongowhispers";

import { AnimalTypes } from "Enums/AnimalTypes";
import { NextQueueItem } from "Discord/Collectors/Helpers/NextQueueItem";

export async function ContentQueueSFW(interaction: ChatInputCommandInteraction, mongo: WildMongo) {
    if (interaction.commandName !== "mod-content-sfw") return;

    let DEV_SERVER_ID = "1391519617125715968";
    let PERMISSIVE_ROLE_ID = "1391521224068169779";

    // Return if the guild isn't the development server
    if (interaction.guildId !== DEV_SERVER_ID) return;

    // Return if the user doesn't have the appropriate role
    // But first make sure the member is cached
    let member = interaction.member;
    if (!member || !(member instanceof GuildMember)) {
        await interaction.reply({
            content: "# OOPS! \n### We were unable to fetch your member data.",
            flags: MessageFlags.Ephemeral
        });

        return;
    }

    if (!member.roles.cache.has(PERMISSIVE_ROLE_ID)) {
        await interaction.reply({
            content: "# OOPS! \n### You do not have permission to use this command. Only content moderators for Foxy™ can use this command.",
            flags: MessageFlags.Ephemeral
        });

        return;
    }

    // Fetch, process, & send the first item
    let message = await NextQueueItem(interaction, mongo, "queue", true) as Message; // Shut up, compiler

    let collector = message.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 30 * 60_000, // 30 mins
        filter: i => i.user.id === interaction.user.id,
    });

    collector.on("collect", async i => {
        let { queueItemID, action } = JSON.parse(i.customId);
        
        let queueItem = await mongo.findByID("queue", queueItemID);

        if (action === 1) { // Approve
            await mongo.insertOne("animals", {
                type: queueItem.animal === AnimalTypes.Furry.valueOf() ? AnimalTypes.Furry : AnimalTypes.NotFurry,
                animal: queueItem.animal,
                image: queueItem.image,
                fact: queueItem.fact
            });
        } else if (action === 2) { // Reject
            await mongo.insertOne("queue-rejected", {
                type: queueItem.animal === AnimalTypes.Furry.valueOf() ? AnimalTypes.Furry : AnimalTypes.NotFurry,
                animal: queueItem.animal,
                image: queueItem.image,
                fact: queueItem.fact
            });
        }

        // Delete queue item from queue
        await mongo.deleteByID("queue", queueItemID);

        let status = await NextQueueItem(i, mongo, "queue");

        if (status === "empty-queue") {
            collector.stop();
        }
    });
}
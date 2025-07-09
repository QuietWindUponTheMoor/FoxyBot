import {
    ChatInputCommandInteraction,
    MessageFlags,
    ChannelType,
    GuildTextBasedChannel,
    PermissionsBitField,
    ButtonStyle
} from "discord.js";
import { WildMongo } from "wildmongowhispers";

// Local import
import { ButtonBuilderWrapper } from "../../InteractionButtons/ButtonBuilderWrapper";
import { FoxxoOrNotFoxxo } from "../../../Enums/FoxxoOrNotFoxxo";

export default async function (interaction: ChatInputCommandInteraction, mongo: WildMongo) {
    if (interaction.commandName !== "notfoxxo-on-a-timer") return;

    let madeInitialReply = false;

    // Check that user has manage guild permissions
    if (interaction.memberPermissions.missing(PermissionsBitField.Flags.ManageGuild).length > 0) {
        await interaction.reply({
            content: "You do not have sufficient permissions to issue this command!",
            flags: MessageFlags.Ephemeral
        });

        return;
    }

    // Get current channel and guild
    let guild = interaction.guild;
    let guildID = guild.id;
    let channel = interaction.channel;
    let channelID = channel.id;

    // Command options
    let rawChannelOption = interaction.options.getChannel("channel");

    if (
        rawChannelOption &&
        "type" in rawChannelOption &&
        (
            rawChannelOption.type === ChannelType.GuildText ||
            rawChannelOption.type === ChannelType.GuildAnnouncement ||
            rawChannelOption.type === ChannelType.PublicThread ||
            rawChannelOption.type === ChannelType.PrivateThread ||
            rawChannelOption.type === ChannelType.AnnouncementThread
        )
    ) {
        // Set channel as user-specified channel instead of interaction channel
        channel = rawChannelOption as GuildTextBasedChannel;
        channelID = channel.id;
    }

    if (!rawChannelOption) {
        await interaction.reply({
            content: "A channel was not specified in the command. FoxyBot™ will use this channel instead.",
            flags: MessageFlags.Ephemeral
        });

        madeInitialReply = true;
    }

    // Create buttons
    let buttons = await ButtonBuilderWrapper([
        {
            customID: `ft|${JSON.stringify({
                t: FoxxoOrNotFoxxo.NotFoxxo,
                gid: guildID,
                cid: channelID,
                i: 1
            })}`,
            label: "Every 1 Minute",
            style: ButtonStyle.Primary
        },
        {
            customID: `ft|${JSON.stringify({
                t: FoxxoOrNotFoxxo.NotFoxxo,
                gid: guildID,
                cid: channelID,
                i: 5
            })}`,
            label: "Every 5 Minutes",
            style: ButtonStyle.Primary
        },
        {
            customID: `ft|${JSON.stringify({
                t: FoxxoOrNotFoxxo.NotFoxxo,
                gid: guildID,
                cid: channelID,
                i: 10
            })}`,
            label: "Every 10 Minutes",
            style: ButtonStyle.Primary
        },
        {
            customID: `ft|${JSON.stringify({
                t: FoxxoOrNotFoxxo.NotFoxxo,
                gid: guildID,
                cid: channelID,
                i: 20
            })}`,
            label: "Every 20 Minutes",
            style: ButtonStyle.Primary
        },
        {
            customID: `ft|${JSON.stringify({
                t: FoxxoOrNotFoxxo.NotFoxxo,
                gid: guildID,
                cid: channelID,
                i: 30
            })}`,
            label: "Every 30 Minutes",
            style: ButtonStyle.Primary
        }
    ]);

    // Send prompt
    if (!madeInitialReply) {
        await interaction.reply({
            content: "Please pick an interval:",
            components: [buttons],
            flags: MessageFlags.Ephemeral
        });

        return;
    }
    
    await interaction.followUp({
        content: "Please pick an interval:",
        components: [buttons],
        flags: MessageFlags.Ephemeral
    });
}
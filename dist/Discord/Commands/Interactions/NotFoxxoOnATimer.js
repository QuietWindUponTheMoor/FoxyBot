"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
const discord_js_1 = require("discord.js");
// Local import
const ButtonBuilderWrapper_1 = require("Discord/InteractionButtons/ButtonBuilderWrapper");
const FoxxoOrNotFoxxo_1 = require("Enums/FoxxoOrNotFoxxo");
function default_1(interaction, mongo) {
    return __awaiter(this, void 0, void 0, function* () {
        if (interaction.commandName !== "notfoxxo-on-a-timer")
            return;
        let madeInitialReply = false;
        // Check that user has manage guild permissions
        if (interaction.memberPermissions.missing(discord_js_1.PermissionsBitField.Flags.ManageGuild).length > 0) {
            yield interaction.reply({
                content: "You do not have sufficient permissions to issue this command!",
                flags: discord_js_1.MessageFlags.Ephemeral
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
        if (rawChannelOption &&
            "type" in rawChannelOption &&
            (rawChannelOption.type === discord_js_1.ChannelType.GuildText ||
                rawChannelOption.type === discord_js_1.ChannelType.GuildAnnouncement ||
                rawChannelOption.type === discord_js_1.ChannelType.PublicThread ||
                rawChannelOption.type === discord_js_1.ChannelType.PrivateThread ||
                rawChannelOption.type === discord_js_1.ChannelType.AnnouncementThread)) {
            // Set channel as user-specified channel instead of interaction channel
            channel = rawChannelOption;
            channelID = channel.id;
        }
        if (!rawChannelOption) {
            yield interaction.reply({
                content: "A channel was not specified in the command. FoxyBot™ will use this channel instead.",
                flags: discord_js_1.MessageFlags.Ephemeral
            });
            madeInitialReply = true;
        }
        // Create buttons
        let buttons = yield (0, ButtonBuilderWrapper_1.ButtonBuilderWrapper)([
            {
                customID: `ft|${JSON.stringify({
                    t: FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.NotFoxxo,
                    gid: guildID,
                    cid: channelID,
                    i: 1
                })}`,
                label: "Every 1 Minute",
                style: discord_js_1.ButtonStyle.Primary
            },
            {
                customID: `ft|${JSON.stringify({
                    t: FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.NotFoxxo,
                    gid: guildID,
                    cid: channelID,
                    i: 5
                })}`,
                label: "Every 5 Minutes",
                style: discord_js_1.ButtonStyle.Primary
            },
            {
                customID: `ft|${JSON.stringify({
                    t: FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.NotFoxxo,
                    gid: guildID,
                    cid: channelID,
                    i: 10
                })}`,
                label: "Every 10 Minutes",
                style: discord_js_1.ButtonStyle.Primary
            },
            {
                customID: `ft|${JSON.stringify({
                    t: FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.NotFoxxo,
                    gid: guildID,
                    cid: channelID,
                    i: 20
                })}`,
                label: "Every 20 Minutes",
                style: discord_js_1.ButtonStyle.Primary
            },
            {
                customID: `ft|${JSON.stringify({
                    t: FoxxoOrNotFoxxo_1.FoxxoOrNotFoxxo.NotFoxxo,
                    gid: guildID,
                    cid: channelID,
                    i: 30
                })}`,
                label: "Every 30 Minutes",
                style: discord_js_1.ButtonStyle.Primary
            }
        ]);
        // Send prompt
        if (!madeInitialReply) {
            yield interaction.reply({
                content: "Please pick an interval:",
                components: [buttons],
                flags: discord_js_1.MessageFlags.Ephemeral
            });
            return;
        }
        yield interaction.followUp({
            content: "Please pick an interval:",
            components: [buttons],
            flags: discord_js_1.MessageFlags.Ephemeral
        });
    });
}
//# sourceMappingURL=NotFoxxoOnATimer.js.map
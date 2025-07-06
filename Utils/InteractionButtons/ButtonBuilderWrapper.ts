import { ActionRowBuilder, ButtonBuilder } from 'discord.js';
import { ButtonBuilderOptions } from '../../Interfaces/ButtonBuilderOptions';

export async function ButtonBuilderWrapper(buttons: Array<ButtonBuilderOptions>): Promise<ActionRowBuilder<ButtonBuilder>> {
    // Create the buttons
    let buttonComponents = buttons.map(btn => 
        new ButtonBuilder()
            .setCustomId(btn.customID)
            .setLabel(btn.label)
            .setStyle(btn.style)
    );

    return new ActionRowBuilder<ButtonBuilder>().addComponents(...buttonComponents);
}
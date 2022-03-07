import { CommandInteractionOptionResolver } from 'discord.js';
import { client } from '..'
import { Event } from "../structures/Event";
import { ExtendedInteraction } from '../typings/Command';

export default new Event('interactionCreate', async (interaction) => {
    // Chat input commands
    if (interaction.isCommand()) {
        await interaction.deferReply()
        const command = client.commands.get(interaction.commandName)
        if (!command) return interaction.followUp('Ese comando no existe!')

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        })
    }
})
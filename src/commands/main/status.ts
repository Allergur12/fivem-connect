import { Command } from '../../structures/Command';
import { client } from '../../'
import { MessageEmbed } from 'discord.js';

export default new Command({
    name:'status',
    description:'Te dice el estado del servidor actualmente',
    run: async({ interaction }) => {
        try {
            const { options, member, guild } = interaction;

            const status = await client.srv.getServerStatus()

            const embedOffline = new MessageEmbed()
            .setTitle(':signal_strength: Estado del servidor :signal_strength:')
            .setDescription(':x: **SERVIDOR OFF** :x: -> **¡Volvemos en breve!**')
            .setColor('RED')

            console.log(status)

            if (!status.online) return interaction.followUp({ embeds: [embedOffline]})
            
            const players = await client.srv.getPlayers()
            const maxPlayers = await client.srv.getMaxPlayers()

            const embedOnline = new MessageEmbed()
            .setTitle(':signal_strength: Estado del servidor :signal_strength:')
            .setDescription(`:white_check_mark: **SERVIDOR ON** :white_check_mark: -> **${players}**/**${maxPlayers}** jugadores.\n**IP del servidor:** connect cfx.re/join/655v4j`)
            .setColor('GREEN')

            return interaction.followUp({ embeds: [embedOnline]})

        } catch (err) {
            console.error(err)
        }
    }
})
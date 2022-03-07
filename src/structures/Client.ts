import { ApplicationCommandDataResolvable, Client, ClientEvents, Collection } from 'discord.js'
import { CommandType } from '../typings/Command'
import glob from 'glob'
import { promisify } from 'util'
import { RegisterCommandOptions } from '../typings/client'
import { Event } from './Event'
import { Server } from 'fivem'

const globPromise = promisify(glob)

export class ExtendedClient extends Client {
    commands: Collection<string, CommandType> = new Collection()
    srv: Server = new Server('rebelion.dimmuservice.com')

    constructor() {
        super({ intents: 32767 })
    }

    start() {
        this.registerModules()
        this.login(process.env.botToken)
    }

    async importFile(filePath: string) {
        return (await import(filePath))?.default
    }

    async registerCommands({ commands }: RegisterCommandOptions) {
        console.log(`Comandos añadidos a la aplicación`)
        this.application?.commands.set(commands).then(() => {
            this.guilds.cache.forEach(g => {
                console.log(`Commands registrados en ${g.id}: ${g.name}`)
            })
        })
    }   

    async registerModules() {
        // Commands
        const slashCommands = [];
        const commandFiles = await globPromise(`${__dirname}/../commands/*/*{.ts,.js}`)
        commandFiles.forEach(async filePath => {
            const command: CommandType = await this.importFile(filePath)
            if (!command.name) return;
            if (command.userPermissions) command.defaultPermission = false
            console.log(command)

            this.commands.set(command.name, command)
            slashCommands.push(command)
        })

        this.on("ready", () => {
            this.registerCommands({
                commands: slashCommands
            })
        })

        // Events
        const eventFiles = await globPromise(`${__dirname}/../events/*{.ts,.js}`)
        eventFiles.forEach(async filePath => {
            const event: Event<keyof ClientEvents>= await this.importFile(filePath)
            this.on(event.event, event.run)
        })
    }
}
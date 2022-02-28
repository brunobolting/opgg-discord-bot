const fs = require('fs')
const { Client, Collection, Intents } = require('discord.js')
const Setup = require('./botSetup')
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.DIRECT_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] })
const setup = new Setup()

class Bot {
    async Start() {
        await setup.Start()

        client.commands = new Collection()
        client.messages = new Collection()
        const commandFiles = fs.readdirSync('./discord-bot/commands').filter(file => file.endsWith('.js'))
        const eventFiles = fs.readdirSync('./discord-bot/events').filter(file => file.endsWith('.js'))
        const messageFiles = fs.readdirSync('./discord-bot/messages').filter(file => file.endsWith('.js'))

        for (const file of commandFiles) {
            if (file.startsWith('_')) {
                continue
            }
            const command = require(`./commands/${file}`)
            // Set a new item in the Collection
            // With the key as the command name and the value as the exported module
            client.commands.set(command.data.name, command)
        }

        for (const file of eventFiles) {
            if (file.startsWith('_')) {
                continue
            }
            const event = require(`./events/${file}`)
            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args))
            } else {
                client.on(event.name, (...args) => event.execute(...args))
            }
        }

        for (const file of messageFiles) {
            if (file.startsWith('_')) {
                continue
            }
            const message = require(`./messages/${file}`)

            client.messages.set(message.name, message)
        }

        client.on('interactionCreate', async interaction => {
            if (!interaction.isCommand()){
                return
            }

            const command = client.commands.get(interaction.commandName)

            if (!command) {
                return
            }

            try {
                await command.execute(interaction)
            } catch (error) {
                console.error(error)
                await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true })
            }
        })

        client.on('messageCreate', async message => {
            if (message.author.bot) {
                return
            }
            if (!message.content.startsWith(process.env.BOT_PREFIX)) {
                return
            }

            const commandBody = message.content.slice(process.env.BOT_PREFIX.length)
            const args = commandBody.split(' ')
            const command = args.shift().toLowerCase()
            const response = client.messages.get(command)
            if (!response) {
                return
            }
            await response.execute(message, client)
        })

        client.login(process.env.BOT_TOKEN)
    }
}

module.exports = Bot

const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')

const commands = []
const commandFiles = fs.readdirSync('./discord-bot/commands').filter(file => file.endsWith('.js'))
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

class BotSetup {
	async Start () {
		for (const file of commandFiles) {
			if (file.startsWith('_')) {
				continue
			}
			const command = require(`./commands/${file}`)
			commands.push(command.data.toJSON())
		}

		await this.clearCommands()

		rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands })
			.then(() => console.log('Successfully registered application commands.'))
			.catch(console.error)


	}
	async clearCommands() {
		await rest.get(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID))
			.then((data) => {
				data.forEach(element => {
					rest.delete(Routes.applicationGuildCommand(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID, element.id))
				})
			})
			.then(() => console.log('Successfully deleted guild application commands.'))
			.catch(console.error)

		await rest.get(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID))
			.then((data) => {
				data.forEach(element => {
					rest.delete(Routes.applicationCommand(process.env.DISCORD_CLIENT_ID, element.id))
				})
			})
			.then(() => console.log('Successfully deleted global application commands.'))
			.catch(console.error)
	}
}

module.exports = BotSetup

const fs = require('fs')
const { REST } = require('@discordjs/rest')
const { Routes } = require('discord-api-types/v9')
const wait = require('util').promisify(setTimeout)

const commands = []
const commandFiles = fs.readdirSync('./discord-bot/commands').filter(file => file.endsWith('.js'))
const rest = new REST({ version: '9' }).setToken(process.env.BOT_TOKEN)

class BotSetup {
	async Start () {
		await this.clearCommands(['guild'])
		/**
		 * @todo resolver problema de excluir comandos apos inserir, wait(1000) resolvendo por hora
		 */
		await wait(1000)
		await this.registerCommands(['guild'])
	}

	async clearCommands(scopes) {
		if (scopes.includes('guild')) {
			const data = await rest.get(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID))
				.then((data) => data)
				.catch(console.error)

			data.forEach(element => {
				rest.delete(Routes.applicationGuildCommand(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID, element.id))
				.then(() => {
					console.log('Successfully deleted guild application command.')
				})
			})
		}

		if (scopes.includes('global')) {
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

	async registerCommands(scopes) {
		for (const file of commandFiles) {
			if (file.startsWith('_')) {
				continue
			}
			const command = require(`./commands/${file}`)
			commands.push(command.data.toJSON())
		}

		if (scopes.includes('guild')) {
			await rest.put(Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID, process.env.DISCORD_GUILD_ID), { body: commands })
				.then((resp) => console.log(`Successfully registered ${resp.length} guild application commands.`))
				.catch(console.error)
		}

		if (scopes.includes('global')) {
			await rest.put(Routes.applicationCommands(process.env.DISCORD_CLIENT_ID), { body: commands })
				.then((resp) => console.log(`Successfully registered ${resp.length} global application commands.`))
				.catch(console.error)
		}
	}
}

module.exports = BotSetup

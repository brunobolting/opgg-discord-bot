const { SlashCommandBuilder } = require('@discordjs/builders')
const { MessageAttachment, MessageEmbed } = require('discord.js')
const Opgg = require('../../opgg')
const opgg = new Opgg()

module.exports = {
	data: new SlashCommandBuilder()
		.setName('builds')
		.setDescription('Busca os dados de um campeão')
		.addStringOption(option =>
			option.setName('champion')
				.setDescription('Campeão a ser consultado')
				.setRequired(true)
		)
		.addStringOption(option =>
			option.setName('position')
				.setDescription('Posição a ser jogada')
				.setRequired(true)
				.addChoice('Top Lane', 'top')
				.addChoice('Jungle', 'jungle')
				.addChoice('Mid Lane', 'mid')
				.addChoice('Bot Lane', 'adc')
				.addChoice('Support', 'support')
		),
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false })
		const buildsImageBuffer = await opgg.GetChampionBuildsAsImage(interaction.options.getString('champion'), interaction.options.getString('position'))
		if (buildsImageBuffer === null) {
			await interaction.editReply({ content: `Campeão "${interaction.options.getString('champion')}" não foi encontrado.` })
			return
		}
		const builds = new MessageAttachment(buildsImageBuffer, 'builds.jpg')
		const timeTaken = (Date.now() - interaction.createdTimestamp) / 1000

		const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle(':sparkles: Builds para ' + interaction.options.getString('champion'))
			.setImage(`attachment://builds.jpg`)
			.setTimestamp()
			.setFooter({text: `Latência: ${timeTaken} Sec.`})
		await interaction.editReply({ embeds: [embed],  files: [builds] })
	},
}

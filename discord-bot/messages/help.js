const { MessageEmbed } = require('discord.js')

module.exports = {
    name: "help",
    execute(message) {
        const embed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Ward Bot')
            .setDescription(process.env.BOT_DESCRIPTION)
            .setThumbnail('https://i.imgur.com/7IiAPZ7.jpg')
            .addField('Comandos de barra', `
            /spells
            /builds
            /runes
            `, false)
            .addField('Comandos de mensagem', `
            !w ping
            !w help
            `, false)
		message.reply({ embeds: [embed]})
	},
}

const { SlashCommandBuilder } = require("@discordjs/builders")
const { MessageAttachment, MessageEmbed } = require("discord.js")
const Opgg = require("../../opgg")
const opgg = new Opgg()

module.exports = {
  data: new SlashCommandBuilder()
    .setName("champion")
    .setDescription("Busca os dados de um campeão")
    .addStringOption((option) =>
      option
        .setName("champion")
        .setDescription("Campeão a ser consultado")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("position")
        .setDescription("Posição a ser jogada")
        .setRequired(true)
        .addChoice("Top Lane", "top")
        .addChoice("Jungle", "jungle")
        .addChoice("Mid Lane", "mid")
        .addChoice("Bot Lane", "adc")
        .addChoice("Support", "support")
    ),
  async execute(interaction) {
    await interaction.deferReply()
    const championImageBuffer = await opgg.GetChampionAsImage(
      interaction.options.getString("champion"),
      interaction.options.getString("position")
    )
    if (championImageBuffer === null) {
      await interaction.editReply({
        content: `Campeão "${interaction.options.getString(
          "champion"
        )}" não foi encontrado.`,
      })
      return
    }
    const champion = new MessageAttachment(championImageBuffer, "champion.jpg")
    const timeTaken = (Date.now() - interaction.createdTimestamp) / 1000

    const embed = new MessageEmbed()
      .setColor("#0099ff")
      .setTitle(":sparkles: " + interaction.options.getString("champion"))
      .setImage(`attachment://champion.jpg`)
      .setTimestamp()
      .setFooter({ text: `Latência: ${timeTaken} Sec.` })
    await interaction.editReply({ embeds: [embed], files: [champion] })
  },
}

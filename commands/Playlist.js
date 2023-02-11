const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("playlist")
        .setDescription("Melhore seus estudos com essa playlist perfeita!"),

    async execute(interaction) {
        await interaction.reply("https://music.apple.com/br/playlist/primavera/pl.u-gxblgJJsbd9oW8X")
    }
}
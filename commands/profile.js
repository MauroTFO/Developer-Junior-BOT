const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName("profile")
        .setDescription("Mostra o perfil do usuário"),

    async execute(interaction) {
    }
}
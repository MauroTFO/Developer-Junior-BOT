const { SlashCommandBuilder, ActionRowBuilder, StringSelectMenuBuilder, Component } = require('discord.js')

const row = new ActionRowBuilder()
    .addComponents(
        new StringSelectMenuBuilder()
            .setCustomId('select')
            .setPlaceholder('Selecine uma linguagem')
            .addOptions({
                label: "javascript",
                description: "Veja a documentação d JavaScript",
                value: "javascript"
            },
                {
                    label: "Java",
                    description: "Veja a documentação do Java",
                    value: "java"
                },
                {
                    label: "Python",
                    description: "Veja a documentação do Python",
                    value: "python"
                },
                {
                    label: "C#",
                    description: "Veja a documentação do C#",
                    value: "csharp"
                },
                {
                    label: "Discord.js",
                    description: "Veja a documentação do Discord.js",
                    value: "discordjs"
                },
                {
                    label: "React",
                    description: "Veja a documentação do React",
                    value: "react"
                },
                {
                    label: "PHP",
                    description: "Veja a documentação do PHP",
                    value: "php"
                }
            )
    )

module.exports = {
    data: new SlashCommandBuilder()
        .setName("docs")
        .setDescription("Acesse a documentação de qualquer tecnologia, basta escolher"),

    async execute(interaction) {
        await interaction.reply({ content: "Selecione uma das tecnologias abaixo:", components: [row] })
    }
}
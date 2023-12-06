const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Start a new poll"),
    async execute(interaction) {
        await interaction.reply({
            ephemeral: true,
            content: "New Poll"
        })
    }
};
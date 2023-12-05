import { ChatInputCommandInteraction, Message } from "discord.js";
module.exports = {
    name: "poll",
    description: "create a new poll",
    run: async (interaction:ChatInputCommandInteraction) => {
        interaction.reply({
            ephemeral: true,
            content: "New Poll"
        })
    }
};
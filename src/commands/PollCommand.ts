import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command";

export default class PollCommand implements Command {
    private data = new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Start a new poll");
    
    getData() {
        return this.data;
    }
    
    async execute(interaction:ChatInputCommandInteraction) {
        await interaction.reply({
            ephemeral: true,
            content: "New Poll"
        })
    }
}
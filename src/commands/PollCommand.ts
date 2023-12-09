import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";
import Command from "./Command.js";
import NewPollModal from "../components/NewPollModal.js";

export default class PollCommand implements Command {
    private data = new SlashCommandBuilder()
        .setName("poll")
        .setDescription("Start a new poll");
    
    getData() {
        return this.data;
    }
    
    async execute(interaction:ChatInputCommandInteraction) {
        const newPollModal = new NewPollModal();

        await interaction.showModal(newPollModal);
        
        await interaction.reply({
            ephemeral: true,
            content: "New Poll"
        })
    }
}
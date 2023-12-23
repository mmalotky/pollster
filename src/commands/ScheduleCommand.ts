import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType } from "discord.js";
import Command from "./Command.js";


export default class ScheduleCommand implements Command {
    private data = new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("Reschedule an existing poll.")

    getData() {
        return this.data;
    }

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        
    }

}
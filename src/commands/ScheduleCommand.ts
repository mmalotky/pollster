import { SlashCommandBuilder, ChatInputCommandInteraction, CacheType, ActionRowBuilder, StringSelectMenuBuilder, heading, HeadingLevel } from "discord.js";
import Command from "./Command.js";
import ActivePollsMenu from "../components/ActivePollsMenu.js";
import { ERR } from "../utility/LogMessage.js";


export default class ScheduleCommand implements Command {
    private data = new SlashCommandBuilder()
        .setName("schedule")
        .setDescription("Reschedule an existing poll.")

    getData() {
        return this.data;
    }

    async execute(interaction: ChatInputCommandInteraction<CacheType>) {
        const activePollsMenu = new ActivePollsMenu();
        if(!interaction.channel) {
            return ERR("Missing channel.");
        }
        await activePollsMenu.setActivePollOptions(interaction.channel);
        
        if(activePollsMenu.options.length === 0) {
            await interaction.reply({
                content: "No Active Polls",
                ephemeral: true
            })
        }
        else {
            const ar = new ActionRowBuilder<StringSelectMenuBuilder>();
            ar.addComponents(activePollsMenu);

            await interaction.reply({
                content:heading("Select a poll", HeadingLevel.Three),
                components: [ar],
                ephemeral: true
            })
        }
    }
}
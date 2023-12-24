import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, StringSelectMenuBuilder } from "discord.js";
import { Poll, scheduleReminders } from "../utility/Poll.js";
import PollMenu from "./PollMenu.js";

export default class StartPollButton extends ButtonBuilder {
    constructor(id:string) {
        super();
        this.setCustomId(`StartPoll:${id}`);
        this.setLabel("Start Poll");
        this.setStyle(ButtonStyle.Success);
    }

    static async submit(
        interaction:Interaction,
        poll:Poll
    ) {
        if(!interaction.isButton()) return;

        if(poll.active || poll.endDate.getTime() < Date.now()) {
            await interaction.reply({
                content: "This poll is expired or in progress.",
                ephemeral: true
            })
            return;
        }

        poll.active = true;
        poll.channel = interaction.channel;
        
        const ar = new ActionRowBuilder<StringSelectMenuBuilder>();
        const pollMenu = new PollMenu(poll);
        ar.addComponents(pollMenu);

        await interaction.reply({
            content:poll.title,
            components:[ar]
        });

        scheduleReminders(poll);
    }
}
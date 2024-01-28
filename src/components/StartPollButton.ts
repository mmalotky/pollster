import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Interaction, StringSelectMenuBuilder, bold } from "discord.js";
import { Poll, scheduleReminders } from "../utility/Poll.js";
import PollMenu from "./PollMenu.js";
import DateFuncions from "../utility/DateFunctions.js";
import DataHandler from "../handlers/DataHandler.js";

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

        DataHandler.setPoll(poll, true);

        const ar = new ActionRowBuilder<StringSelectMenuBuilder>();
        const pollMenu = new PollMenu(poll);
        ar.addComponents(pollMenu);

        await interaction.reply({
            content:`${bold(poll.title)}\n`
                + `Ends ${DateFuncions.convertToDiscordTime(poll.endDate)}`,
            components:[ar]
        });

        scheduleReminders(poll);
    }
}
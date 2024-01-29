import { ActionRowBuilder, ButtonBuilder, ButtonStyle, HeadingLevel, Interaction, StringSelectMenuBuilder, heading, quote } from "discord.js";
import PollMenu from "./PollMenu.js";
import { Poll } from "../utility/Poll.js";
import DateFuncions from "../utility/DateFunctions.js";
import DataHandler from "../handlers/DataHandler.js";
import ScheduleHandler from "../handlers/ScheduleHandler.js"

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
        ScheduleHandler.schedulePoll(poll);

        const ar = new ActionRowBuilder<StringSelectMenuBuilder>();
        const pollMenu = new PollMenu(poll);
        ar.addComponents(pollMenu);

        interaction.reply({
            content:"Success",
            ephemeral: true
        });
        interaction.deleteReply();

        const message = await interaction.channel?.send({
            content:`${heading(poll.title, HeadingLevel.Two)}\n`
                + quote(`Ends on ${DateFuncions.convertToDiscordTime(poll.endDate)}`),
            components:[ar]
        });
    }
}
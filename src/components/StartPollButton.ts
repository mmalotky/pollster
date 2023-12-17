import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuInteraction } from "discord.js";
import { Poll } from "../utility/Poll.js";
import PollMenu from "./PollMenu.js";

export default class StartPollButton extends ButtonBuilder {
    constructor(id:string) {
        super();
        this.setCustomId(`StartPoll:${id}`);
        this.setLabel("Start Poll");
        this.setStyle(ButtonStyle.Success);
    }

    static async submit(
        interaction:ButtonInteraction | StringSelectMenuInteraction,
        poll:Poll
    ) {
        if(poll.active || poll.endDate.getTime() < Date.now()) {
            await interaction.reply({
                content: "This poll is expired or in progress.",
                ephemeral: true
            })
            return;
        }

        poll.active = true;
        const ar = new ActionRowBuilder<StringSelectMenuBuilder>();
        ar.addComponents(new PollMenu(poll));

        await interaction.reply({
            content:poll.title,
            components:[ar]
        });
    }
}
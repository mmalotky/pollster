import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import NewPollModal from "./NewPollModal.js";
import { Poll } from "../utility/Poll.js";
import { DataHandlerObject } from "../handlers/DataHandler.js";

export default class NewPollReturnButton extends ButtonBuilder {
    
    constructor(id:string) {
        super();
        this.setCustomId(`NewPollReturn:${id}`);
        this.setLabel("Edit Selections");
        this.setStyle(ButtonStyle.Danger);
    }

    static async submit(
        interaction:ButtonInteraction, 
        poll:Poll
    ) {
        if(poll.active) {
            await interaction.reply({
                content:"This poll can no longer be activated.",
                ephemeral: true
            });
            return;
        }

        const modal = new NewPollModal(
            poll.title,
            poll.options,
            poll.endDate
        );

        DataHandlerObject.removePoll(poll.id);

        await interaction.showModal(modal);
    }
}
import { ButtonBuilder, ButtonStyle, Interaction } from "discord.js";
import NewPollModal from "./NewPollModal.js";
import { Poll } from "../utility/Poll.js";
import DataHandler from "../handlers/DataHandler.js";

export default class NewPollReturnButton extends ButtonBuilder {
    
    constructor(id:string) {
        super();
        this.setCustomId(`NewPollReturn:${id}`);
        this.setLabel("Edit Selections");
        this.setStyle(ButtonStyle.Danger);
    }

    static async submit(
        interaction:Interaction, 
        poll:Poll
    ) {
        if(!interaction.isButton()) return;

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

        DataHandler.removePoll(poll);

        await interaction.showModal(modal);
    }
}
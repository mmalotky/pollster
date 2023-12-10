import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import NewPollModal, { NewPoll } from "./NewPollModal.js";

export default class NewPollReturnButton extends ButtonBuilder {
    
    constructor(id:string) {
        super();
        this.setCustomId(`NewPollReturn:${id}`);
        this.setLabel("Edit Selections");
        this.setStyle(ButtonStyle.Danger);
    }

    static async submit(
        interaction:ButtonInteraction, 
        payload:NewPoll
    ) {
        const modal = new NewPollModal(
            payload.title,
            payload.options,
            payload.dateTime
        );

        await interaction.showModal(modal);
    }
}
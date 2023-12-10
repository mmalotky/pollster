import { ButtonBuilder, ButtonInteraction, ButtonStyle } from "discord.js";
import NewPollModal from "./NewPollModal.js";

export default class NewPollReturnButton extends ButtonBuilder {
    
    constructor(payload:string) {
        super();
        this.setCustomId(`NewPollReturn:${payload}`);
        this.setLabel("Edit Selections");
        this.setStyle(ButtonStyle.Danger);
    }

    static async submit(
        interaction:ButtonInteraction, 
        payload:{title:string, options:string, dateTime:string}
    ) {
        const modal = new NewPollModal(
            payload.title,
            payload.options,
            new Date(payload.dateTime)
        );

        await interaction.showModal(modal);
    }
}
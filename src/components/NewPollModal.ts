import { ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import { ActionRowBuilder, TextInputStyle } from "discord.js";

export default class NewPollModal extends ModalBuilder {
    private id = `NewPollModal:${crypto.randomUUID()}`;
    private titleInput = new TextInputBuilder()
        .setCustomId("TitleInput")
        .setLabel("Title")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(50)
        .setStyle(TextInputStyle.Short);
    
    private optionsInput = new TextInputBuilder()
        .setCustomId("OptionsInput")
        .setLabel("Number of Options")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(2)
        .setStyle(TextInputStyle.Short);

    private endDateInput = new TextInputBuilder()
        .setCustomId("EndDateInput")
        .setLabel("End Date (mm/dd/yyyy)")
        .setRequired(true)
        .setMinLength(10)
        .setMaxLength(10)
        .setStyle(TextInputStyle.Short);
    
    private endTimeInput = new TextInputBuilder()
        .setCustomId("EndTimeInput")
        .setLabel("End Time (hh:mm)")
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(5)
        .setStyle(TextInputStyle.Short)

    constructor() {
        super();
        this.setCustomId(this.id);
        this.setTitle("New Modal");
        this.setToDefaultEndDateTime();
        this.titleInput.setValue("My Poll");

        const r1 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(this.titleInput);
        const r2 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(this.optionsInput);
        const r3 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(this.endDateInput);
        const r4 = new ActionRowBuilder<TextInputBuilder>()
            .addComponents(this.endTimeInput);
        this.addComponents(r1, r2, r3, r4);
    }

    private setToDefaultEndDateTime() {
        const dateTime = new Date();
        const tomorrow = new Date(dateTime)
        tomorrow.setDate(dateTime.getDate() + 1);

        let month = (tomorrow.getMonth() + 1).toLocaleString();
        month = month.length == 1? "0" + month : month;
        let day = tomorrow.getDate().toLocaleString();
        day = day.length == 1? "0" + day : day;
        const year = tomorrow.getFullYear();
        
        const date = `${month}/${day}/${year}`;
        
        let hour = tomorrow.getHours().toLocaleString();
        hour = hour.length == 1? "0" + hour : hour;
        let minute = tomorrow.getMinutes().toLocaleString();
        minute = minute.length == 1? "0" + minute : minute;

        const time = `${hour}:${minute}`;

        this.endDateInput.setValue(date);
        this.endTimeInput.setValue(time);
    }
}
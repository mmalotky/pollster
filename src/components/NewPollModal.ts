import { ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ModalSubmitInteraction, TextInputStyle } from "discord.js";
import NewPollReturnButton from "./NewPollReturnButton.js";
import { DataHandlerObject } from "../handlers/DataHandler.js";
import { Option, Poll } from "../utility/Poll.js";
import DateFuncions from "../utility/DateFunctions.js";
import StartPollButton from "./StartPollButton.js";

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
        .setLabel("Options (comma separated)")
        .setRequired(true)
        .setMinLength(1)
        .setMaxLength(1000)
        .setStyle(TextInputStyle.Paragraph);

    private timezone = DateFuncions.getTimeZone();
    
    private endDateInput = new TextInputBuilder()
        .setCustomId("EndDateInput")
        .setLabel(`End Date in ${this.timezone} (mm/dd/yyyy)`)
        .setRequired(true)
        .setMinLength(10)
        .setMaxLength(10)
        .setStyle(TextInputStyle.Short);
    
    private endTimeInput = new TextInputBuilder()
        .setCustomId("EndTimeInput")
        .setLabel(`End Time in ${this.timezone} (hh:mm)`)
        .setRequired(true)
        .setMinLength(5)
        .setMaxLength(5)
        .setStyle(TextInputStyle.Short);

    constructor(title?:string, options?:Option[], dateTime?:Date) {
        super();

        if(!title || !options || !dateTime) {
            this.setToDefaultEndDateTime();
        }
        else {
            const { date, time } = DateFuncions.stringifyDateTime(dateTime);

            this.titleInput.setValue(title);
            this.optionsInput.setValue(options.flatMap(o => o.label).join(", "));
            this.endDateInput.setValue(date);
            this.endTimeInput.setValue(time);
        }

        this.build();
    }

    private build() {
        this.setCustomId(this.id);
        this.setTitle("New Poll");

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
        const dateTime = DateFuncions.getTomorrow();
        const {date, time} = DateFuncions.stringifyDateTime(dateTime);
        this.endDateInput.setValue(date);
        this.endTimeInput.setValue(time);
    }

    static async submit(interaction:ModalSubmitInteraction) {
        const errors:string[] = [];
        const dataID = crypto.randomUUID();

        const title = interaction.fields.getTextInputValue("TitleInput");
        const options = interaction.fields.getTextInputValue("OptionsInput");
        const date = interaction.fields.getTextInputValue("EndDateInput");
        const time = interaction.fields.getTextInputValue("EndTimeInput");

        if(!title || !options || !date || !time) {
            await interaction.reply({ 
                content: 'There was an error while submiting this modal!', 
                ephemeral: true 
            });
            return;
        }

        const optionValues = options.split(",").map(o => o.trim());
        if(
            optionValues.length == 0 
            || optionValues.includes("") 
            || optionValues.filter(o => o.length > 100).length > 0
        ) errors.push("Options");
        const optionList:Option[] = optionValues.map(o => {
            const votes:string[] = [];
            return {label:o, votes:votes}
        });

        const dateTime = DateFuncions.parseDateTime(date, time);
        if(!dateTime || dateTime.getTime() < Date.now()) errors.push("Date/Time");

        const newPoll:Poll = {
            id:dataID,
            title:title,
            channel:interaction.channel,
            options:optionList, 
            endDate:(dateTime? dateTime: DateFuncions.getTomorrow()),
            active:false
        };

        DataHandlerObject.addPoll(newPoll);
        
        const returnButton = new NewPollReturnButton(dataID);
        const startbutton = new StartPollButton(dataID);
        const ar = new ActionRowBuilder<ButtonBuilder>();
        ar.addComponents(returnButton, startbutton);

        if(errors.length > 0) {
            startbutton.setDisabled(true);
            await interaction.reply({
                content: `Invalid:${errors}`, 
                components: [ar],
                ephemeral: true
            });
        }
        else {
            const msg = `Confirm details:\n`
                + `Title = ${newPoll.title}\n`
                + `Options = ${newPoll.options.flatMap(o=>o.label)}\n`
                + `End Date = ${DateFuncions.convertToDiscordTime(newPoll.endDate)}`;
            
            interaction.reply({
                content: msg, 
                components: [ar],
                ephemeral: true
            });
        }
    }
}
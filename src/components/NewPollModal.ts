import { ModalBuilder, TextInputBuilder } from "@discordjs/builders";
import { ActionRowBuilder, ButtonBuilder, ModalSubmitInteraction, TextInputStyle } from "discord.js";
import NewPollReturnButton from "./NewPollReturnButton.js";
import { DataHandlerObject } from "../DataHandler.js";
import { Option, Poll } from "../Poll.js";

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

    constructor(title?:string, options?:Option[], dateTime?:Date) {
        super();

        if(!title || !options || !dateTime) {
            this.titleInput.setValue("My Poll");
            this.optionsInput.setValue("Enter options here");
            this.setToDefaultEndDateTime();
        }
        else {
            const { date, time } = this.stringifyDateTime(dateTime);

            this.titleInput.setValue(title);
            this.optionsInput.setValue(options.flatMap(o => o.label).join(", "));
            this.endDateInput.setValue(date);
            this.endTimeInput.setValue(time);
        }

        this.build();
    }

    private build() {
        this.setCustomId(this.id);
        this.setTitle("New Modal");

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
        const dateTime = NewPollModal.getTomorrow();
        const {date, time} = this.stringifyDateTime(dateTime);
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

        const optionValues = options.split(",");
        optionValues.forEach(o => o.trim());
        if(optionValues.length == 0 || optionValues.includes("")) errors.push("Options");
        const optionList:Option[] = optionValues.map(o => {
            return {label:o, votes:0}
        });

        const dateTime = this.parseDateTime(date, time);
        if(!dateTime || dateTime.getTime() < Date.now()) errors.push("Date/Time");

        const newPoll:Poll = {
            id:dataID,
            title:title,
            options:optionList, 
            endDate:(dateTime? dateTime: this.getTomorrow()),
            active:false
        };
        DataHandlerObject.addPoll(dataID, newPoll);
        
        const returnButton = new NewPollReturnButton(dataID);
        const ar = new ActionRowBuilder<ButtonBuilder>();
        ar.addComponents(returnButton);

        if(errors.length > 0) {
            await interaction.reply({
                content: `Invalid:${errors}`, 
                components: [ar],
                ephemeral: true
            });
        }
        else {
            await interaction.reply({
                content: `Poll:${JSON.stringify(newPoll)}`, 
                components: [ar],
                ephemeral: true
            });
        }
    }

    static parseDateTime(date:string, time:string) {
		const reDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
		const reTime = /^[0-9]{2}:[0-9]{2}$/;
		if(!date.match(reDate) || !time.match(reTime)) {
			console.log("[ERR] Invalid date or time.");
			return;
		}
		const dateValues = date.split("/");
		const timeValues = time.split(":");

		const month = parseInt(dateValues[0]);
		if(month < 1 || month > 12) {
			console.log("[ERR] Invalid Month");
			return;
		}
		const day = parseInt(dateValues[1]);
		if(day < 1 || day > 31) {
			console.log("[ERR] Invalid date");
			return;
		}
		const hour = parseInt(timeValues[0]);
		if(hour < 0 || hour > 24) {
			console.log("[ERR] Invalid Hour")
			return;
		}
		const minute = parseInt(timeValues[1]);
		if(minute < 0 || minute > 59) {
			console.log("[ERR] Invaild Minute");
			return;
		}
		
		const dateTimeFormat = `${dateValues[2]}-${dateValues[0]}-${dateValues[1]}T${timeValues[0]}:${timeValues[1]}`;
		const dateTime = new Date(dateTimeFormat);
		if(isNaN(dateTime.getTime())) {
			console.log("[ERR] Could not parse date: " + dateTimeFormat);
			return;
		}
		
		return dateTime;
	}

    private stringifyDateTime(dateTime:Date) {
        let month = (dateTime.getMonth() + 1).toLocaleString();
        month = month.length == 1? "0" + month : month;
        let day = dateTime.getDate().toLocaleString();
        day = day.length == 1? "0" + day : day;
        const year = dateTime.getFullYear();
        
        const date = `${month}/${day}/${year}`;
        
        let hour = dateTime.getHours().toLocaleString();
        hour = hour.length == 1? "0" + hour : hour;
        let minute = dateTime.getMinutes().toLocaleString();
        minute = minute.length == 1? "0" + minute : minute;

        const time = `${hour}:${minute}`;

        return {date:date, time:time};
    }

    private static getTomorrow() {
        const dateTime = new Date();
        const tomorrow = new Date(dateTime)
        tomorrow.setDate(dateTime.getDate() + 1);
        return tomorrow;
    }
}
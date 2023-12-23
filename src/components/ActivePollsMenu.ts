import { CacheType, ChatInputCommandInteraction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { DataHandlerObject } from "../handlers/DataHandler";

export default class ActivePollsMenu extends StringSelectMenuBuilder {
    constructor(interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.setCustomId(`Active:${crypto.randomUUID()}`);

        if(!interaction.channel) {
            console.log("Channel is null");
            return;
        }
        const options = this.getActivePollOptions(interaction.channel.id);
        this.setOptions(options);
    }

    private getActivePollOptions(channelID:string) {
        const pollsMap = DataHandlerObject.getActivePolls(channelID);
        return pollsMap.map(p => {
            return new StringSelectMenuOptionBuilder()
                .setLabel(`"${p.title}" | ends ${p.endDate}`)
                .setValue(p.id);
        });
    }

    public static async select() {

    }
}
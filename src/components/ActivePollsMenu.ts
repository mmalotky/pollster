import { CacheType, ChatInputCommandInteraction, Interaction, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, TextBasedChannel } from "discord.js";
import ScheduleModal from "./ScheduleModal.js";
import { Poll } from "../utility/Poll.js";
import DataHandler from "../handlers/DataHandler.js";

export default class ActivePollsMenu extends StringSelectMenuBuilder {
    constructor(interaction: ChatInputCommandInteraction<CacheType>) {
        super();
        this.setCustomId(`Active:${crypto.randomUUID()}`);

        if(!interaction.channel) {
            console.log("Channel is null");
            return;
        }
    }

    async setActivePollOptions(channel:TextBasedChannel) {
        const options = await this.getActivePollOptions(channel);
        this.setOptions(options);
    }

    private async getActivePollOptions(channel:TextBasedChannel) {
        const pollsMap = await DataHandler.getActivePolls(channel);
        return pollsMap.map(p => {
            return new StringSelectMenuOptionBuilder()
                .setLabel(`"${p.title}" | ends ${p.endDate}`)
                .setValue(p.id);
        });
    }

    public static async select(
        interaction:Interaction, 
        poll:Poll
    ) {
        if(!interaction.isStringSelectMenu()) return;
        
        const scheduleModal = new ScheduleModal(poll);
        interaction.showModal(scheduleModal);
    }
}
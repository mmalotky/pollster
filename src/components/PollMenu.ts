import { Poll } from "../utility/Poll.js";
import { StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";

export default class PollMenu extends StringSelectMenuBuilder {
    constructor(poll:Poll) {
        super();
        this.setCustomId(`Poll:${poll.id}`);

        const menuOptions = poll.options.map(o => {
            return new StringSelectMenuOptionBuilder()
                .setLabel(o.label)
                .setValue(o.label)
        })
        this.setOptions(menuOptions);
        this.setMinValues(1);
    }
}
import dotenv from "dotenv";
import { REST, RESTPostAPIChatInputApplicationCommandsJSONBody, Routes} from "discord.js";
import PollCommand from "../commands/PollCommand.js";
import Command from "../commands/Command.js";
import ScheduleCommand from "../commands/ScheduleCommand.js";
import { ERR, INFO } from "../utility/LogMessage.js";

export default class CommandsHandler {
    private commands:Command[] = [];
    private commandsJSON:RESTPostAPIChatInputApplicationCommandsJSONBody[] = [];
    private rest = new REST({version:'10'});

    constructor() {
        dotenv.config();

        const pollCommand = new PollCommand();
        this.commands.push(pollCommand);
        this.commandsJSON.push(pollCommand.getData().toJSON());

        const scheduleCommand = new ScheduleCommand();
        this.commands.push(scheduleCommand);
        this.commandsJSON.push(scheduleCommand.getData().toJSON());

        if(process.env.TOKEN) this.rest.setToken(process.env.TOKEN);
        else ERR("No Token Found");
    }

    getCommands() {
        return this.commands;
    }

    register() {
        try {
            INFO("Registering commands...");
    
            if(process.env.CLIENT_ID && process.env.SERVER_ID) {
                this.rest.put(
                    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.SERVER_ID),
                    {body: this.commandsJSON}
                )
    
                INFO("...Commands Registered");
            }
            else ERR("Client/ Server ID's not Found");
        }
        catch(err) { ERR(err) }
    }
}
import { Client, TextBasedChannel } from "discord.js";
import { Poll, Option } from "../utility/Poll.js";
import fs from "fs";
import {readFile, readdir} from "fs/promises";
import DateFuncions from "../utility/DateFunctions.js";
import ScheduleHandler from "./ScheduleHandler.js";

export default class DataHandler {
    private static DATA_PATH = "./data";
    private client:Client<boolean>;

    constructor(client:Client) {
        this.client = client;
    }

    public setup() {
        console.log("[INFO] Setting up polls");
        this.runPath(DataHandler.DATA_PATH);
    }

    private async runPath(path:string) {
        const stats = fs.statSync(path);
        if(stats.isDirectory()) {
            const files = fs.readdirSync(path);
            for(const file of files) {
                this.runPath(`${path}/${file}`);
            }
        }
        else {
            const data = fs.readFileSync(path, { encoding: "utf-8" });
            const poll:Poll = JSON.parse(data);
            if(!poll.channel) {
                return console.log(`[ERR] Poll ${poll.id} missing channel.`);
            }

            poll.endDate = new Date(poll.endDate);

            const channel = await this.getChannel(poll.channel.id);
            if(!channel) return console.log(`[ERR] Could not find Channel ${poll.channel.id}.`);
            if(!channel.isTextBased()) return console.log(`[ERR] Channel ${poll.channel.id} is not a valid type.`);
            poll.channel = channel;

            if(DateFuncions.isExpired(poll.endDate)) {
                DataHandler.removePoll(poll);
            }
            else {
                ScheduleHandler.schedulePoll(poll);
            }
        }
    }

	public static async addPoll(poll:Poll) {
        if(!poll.channel) {
            return console.log(`[ERR] Poll ${poll.id} missing channel.`);
        }
        const path = this.getFilePath(poll.id, poll.channel.id);
        const folderPath = path.substring(0, path.lastIndexOf("/"));
        fs.mkdirSync(folderPath, {recursive: true});

        const json = JSON.stringify(poll);
        fs.writeFile(path, json, (err) => this.handleIOErr(err));
	}

    public static async setPoll(poll:Poll, value: boolean | Option[] | Date) {
        if(!poll.channel) {
            return console.log(`[ERR] Poll ${poll.id} missing channel.`);
        }

        if(typeof value === "boolean") {
            poll.active = value;
        }
        else if (value instanceof Date) {
            poll.endDate = value;
        }
        else if (Array.isArray(value)) {
            poll.options = value;
        }

        const path = this.getFilePath(poll.id, poll.channel.id);
        const json = JSON.stringify(poll);
        fs.writeFile(path, json, (err) => {
            if(err) console.log("[WARN] Poll data lost or expired.");
        });
    }

    public static async removePoll(poll:Poll) {
        if(!poll.channel) {
            return console.log(`[ERR] Poll ${poll.id} missing channel.`);
        }
        const path = this.getFilePath(poll.id, poll.channel.id);
        fs.rm(path, (err) => this.handleIOErr(err));
    }

    public static async getPoll(pollID:string, channel:TextBasedChannel | null) {
        if(!channel) {
            return console.log(`[ERR] Poll ${pollID} missing channel.`);
        }
        const path = this.getFilePath(pollID, channel.id);
        try {
            const data = await readFile(path, {encoding: "utf8"});

            const poll:Poll = JSON.parse(data);
            poll.endDate = new Date(poll.endDate);
            poll.channel = channel;

            return poll;
        } catch (err) {
            this.handleIOErr(err);
        }
    }

    public static async getActivePolls(channel:TextBasedChannel) {
        const folderPath:string = `${this.DATA_PATH}/${channel.id.substring(0,2)}/${channel.id.substring(2)}`;
        const files = await readdir(folderPath);
        const polls:Poll[] = [];
        for(const file of files) {
            const pollID = file.substring(0, file.indexOf("."));
            const poll = await this.getPoll(pollID, channel);
            if(poll && poll.active) polls.push(poll);
        }
        return polls;
    }

    public static vote(poll:Poll, selections:string[], username:string) {
        const options = poll.options;
        for(const selection of selections) {
            const option = options.find(o => o.label === selection);
            if(option) {
                if(!option.votes.includes(username)) {
                    option.votes.push(username);
                }
            }
            else {
                console.log(`[ERR]: Option ${selection} does not exist in Poll ${poll.id}`)
            }
        }
        
        const unselected = options.filter(o => !selections.includes(o.label));
        for(const option of unselected) {
            option.votes = option.votes.filter(user => user !== username);
        }
        this.setPoll(poll, options);
    }

    private static getFilePath(pollID:string, channelID:string) {
        return `${this.DATA_PATH}/${channelID.substring(0,2)}/${channelID.substring(2)}/${pollID}.json`;
    }

    private static handleIOErr(err: NodeJS.ErrnoException | null) {
        if(err) {
            console.log(err);
            return false;
        }
        else return true;
    }

    private async getChannel(channelID:string) {
        return await this.client.channels.fetch(channelID);
    }
}
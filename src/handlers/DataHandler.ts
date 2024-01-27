import { Collection } from "discord.js";
import { Poll, schedulePoll } from "../utility/Poll.js";
import { CronJob } from "cron";
import fs from "fs";
import {readFile, readdir} from "fs/promises";

class DataHandler {
    private schedule = new Collection<string, CronJob<null,null>[]>();
    private dataPath = "./data";

	public async addPoll(poll:Poll) {
        if(!poll.channel) {
            return console.log(`[ERR] Poll ${poll.id} missing channel.`);
        }
        const path = this.getFilePath(poll.id, poll.channel.id);
        const folderPath = path.substring(0, path.lastIndexOf("/"));
        fs.mkdirSync(folderPath, {recursive: true});

        const json = JSON.stringify(poll);
        fs.writeFile(path, json, (err) => this.handleIOErr(err));

        schedulePoll(poll);
	}

    public async removePoll(poll:Poll) {
        if(!poll.channel) {
            return console.log(`[ERR] Poll ${poll.id} missing channel.`);
        }
        const path = this.getFilePath(poll.id, poll.channel.id);
        fs.rm(path, (err) => this.handleIOErr(err));

        this.removeEvents(poll.id);
    }

    public async getPoll(pollID:string, channelID:string | null) {
        if(!channelID) {
            return console.log(`[ERR] Poll ${pollID} missing channel.`);
        }
        const path = this.getFilePath(pollID, channelID);
        try {
            const data = await readFile(path, {encoding: "utf8"});

            const poll:Poll = JSON.parse(data);
            poll.endDate = new Date(poll.endDate);

            return poll;
        } catch (err) {
            this.handleIOErr(err);
        }
    }

    public async getActivePolls(channelID:string) {
        const folderPath:string = `${this.dataPath}/${channelID.substring(0,2)}/${channelID.substring(2)}`;
        const files = await readdir(folderPath);
        const polls:Poll[] = [];
        for(const file of files) {
            const pollID = file.substring(0, file.indexOf("."));
            const poll = await this.getPoll(pollID, channelID);
            if(poll && poll.active) polls.push(poll);
        }
        return polls;
    }

    public addEvent(id:string, event:CronJob<null,null>) {
        let events = this.schedule.get(id);
        if(!events) {
            events = new Array<CronJob<null,null>>;
            this.schedule.set(id, events);
        }
        event.start();
        events.push(event);
    }

    public removeEvents(id:string) {
        const events = this.schedule.get(id);
        if(events) events.forEach(e => e.stop());
        this.schedule.delete(id);
    }

    public getEvents(id:string) {
        return this.schedule.get(id);
    }

    private getFilePath(pollID:string, channelID:string) {
        return `${this.dataPath}/${channelID.substring(0,2)}/${channelID.substring(2)}/${pollID}.json`;
    }

    private handleIOErr(err: NodeJS.ErrnoException | null) {
        if(err) {
            console.log(err);
            return false;
        }
        else return true;
    }
}

export const DataHandlerObject = new DataHandler;
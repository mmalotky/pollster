import { Collection } from "discord.js";
import { Poll } from "../utility/Poll.js";
import { CronJob } from "cron";

class DataHandler {
    private polls = new Collection<string, Poll>();
    private schedule = new Collection<string, CronJob<null,null>[]>();

	public addPoll(id:string, poll:Poll) {
		this.polls.set(id, poll);
	}

    public removePoll(id:string) {
        this.polls.delete(id);
    }

    public getPoll(id:string) {
        return this.polls.get(id);
    }

    public addEvent(id:string, event:CronJob<null,null>) {
        let events = this.schedule.get(id);
        if(!events) {
            events = new Array<CronJob<null,null>>;
            this.schedule.set(id, events);
        }
        events.push(event);
    }

    public removeEvents(id:string) {
        this.schedule.delete(id);
    }

    public getEvents(id:string) {
        return this.schedule.get(id);
    }
}

export const DataHandlerObject = new DataHandler;
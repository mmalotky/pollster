import { CronJob } from "cron";
import { Collection } from "discord.js";
import DateFuncions from "./DateFunctions";
import { Poll } from "./Poll";

export default class Schedule {
    private schedule = new Collection<string, CronJob<null,null>[]>();

    public addEvent(date:Date, payload:Poll, execute:(paylod:Poll, date:Date)=>void) {
        if(DateFuncions.isExpired(date)) return;

        const event = new CronJob(date, () => execute(payload, date));

        let events = this.schedule.get(payload.id);
        if(!events) {
            events = new Array<CronJob<null,null>>;
            this.schedule.set(payload.id, events);
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
}
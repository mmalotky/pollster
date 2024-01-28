import { CronJob } from "cron";
import { Poll } from "../utility/Poll";
import DateFuncions from "../utility/DateFunctions";
import ResultsChart from "../components/ResultsChart";
import { Collection } from "discord.js";
import DataHandler from "./DataHandler";

export default class ScheduleHandler {
    private static schedule = new Collection<string, CronJob<null,null>[]>();

    public static addEvent(poll:Poll, date:Date) {
        if(DateFuncions.isExpired(date)) return;

        const event = new CronJob(
            date,
            () => {
                if(poll.endDate.getTime() === date.getTime()) this.sendResults(poll);
                else this.sendReminder(poll, date);
            }
        );

        let events = this.schedule.get(poll.id);
        if(!events) {
            events = new Array<CronJob<null,null>>;
            this.schedule.set(poll.id, events);
        }
        event.start();
        events.push(event);
    }

    public static removeEvents(id:string) {
        const events = this.schedule.get(id);
        if(events) events.forEach(e => e.stop());
        this.schedule.delete(id);
    }

    public static getEvents(id:string) {
        return this.schedule.get(id);
    }

    private static sendResults(poll:Poll) {
        DataHandler.removePoll(poll);
        this.removeEvents(poll.id);

        if(!poll.active) return;
        if(!poll.channel) {
            console.log("[ERR] Channel is null");
            return;
        }

        const chart = new ResultsChart(poll);
        poll.channel.send({
            embeds: [chart.getEmbed()]
        });
    }

    private static sendReminder(poll:Poll, date:Date) {
        if(!poll.channel) {
            console.log("[ERR] Channel is null");
            return;
        }

        const countDown = DateFuncions.getTimeDifference(poll.endDate, date);
        const message = `${poll.title} ends in ${countDown}`;
        
        poll.channel.send(message);
    }
}
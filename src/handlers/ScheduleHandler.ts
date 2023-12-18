import { CronJob } from "cron";
import { Poll } from "../utility/Poll";
import { DataHandlerObject } from "./DataHandler";
import DateFuncions from "../utility/DateFunctions";

export default class ScheduleHandler {
    public static createJob(poll:Poll, date:Date) {
        if(date.getTime() < Date.now()) return;

        const job = new CronJob(
            date,
            () => {
                if(poll.endDate.getTime() === date.getTime()) this.sendResults(poll);
                else this.sendReminder(poll, date);
            }
        );
        job.start();
    }

    private static sendResults(poll:Poll) {
        if(!poll.channel) {
            console.log("[ERR] Channel is null");
            return;
        }

        const message = `${poll.title} - RESULTS\n` + poll.options
            .map(o => `${o.label}: ${o.votes.size}`)
            .join("\n");

        poll.channel.send(message);
        DataHandlerObject.removePoll(poll.id);
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
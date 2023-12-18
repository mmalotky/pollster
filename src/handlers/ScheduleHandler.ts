import { CronJob } from "cron";
import { Poll } from "../utility/Poll";
import { DataHandlerObject } from "./DataHandler";

export default class ScheduleHandler {
    public static createJob(poll:Poll, date:Date) {
        if(date.getTime() < Date.now()) return;

        const job = new CronJob(
            date,
            () => {
                if(poll.endDate.getTime() === date.getTime()) this.sendResults(poll);
                else this.sendReminder(poll);
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

    private static sendReminder(poll:Poll) {
        if(!poll.channel) {
            console.log("[ERR] Channel is null");
            return;
        }

        const message = `${poll.title} ends on ${poll.endDate}`;
        poll.channel.send(message);
    }
}
import { CronJob } from "cron";
import { Poll } from "../utility/Poll";
import { DataHandlerObject } from "./DataHandler";
import DateFuncions from "../utility/DateFunctions";
import ResultsChart from "../components/ResultsChart";

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

        DataHandlerObject.addEvent(poll.id, job);
    }

    private static sendResults(poll:Poll) {
        DataHandlerObject.removePoll(poll);

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
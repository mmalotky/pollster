import { Poll } from "../utility/Poll";
import DateFuncions from "../utility/DateFunctions";
import ResultsChart from "../components/ResultsChart";
import DataHandler from "./DataHandler";
import Schedule from "../utility/Schedule";
import { ERR } from "../utility/LogMessage";

export default class ScheduleHandler {
    private static schedule = new Schedule();

    public static schedulePoll(poll:Poll) {
        const date = poll.endDate;
        this.schedule.addEvent(date, poll, this.sendResults);

        const hourReminder = new Date(date);
        hourReminder.setHours(hourReminder.getHours() - 1);
        this.schedule.addEvent(hourReminder, poll, this.sendReminder);

        const dayReminder = new Date(date);
        dayReminder.setDate(dayReminder.getDate() - 1);
        this.schedule.addEvent(dayReminder, poll, this.sendReminder);
    }

    public static reschedulePoll(poll:Poll, date:Date) {
        DataHandler.setPoll(poll, date);
        this.schedule.removeEvents(poll.id);
        this.schedulePoll(poll);
    }

    private static sendResults(poll:Poll) {
        DataHandler.removePoll(poll);
        ScheduleHandler.schedule.removeEvents(poll.id);

        if(!poll.active) return;
        if(!poll.channel) {
            ERR("Channel is null");
            return;
        }

        const chart = new ResultsChart(poll);
        poll.channel.send({
            embeds: [chart.getEmbed()]
        });
    }

    private static sendReminder(poll:Poll, date:Date) {
        if(!poll.channel) {
            ERR("Channel is null");
            return;
        }

        const countDown = DateFuncions.getTimeDifference(poll.endDate, date);
        const message = `${poll.title} ends in ${countDown}`;
        
        poll.channel.send(message);
    }
}
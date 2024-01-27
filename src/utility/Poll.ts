import { TextBasedChannel } from "discord.js";
import ScheduleHandler from "../handlers/ScheduleHandler.js";
import { DataHandlerObject } from "../handlers/DataHandler.js";

export type Poll = {
    id:string;
    title:string;
    channel:TextBasedChannel | null;
    options:Option[];
    endDate:Date;
    active:boolean;
}

export type Option = {
    label:string;
    votes:string[];
}

export function schedulePoll(poll:Poll) {
    ScheduleHandler.createJob(poll, poll.endDate);
}

export function scheduleReminders(poll:Poll) {
    const hourReminder = new Date(poll.endDate);
    hourReminder.setHours(hourReminder.getHours() - 1);
    ScheduleHandler.createJob(poll, hourReminder);

    const dayReminder = new Date(poll.endDate);
    dayReminder.setDate(dayReminder.getDate() - 1);
    ScheduleHandler.createJob(poll, dayReminder);
}

export function reschedulePoll(poll:Poll, date:Date) {
    poll.endDate = date;
    DataHandlerObject.setPoll(poll);
    DataHandlerObject.removeEvents(poll.id);
    schedulePoll(poll);
    scheduleReminders(poll);
}
import { TextBasedChannel } from "discord.js";
import ScheduleHandler from "../handlers/ScheduleHandler";

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
    votes:Set<string>;
}

export function schedulePoll(poll:Poll) {
    ScheduleHandler.createJob(poll, poll.endDate);
    
    const hourReminder = new Date(poll.endDate);
    hourReminder.setHours(hourReminder.getHours() - 1);
    ScheduleHandler.createJob(poll, hourReminder);

    const dayReminder = new Date(poll.endDate);
    dayReminder.setDate(dayReminder.getDate() - 1);
    ScheduleHandler.createJob(poll, dayReminder);
}
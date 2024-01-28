import { TextBasedChannel } from "discord.js";
import ScheduleHandler from "../handlers/ScheduleHandler.js";
import DataHandler from "../handlers/DataHandler.js";

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
    ScheduleHandler.addEvent(poll, poll.endDate);
}

export function scheduleReminders(poll:Poll) {
    const hourReminder = new Date(poll.endDate);
    hourReminder.setHours(hourReminder.getHours() - 1);
    ScheduleHandler.addEvent(poll, hourReminder);

    const dayReminder = new Date(poll.endDate);
    dayReminder.setDate(dayReminder.getDate() - 1);
    ScheduleHandler.addEvent(poll, dayReminder);
}

export function reschedulePoll(poll:Poll, date:Date) {
    DataHandler.setPoll(poll, date);
    ScheduleHandler.removeEvents(poll.id);
    schedulePoll(poll);
    scheduleReminders(poll);
}

export function vote(poll:Poll, selections:string[], username:string) {
    const options = poll.options;
    for(const selection of selections) {
        const option = options.find(o => o.label === selection);
        if(option) {
            if(!option.votes.includes(username)) {
                option.votes.push(username);
            }
        }
        else {
            console.log(`[ERR]: Option ${selection} does not exist in Poll ${poll.id}`)
        }
    }
    
    const unselected = options.filter(o => !selections.includes(o.label));
    for(const option of unselected) {
        option.votes = option.votes.filter(user => user !== username);
    }
    DataHandler.setPoll(poll, options);
}
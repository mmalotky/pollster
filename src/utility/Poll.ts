import { TextBasedChannel } from "discord.js";

export type ScheduleEvent = {
    id:string;
    channel:TextBasedChannel | null;
    endDate:Date;
    active:boolean;
}

export interface Poll extends ScheduleEvent {
    title:string;
    options:Option[];
}

export type Option = {
    label:string;
    votes:string[];
}
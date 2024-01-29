import { TextBasedChannel } from "discord.js";
import DataHandler from "../handlers/DataHandler";
import ScheduleHandler from "../handlers/ScheduleHandler";

export interface Poll {
    title:string;
    options:Option[];
    id:string;
    channel:TextBasedChannel | null;
    endDate:Date;
    active:boolean;
}

export type Option = {
    label:string;
    votes:string[];
}

export function createPoll(
    dataID:string,
    title:string, 
    channel:TextBasedChannel | null, 
    options:Option[],
    endDate:Date,
    active:boolean
) {
    const poll:Poll = {
        id:dataID,
        title:title,
        channel:channel,
        options:options, 
        endDate:endDate,
        active:active
    };

    DataHandler.addPoll(poll);
    ScheduleHandler.schedulePoll(poll);
    return poll;
}
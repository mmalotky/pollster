import { Collection } from "discord.js";
import { Poll } from "../utility/Poll.js";

class DataHandler {
    private polls = new Collection<string, Poll>();

	public addPoll(id:string, poll:Poll) {
		this.polls.set(id, poll);
	}

    public removePoll(id:string) {
        this.polls.delete(id);
    }

    public getPoll(id:string) {
        return this.polls.get(id);
    }
}

export const DataHandlerObject = new DataHandler;
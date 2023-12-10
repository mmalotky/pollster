import { Collection } from "discord.js";
import { NewPoll } from "./components/NewPollModal.js";

class DataHandler {
    private newPolls = new Collection<string, NewPoll>();

	public addNewPoll(id:string, newPoll:NewPoll) {
		this.newPolls.set(id, newPoll);
	}

    public getNewPoll(id:string) {
        return this.newPolls.get(id);
    }
}

export const DataHandlerObject = new DataHandler;
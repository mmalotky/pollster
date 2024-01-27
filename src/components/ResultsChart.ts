import { Poll } from "../utility/Poll.js";
import QuickChart from "quickchart-js";

export default class ResultsChart extends QuickChart {
    private poll:Poll;

    constructor(poll:Poll) {
        super();
        this.poll = poll;

        const config = {
            type:"horizontalBar",
            data: {
                labels: poll.options.flatMap(o=>o.label),
                datasets: [
                    {
                        label: "votes",
                        data: poll.options.flatMap(o=>o.votes.length)
                    }
                ]
            },
            options: {
                legend: {
                    display: false
                }
            }
        }

        this.setConfig(config);
        this.setWidth(1000);
        this.setHeight(500);
    }

    public getEmbed() {
        return {
            title: this.poll.title,
            description: "Completed on " + this.poll.endDate,
            image: {
                url: this.getUrl()
            }
        }
    }
}
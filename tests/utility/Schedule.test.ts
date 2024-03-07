import { CronJob } from "cron";
import { Option, Poll } from "../../src/utility/Poll";
import Schedule from "../../src/utility/Schedule"

const schedule = new Schedule();

const mockOptions:Option[] = [
    {label:"One",votes:[]},
    {label:"Two", votes:[]}
]
const tomorrow = new Date(Date.now() + 864E5);
const mockPoll:Poll = {
    id:"testID",
    title:"testTitle",
    channel:null,
    options:mockOptions,
    endDate:tomorrow,
    active:true
}

test("ShouldAddEvent", () => {
    expect(schedule.getQueueSize()).toBe(0);

    schedule.addEvent(tomorrow, mockPoll, (mockPoll, tomorrow) => { return true });
    expect(schedule.getQueueSize()).toBe(1);
})

test("ShouldGetEvent", () => {
    const events = schedule.getEvents("testID");
    expect(events).not.toBeUndefined();
    if(events === undefined) return;

    expect(events.length).toBe(1);
    const event = events[0];
    expect(event).toBeInstanceOf(CronJob<null, null>);
})

test("ShouldNotGetMissingEvent", () => {
    const events = schedule.getEvents("");
    expect(events).toBeUndefined();
})

test("ShouldDeleteEvent", () => {
    expect(schedule.getQueueSize()).toBe(1);
    const success = schedule.removeEvents("testID");
    expect(success).toBe(true);
    expect(schedule.getQueueSize()).toBe(0);
})
import DateFunctions from "../../src/utility/DateFunctions";

beforeEach(() => {
    jest.spyOn(console, 'warn').mockImplementation(jest.fn());
});

test("ShouldConvertDateToDiscordFormat", ()=> {
    const date = new Date("2024-03-06T12:00:00");
    const actual = DateFunctions.convertToDiscordTime(date);
    expect(actual).toBe("<t:1709744400>");
});

test("ShouldParseDateTime", () => {
    const date = new Date("2024-03-06T12:00:00");
    const actual = DateFunctions.parseDateTime("03/06/2024", "12:00");
    expect(actual?.getTime()).toBe(date.getTime());
})

test("ShouldNotParseInvalidDate", () => {
    const test1 = DateFunctions.parseDateTime("", "12:00");
    expect(test1).toBeUndefined();

    const test2 = DateFunctions.parseDateTime("//", "12:00");
    expect(test2).toBeUndefined();

    const test3 = DateFunctions.parseDateTime("20/01/2024", "12:00");
    expect(test3).toBeUndefined();

    const test4 = DateFunctions.parseDateTime("01/32/2024", "12:00");
    expect(test4).toBeUndefined();

    const test5 = DateFunctions.parseDateTime("mm/dd/yyyy", "12:00");
    expect(test5).toBeUndefined();
})

test("ShouldNotParseInvalidTime", () => {
    const test1 = DateFunctions.parseDateTime("03/06/2024", "");
    expect(test1).toBeUndefined();
    
    const test2 = DateFunctions.parseDateTime("03/06/2024", ":");
    expect(test2).toBeUndefined();

    const test3 = DateFunctions.parseDateTime("03/06/2024", "25:00");
    expect(test3).toBeUndefined();

    const test4 = DateFunctions.parseDateTime("03/06/2024", "12:61");
    expect(test4).toBeUndefined();

    const test5 = DateFunctions.parseDateTime("03/06/2024", "hh:mm");
    expect(test5).toBeUndefined();
})

test("ShouldGetTomorrow", () => {
    const expected = Date.now() + 864E5;
    const actual = DateFunctions.getTomorrow();
    expect(Math.floor(actual.getTime()/1000)).toBe(Math.floor(expected/1000));
})

test("ShouldDetectExpired", () => {
    const tomorrow = new Date(Date.now() + 864E5);
    const test1 = DateFunctions.isExpired(tomorrow);
    expect(test1).toBe(false);

    const yesterday = new Date(Date.now() - 864E5);
    const test2 = DateFunctions.isExpired(yesterday);
    expect(test2).toBe(true);
})

test("ShouldStringifyDateTime", () => {
    const date = new Date("2024-03-06T12:00:00");
    const actual = DateFunctions.stringifyDateTime(date);
    expect(actual.date).toBe("03/06/2024");
    expect(actual.time).toBe("12:00");
})

test("ShouldGetTimeDifference", () => {
    const date1 = new Date("2024-03-06T12:00:00");
    const date2 = new Date("2024-03-06T12:01:00");
    const date3 = new Date("2024-03-06T13:00:00");
    const date4 = new Date("2024-03-07T12:00:00");
    const date5 = new Date("2024-03-09T11:02:00");

    const test1 = DateFunctions.getTimeDifference(date1, date1);
    const test2 = DateFunctions.getTimeDifference(date1, date2);
    const test3 = DateFunctions.getTimeDifference(date1, date3);
    const test4 = DateFunctions.getTimeDifference(date1, date4);
    const test5 = DateFunctions.getTimeDifference(date1, date5);

    expect(test1).toBe("");
    expect(test2).toBe("1 minute");
    expect(test3).toBe("1 hour");
    expect(test4).toBe("1 day");
    expect(test5).toBe("2 days 23 hours 2 minutes");
})
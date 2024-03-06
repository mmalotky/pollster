import DateFunctions from "../../src/utility/DateFunctions";

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
})
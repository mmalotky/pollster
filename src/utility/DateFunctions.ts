export default class DateFuncions {
    public static parseDateTime(date:string, time:string) {
		const reDate = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
		const reTime = /^[0-9]{2}:[0-9]{2}$/;
		if(!date.match(reDate) || !time.match(reTime)) {
			console.log("[ERR] Invalid date or time.");
			return;
		}
		const dateValues = date.split("/");
		const timeValues = time.split(":");

		const month = parseInt(dateValues[0]);
		if(month < 1 || month > 12) {
			console.log("[ERR] Invalid Month");
			return;
		}
		const day = parseInt(dateValues[1]);
		if(day < 1 || day > 31) {
			console.log("[ERR] Invalid date");
			return;
		}
		const hour = parseInt(timeValues[0]);
		if(hour < 0 || hour > 24) {
			console.log("[ERR] Invalid Hour")
			return;
		}
		const minute = parseInt(timeValues[1]);
		if(minute < 0 || minute > 59) {
			console.log("[ERR] Invaild Minute");
			return;
		}
		
		const dateTimeFormat = `${dateValues[2]}-${dateValues[0]}-${dateValues[1]}T${timeValues[0]}:${timeValues[1]}`;
		const dateTime = new Date(dateTimeFormat);
		if(isNaN(dateTime.getTime())) {
			console.log("[ERR] Could not parse date: " + dateTimeFormat);
			return;
		}
		
		return dateTime;
	}

    public static stringifyDateTime(dateTime:Date) {
        let month = (dateTime.getMonth() + 1).toLocaleString();
        month = month.length == 1? "0" + month : month;
        let day = dateTime.getDate().toLocaleString();
        day = day.length == 1? "0" + day : day;
        const year = dateTime.getFullYear();
        
        const date = `${month}/${day}/${year}`;
        
        let hour = dateTime.getHours().toLocaleString();
        hour = hour.length == 1? "0" + hour : hour;
        let minute = dateTime.getMinutes().toLocaleString();
        minute = minute.length == 1? "0" + minute : minute;

        const time = `${hour}:${minute}`;

        return {date:date, time:time};
    }

    public static getTomorrow() {
        const dateTime = new Date();
        const tomorrow = new Date(dateTime)
        tomorrow.setDate(dateTime.getDate() + 1);
        return tomorrow;
    }

	public static getTimeDifference(d1:Date, d2:Date) {
		let result = "";
		let diff = d1.getTime() - d2.getTime();
		
		const days = Math.floor(diff/86400000);
		if(days > 0) {
			result += ` ${days} day${days === 1? "" : "s"}`;
			diff -= (days * 86400000);
		}

		const hours = Math.floor(diff/3600000);
		if(hours > 0) {
			result += ` ${hours} hour${hours === 1? "" : "s"}`;
			diff -= (hours * 3600000);
		}

		const minutes = Math.floor(diff/60000);
		if(minutes > 0) {
			result += ` ${minutes} minute${minutes === 1? "" : "s"}`;
		}

		result = result.trim();
		return result;
	}

	public static convertToDiscordTime(date:Date, format?:string) {
		const time = Math.floor(date.getTime()/1000);
		return `<t:${time}${format? `:${format}` : ""}>`;
	}

	public static getTimeZone() {
		const match = new Date().toString().match(/([A-Z]+[+-][0-9]+)/);
		
		if(!match) return `UTC ${new Date().getTimezoneOffset() / 60}`;
		else return match[0];
	}

	public static isExpired(date:Date) {
		return date.getTime() < Date.now();
	}
}
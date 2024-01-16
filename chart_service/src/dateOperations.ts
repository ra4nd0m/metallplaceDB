export function getFullRuMonth(dateStr: string): string {
    const date: Date = new Date(dateStr);
    const monthNames: string[] = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    return monthNames[date.getMonth()];
}

export function countSameWeekDates(dates: string[]) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dates[0])) {
        return 0;
    }
    let count = 0;
    let borderDay = getMonday(toDate(dates[dates.length - 1]))
    for (let i = dates.length - 1; i >= 0; i--) {

        if (toDate(dates[i]) >= borderDay) {
            count++
            continue
        }
        return count;
    }
    return count;
}

export function getMonday(date: Date) {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
    return new Date(date.setDate(diff));
}

export function toDate(dateString: string): Date {
    const parts: string[] = dateString.split("-");
    const year: number = parseInt(parts[0], 10);
    const month: number = parseInt(parts[1], 10) - 1; // Months are zero-based in JavaScript
    const day: number = parseInt(parts[2], 10);

    return new Date(year, month, day);
}

// @ts-ignore
export function getRuMonth(dateStr: string): string {
    const date = new Date(Date.parse(dateStr));
    const month = date.getMonth();
    const year = date.getFullYear().toString().slice(-2);
    switch (month) {
        case 0:
            return 'Янв\'' + year;
        case 1:
            return 'Фев\'' + year;
        case 2:
            return 'Мар\'' + year;
        case 3:
            return 'Апр\'' + year;
        case 4:
            return 'Май\'' + year;
        case 5:
            return 'Июн\'' + year;
        case 6:
            return 'Июл\'' + year;
        case 7:
            return 'Авг\'' + year;
        case 8:
            return 'Сен\'' + year;
        case 9:
            return 'Окт\'' + year;
        case 10:
            return 'Ноя\'' + year;
        case 11:
            return 'Дек\'' + year;
    }
}

export function getWeekNumber(date: Date): number {
    // Copying date so the original date won't be modified
    const tempDate = new Date(date.valueOf());

    // ISO week date weeks start on Monday, so correct the day number
    const dayNum = (date.getDay() + 6) % 7;

    // Set the target to the nearest Thursday (current date + 4 - current day number)
    tempDate.setDate(tempDate.getDate() - dayNum + 3);

    // ISO 8601 week number of the year for this date
    const firstThursday = tempDate.valueOf();

    // Set the target to the first day of the year
    // First set the target to January 1st
    tempDate.setMonth(0, 1);

    // If this is not a Thursday, set the target to the next Thursday
    if (tempDate.getDay() !== 4) {
        tempDate.setMonth(0, 1 + ((4 - tempDate.getDay()) + 7) % 7);
    }

    // The weeknumber is the number of weeks between the first Thursday of the year
    // and the Thursday in the target week
    return 1 + Math.ceil((firstThursday - tempDate.valueOf()) / 604800000); // 604800000 = number of milliseconds in a week
}





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
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const dayOfYear = ((date.getTime() - firstDayOfYear.getTime()) / 86400000) + 1;
    return Math.ceil(dayOfYear / 7);
}





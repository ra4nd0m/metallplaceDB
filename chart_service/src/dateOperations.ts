export function getFullRuMonth(dateStr: string): string {
    const date: Date = new Date(dateStr);
    const monthNames: string[] = [
        'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
        'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
    ];
    return monthNames[date.getMonth()];
}
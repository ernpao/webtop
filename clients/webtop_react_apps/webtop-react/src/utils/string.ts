export function trimToLength(str: string, maxLength: number): string {
    return str.length > maxLength ? str.substring(0, maxLength) + '...' : str.trim();
}

export function toPx(num: number): string { return `${num}px` }

export function toTwoPlaces(num: number): string { return (Math.round(num * 100) / 100).toFixed(2).toString(); }

export function toPercentageStr(num: number): string { return `${toTwoPlaces(num / 100)}%` }

export function toPercentageStrFromDivisor(divisor: number): string { return `${toTwoPlaces(100 / divisor)}%` }

export function formatDateToString(date: Date): string {
    const month = date.toLocaleString('en-US', { month: 'short' }) + '.';
    const day = date.getUTCDate();
    const year = date.getFullYear();
    return `${month} ${day}, ${year}`;
}
export const roundNumber = (num: number, dec: number): number => {
    return Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
};
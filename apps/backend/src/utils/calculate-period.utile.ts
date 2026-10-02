import { Period } from './period.utile';

export const calculatePeriod = (
  year: number,
  isFirstPeriod: boolean
): Period => {
  const periodStart = new Date(year, isFirstPeriod ? 0 : 6, 1);
  // Day 0 of the following month is the last day of the period's final month
  // (June 30 or December 31).
  const periodEnd = new Date(year, isFirstPeriod ? 6 : 12, 0, 23, 59, 59, 999);

  return {
    periodStart,
    periodEnd,
  };
};

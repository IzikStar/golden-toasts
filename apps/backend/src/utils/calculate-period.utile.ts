import { Period } from './period.utile';

export const calculatePeriod = (
  year: number,
  isFirstPeriod: boolean
): Period => {
  const periodStart = new Date(year, isFirstPeriod ? 0 : 6, 1);
  const periodEnd = new Date(year, isFirstPeriod ? 5 : 11, 30, 23, 59, 59, 999);

  return {
    periodStart,
    periodEnd,
  };
};

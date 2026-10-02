import { calculatePeriod } from './calculate-period.utile';

const isInPeriod = (date: Date, year: number, isFirstPeriod: boolean) => {
  const { periodStart, periodEnd } = calculatePeriod(year, isFirstPeriod);
  return date >= periodStart && date <= periodEnd;
};

describe('calculatePeriod', () => {
  it('returns January 1 to the end of June 30 for the first half-year', () => {
    const { periodStart, periodEnd } = calculatePeriod(2025, true);

    expect(periodStart).toEqual(new Date(2025, 0, 1, 0, 0, 0, 0));
    expect(periodEnd).toEqual(new Date(2025, 5, 30, 23, 59, 59, 999));
  });

  it('returns July 1 to the end of December 31 for the second half-year', () => {
    const { periodStart, periodEnd } = calculatePeriod(2025, false);

    expect(periodStart).toEqual(new Date(2025, 6, 1, 0, 0, 0, 0));
    expect(periodEnd).toEqual(new Date(2025, 11, 31, 23, 59, 59, 999));
  });

  it.each([
    ['Jan 1, 00:00', new Date(2025, 0, 1, 0, 0), true],
    ['Jun 30, 23:59:59.999', new Date(2025, 5, 30, 23, 59, 59, 999), true],
    ['Jul 1, 00:00', new Date(2025, 6, 1, 0, 0), false],
    ['Dec 31, 18:00', new Date(2025, 11, 31, 18, 0), false],
    ['Dec 31, 23:59:59.999', new Date(2025, 11, 31, 23, 59, 59, 999), false],
  ])('puts %s in the expected half of 2025', (_label, date, inFirstHalf) => {
    expect(isInPeriod(date, 2025, true)).toBe(inFirstHalf);
    expect(isInPeriod(date, 2025, false)).toBe(!inFirstHalf);
  });

  it('does not count January 1 of the next year in the previous second half', () => {
    const newYear = new Date(2026, 0, 1, 0, 0);

    expect(isInPeriod(newYear, 2025, false)).toBe(false);
    expect(isInPeriod(newYear, 2026, true)).toBe(true);
  });

  it('tiles the calendar with no gaps or overlaps across year boundaries', () => {
    const firstHalf = calculatePeriod(2024, true);
    const secondHalf = calculatePeriod(2024, false);
    const nextFirstHalf = calculatePeriod(2025, true);

    expect(firstHalf.periodEnd.getTime() + 1).toBe(
      secondHalf.periodStart.getTime()
    );
    expect(secondHalf.periodEnd.getTime() + 1).toBe(
      nextFirstHalf.periodStart.getTime()
    );
  });
});

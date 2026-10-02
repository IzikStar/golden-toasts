export const calculateRankColor = (record: number, total: number): string => {
  if (total === 0) return 'hsl(0 100% 50%)';
  if (record === 0) return 'hsl(120 100% 50%)';

  const ratio = Math.max(0, Math.min(total / record, 1));
  const b = 0.4;
  const t = ratio / ((1 / b - 2) * (1 - ratio) + 1);

  const hue = Math.round(120 * t);
  return `hsl(${hue} 100% 50%)`;
};

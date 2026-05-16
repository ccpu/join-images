export default function alignImage(
  total: number,
  size: number,
  align: 'start' | 'center' | 'end',
): number {
  const midpoint = 2;

  if (align === 'center') {
    return (total - size) / midpoint;
  }

  if (align === 'end') {
    return total - size;
  }

  return 0;
}

// eslint-disable-next-line no-async-promise-executor
export default function alignImage(total, size, align) {
  if (align === "center") {
    return (total - size) / 2;
  }

  if (align === "end") {
    return total - size;
  }

  return 0;
}

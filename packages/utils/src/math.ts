export const toNumber = (value: { toNumber(): number } | number | null | undefined) => {
  if (value === null || value === undefined) {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  return value.toNumber();
};

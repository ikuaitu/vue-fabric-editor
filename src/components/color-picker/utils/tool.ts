export const toNumber = (n: number, { decimal = 0 } = {}) => {
  if (decimal > 0) {
    return Number(n.toFixed(decimal));
  }
  return Math.round(n);
};

export const formatCurrency = (value: number, currency: string = "USD") =>
  new Intl.NumberFormat(undefined, { style: "currency", currency, maximumFractionDigits: 0 }).format(value);

export type SavingsInput = { initial: number; monthly: number; months: number; annualRate: number };
export function calculateSavings({ initial, monthly, months, annualRate }: SavingsInput) {
  if (![initial, monthly, months, annualRate].every(Number.isFinite) || initial < 0 || monthly < 0 || months < 1 || months > 600 || !Number.isInteger(months) || annualRate < 0 || annualRate > 100 || initial > 1e12 || monthly > 1e12) {
    throw new Error("Revisa los montos, la tasa y el plazo de la simulación.");
  }
  const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  let balance = initial;
  const timeline = [{ month: 0, balance: initial, contributed: initial }];
  for (let month = 1; month <= months; month++) {
    balance = balance * (1 + monthlyRate) + monthly;
    timeline.push({ month, balance, contributed: initial + monthly * month });
  }
  const contributed = initial + monthly * months;
  return { balance, contributed, interest: balance - contributed, timeline };
}
export const money = (value: number) => new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 }).format(value);

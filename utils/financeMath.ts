
export interface AmortizationRow {
  month: number;
  installment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export const calculatePrice = (amount: number, yearlyInterest: number, months: number): AmortizationRow[] => {
  const monthlyInterest = yearlyInterest / 100 / 12;
  const installment = monthlyInterest === 0 
    ? amount / months 
    : (amount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
  
  let balance = amount;
  const schedule: AmortizationRow[] = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyInterest;
    const amortization = installment - interest;
    balance -= amortization;
    schedule.push({
      month: i,
      installment,
      interest,
      amortization,
      balance: Math.max(0, balance),
    });
  }
  return schedule;
};

export const calculateSac = (amount: number, yearlyInterest: number, months: number): AmortizationRow[] => {
  const monthlyInterest = yearlyInterest / 100 / 12;
  const amortization = amount / months;
  let balance = amount;
  const schedule: AmortizationRow[] = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyInterest;
    const installment = amortization + interest;
    balance -= amortization;
    schedule.push({
      month: i,
      installment,
      interest,
      amortization,
      balance: Math.max(0, balance),
    });
  }
  return schedule;
};

/**
 * Calculates compound interest with monthly contributions.
 * @param initial Initial capital (R$)
 * @param monthly Monthly contribution (R$)
 * @param yearlyRate Yearly interest rate (percentage, e.g., 10 for 10%)
 * @param years Investment period in years (can be decimal)
 */
export const calculateCompoundInterest = (
  initial: number, 
  monthly: number, 
  yearlyRate: number, 
  years: number
) => {
  const monthlyRate = Math.max(0, yearlyRate / 100 / 12);
  const totalMonths = Math.max(0, Math.round(years * 12));
  
  let totalBalance = initial;
  let totalInvested = initial;
  
  const growth = [{ 
    month: 0, 
    year: 0, 
    amount: initial, 
    invested: initial,
    interest: 0,
    monthlyInterest: 0
  }];

  if (totalMonths > 0) {
    for (let i = 1; i <= totalMonths; i++) {
      // Contribution happens at the start of the month
      totalInvested += monthly;
      const prevBalance = totalBalance;
      
      // Calculate interest on the sum of previous balance and new contribution
      totalBalance = (totalBalance + monthly) * (1 + monthlyRate);
      
      const interestEarnedThisMonth = totalBalance - (prevBalance + monthly);

      // Record data point for every month to ensure smooth charts
      // But we'll mostly display years in the UI
      growth.push({ 
        month: i, 
        year: Number((i / 12).toFixed(2)), 
        amount: totalBalance,
        invested: totalInvested,
        interest: totalBalance - totalInvested,
        monthlyInterest: interestEarnedThisMonth
      });
    }
  }
  
  return { 
    total: totalBalance, 
    totalInvested, 
    totalInterest: Math.max(0, totalBalance - totalInvested), 
    growth 
  };
};

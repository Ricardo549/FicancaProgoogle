
export interface AmortizationRow {
  month: number;
  installment: number;
  interest: number;
  amortization: number;
  balance: number;
}

export const calculatePrice = (amount: number, yearlyInterest: number, months: number, yearlyInsurance: number = 0): AmortizationRow[] => {
  const monthlyInterest = yearlyInterest / 100 / 12;
  const monthlyInsurance = (amount * (yearlyInsurance / 100)) / 12;
  const baseInstallment = monthlyInterest === 0 
    ? amount / months 
    : (amount * monthlyInterest) / (1 - Math.pow(1 + monthlyInterest, -months));
  
  let balance = amount;
  const schedule: AmortizationRow[] = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyInterest;
    const amortization = baseInstallment - interest;
    balance -= amortization;
    schedule.push({
      month: i,
      installment: baseInstallment + monthlyInsurance,
      interest,
      amortization,
      balance: Math.max(0, balance),
    });
  }
  return schedule;
};

export const calculateSac = (amount: number, yearlyInterest: number, months: number, yearlyInsurance: number = 0): AmortizationRow[] => {
  const monthlyInterest = yearlyInterest / 100 / 12;
  const monthlyInsurance = (amount * (yearlyInsurance / 100)) / 12;
  const amortization = amount / months;
  let balance = amount;
  const schedule: AmortizationRow[] = [];

  for (let i = 1; i <= months; i++) {
    const interest = balance * monthlyInterest;
    const installment = amortization + interest + monthlyInsurance;
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

export const calculateCompoundInterest = (
  initial: number, 
  monthly: number, 
  yearlyRate: number, 
  years: number
) => {
  // Garantir valores positivos e evitar divisão por zero
  const safeYears = Math.max(0.1, years);
  const totalMonths = Math.round(safeYears * 12);
  
  // Taxa mensal equivalente (geométrica)
  const monthlyRate = yearlyRate > 0 
    ? Math.pow(1 + yearlyRate / 100, 1/12) - 1 
    : 0;
  
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

  for (let i = 1; i <= totalMonths; i++) {
    const prevBalance = totalBalance;
    totalInvested += monthly;
    
    // Capitalização: Juros sobre (Saldo Anterior + Aporte)
    totalBalance = (totalBalance + monthly) * (1 + monthlyRate);
    const interestEarned = totalBalance - (prevBalance + monthly);

    growth.push({ 
      month: i, 
      year: Number((i / 12).toFixed(2)), 
      amount: totalBalance,
      invested: totalInvested,
      interest: totalBalance - totalInvested,
      monthlyInterest: interestEarned
    });
  }
  
  return { 
    total: totalBalance, 
    totalInvested, 
    totalInterest: Math.max(0, totalBalance - totalInvested), 
    growth,
    monthlyRatePerc: monthlyRate * 100,
    yieldOnCost: totalInvested > 0 ? (totalBalance / totalInvested) : 0
  };
};

export const calculateIndependenceNeeded = (monthlyCost: number, yearlyWithdrawalRate: number = 7.2) => {
  // Regra de retirada (Safe Withdrawal Rate)
  // Capital = (Custo_Mensal * 12) / Taxa_Retirada_Anual
  return (monthlyCost * 12) / (yearlyWithdrawalRate / 100);
};

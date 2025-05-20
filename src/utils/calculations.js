export function calculateProfitLoss(transactions) {
  const currencyData = {};
  const buyRates = {};
  const transferTransactions = [];

  const ensureCurrency = (currency) => {
    if (!currencyData[currency]) {
      currencyData[currency] = {
        balance: 0,
        costBasisUSD: 0,
        realizedPL: 0,
      };
    }
    return currencyData[currency];
  };

  // First pass: capture buy rates
  transactions.forEach((transaction) => {
    if (transaction.type === 'buyRate') {
      const currency = transaction.currency;
      const rate = parseFloat(transaction.buyRate);
      buyRates[currency] = rate;
    }
  });

  // Second pass: process add and transfer
  transactions.forEach((transaction) => {
    if (transaction.type === 'add') {
      const currency = transaction.currency;
      const amount = parseFloat(transaction.amount);
      const rate = parseFloat(transaction.rate); // USD rate per unit

      const currencyInfo = ensureCurrency(currency);
      currencyInfo.balance += amount;
      currencyInfo.costBasisUSD += amount * rate;

    } else if (transaction.type === 'transfer') {
      const fromCurrency = transaction.fromCurrency;
      const toCurrency = transaction.toCurrency;
      const amount = parseFloat(transaction.amount);
      const transferRate = parseFloat(transaction.rate); // units of toCurrency per unit of fromCurrency
      const convertedAmount = amount * transferRate;

      const fromInfo = ensureCurrency(fromCurrency);
      const toInfo = ensureCurrency(toCurrency);

      // Avoid division by zero
      const costBasisPerUnit = fromInfo.balance > 0 ? fromInfo.costBasisUSD / fromInfo.balance : 0;
      const transferCostBasisUSD = amount * costBasisPerUnit;

      // Estimate USD value of incoming currency (simplified as same as cost transferred)
      const transferValueUSD = transferCostBasisUSD;

      // Realized profit/loss: estimated value of received - cost basis of sent
      const transferPL = transferValueUSD - transferCostBasisUSD;

      // Update balances and cost basis
      fromInfo.balance -= amount;
      fromInfo.costBasisUSD -= transferCostBasisUSD;
      fromInfo.realizedPL += transferPL;

      toInfo.balance += convertedAmount;
      toInfo.costBasisUSD += transferCostBasisUSD;

      // Save transfer transaction with profit/loss details
      transferTransactions.push({
        id: transaction.id,
        date: transaction.date,
        fromCurrency,
        toCurrency,
        amount,
        convertedAmount,
        transferRate,
        buyRate: buyRates[fromCurrency] || 0,
        profitLossPerUnit: (buyRates[fromCurrency] || 0) - transferRate,
        totalProfitLoss: transferPL,
      });
    }
  });

  // Final aggregation
  const profitLossByCurrency = {};
  let totalProfitLoss = 0;

  Object.entries(currencyData).forEach(([currency, data]) => {
    const avgCostPerUnit = data.balance > 0 ? data.costBasisUSD / data.balance : 0;

    profitLossByCurrency[currency] = {
      currentBalance: data.balance,
      costBasisUSD: data.costBasisUSD,
      averageCostPerUnit: avgCostPerUnit,
      realizedPL: data.realizedPL,
    };

    totalProfitLoss += data.realizedPL;
  });

  return {
    currencyData,
    transferTransactions,
    profitLossByCurrency,
    totalProfitLoss,
    buyRates,
  };
}

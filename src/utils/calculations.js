export function calculateProfitLoss(transactions) {
  // Track currency balances and rates
  const currencyData = {};
  // Track all transfer transactions for profit/loss reporting
  const transferTransactions = [];
  // Track buy rates by currency (latest rate for each currency)
  const buyRates = {};
  
  // First pass: Process all 'buyRate' transactions to get current rates
  transactions.forEach(transaction => {
    if (transaction.type === 'buyRate') {
      const currency = transaction.currency;
      const rate = parseFloat(transaction.buyRate);
      buyRates[currency] = rate;
    }
  });
  
  // Process remaining transactions
  transactions.forEach(transaction => {
    if (transaction.type === 'add') {
      // When money is added to your system
      const currency = transaction.currency;
      const amount = parseFloat(transaction.amount);
      
      if (!currencyData[currency]) {
        currencyData[currency] = { balance: 0 };
      }
      
      // Simply add to the balance
      currencyData[currency].balance += amount;
    }
    else if (transaction.type === 'transfer') {
      // When you transfer money - this is where profit happens
      const fromCurrency = transaction.fromCurrency;
      const toCurrency = transaction.toCurrency;
      const amount = parseFloat(transaction.amount);
      const transferRate = parseFloat(transaction.rate);
      
      // Initialize currencies if needed
      if (!currencyData[fromCurrency]) {
        currencyData[fromCurrency] = { balance: 0 };
      }
      if (!currencyData[toCurrency]) {
        currencyData[toCurrency] = { balance: 0 };
      }
      
      // Get the buy rate for this currency (what rate you bought it at)
      const buyRate = buyRates[fromCurrency] || 0;
      
      // Calculate profit/loss - as a money agent:
      // If customers gave you money at rate 20 and you're transferring at 18
      // You make a profit of 2 per unit
      const profitLossPerUnit = buyRate - transferRate;
      const totalProfitLoss = profitLossPerUnit * amount;
      
      // Update balances
      currencyData[fromCurrency].balance -= amount;
      
      // Add to destination balance
      const convertedAmount = amount * transferRate;
      currencyData[toCurrency].balance += convertedAmount;
      
      // Add this transfer to our transfer history
      transferTransactions.push({
        id: transaction.id,
        date: transaction.date,
        fromCurrency,
        toCurrency,
        amount,
        buyRate,
        transferRate,
        profitLossPerUnit,
        totalProfitLoss,
        convertedAmount
      });
    }
  });
  
  // Calculate total profit/loss
  let totalProfitLoss = 0;
  transferTransactions.forEach(transfer => {
    totalProfitLoss += transfer.totalProfitLoss;
  });
  
  return {
    currencyData,
    transferTransactions,
    totalProfitLoss,
    buyRates
  };

}const ensureCurrency = (currency) => {
      if (!currencyData[currency]) {
        currencyData[currency] = {
          balance: 0,         // Current balance of currency
          costBasisUSD: 0,    // Total cost in USD
          realizedPL: 0       // Realized profit/loss from transfers
        };
      }
      return currencyData[currency];
    };

    if (transaction.type === 'add') {
      // Handle adding money to a currency
      const currency = transaction.currency;
      const amount = parseFloat(transaction.amount);
      const rate = parseFloat(transaction.rate);
      
      const currencyInfo = ensureCurrency(currency);
      
      // Update the balance and cost basis
      currencyInfo.balance += amount;
      
      // The rate in the transaction represents how much 1 unit of the currency is worth in USD
      currencyInfo.costBasisUSD += amount * rate;
    } 
    else if (transaction.type === 'transfer') {
      const fromCurrency = transaction.fromCurrency;
      const toCurrency = transaction.toCurrency;
      const amount = parseFloat(transaction.amount);
      const rate = parseFloat(transaction.rate);
      const convertedAmount = amount * rate;
      
      const fromCurrencyInfo = ensureCurrency(fromCurrency);
      const toCurrencyInfo = ensureCurrency(toCurrency);
      
      // Calculate the portion of the cost basis being transferred
      const costBasisPerUnit = fromCurrencyInfo.costBasisUSD / fromCurrencyInfo.balance;
      const transferCostBasisUSD = amount * costBasisPerUnit;
      
      // Calculate the USD value of what we're getting based on the transaction rate
      // We need to determine the USD value of the destination currency
      // This could be calculated differently depending on your app's logic
      let transferValueUSD = 0;
      
      // Option 1: If the rate is direct from fromCurrency to toCurrency (not via USD)
      // We need to find or estimate the USD value
      // For simplicity, we'll use the average cost basis as an estimate
      // In a real app, you might have actual USD rates for each currency
      transferValueUSD = transferCostBasisUSD;
      
      // Calculate profit/loss on this transfer (in USD)
      const transferPL = (convertedAmount * (toCurrencyInfo.costBasisUSD / toCurrencyInfo.balance || 0)) - transferCostBasisUSD;
      
      // Update balances
      fromCurrencyInfo.balance -= amount;
      toCurrencyInfo.balance += convertedAmount;
      
      // Update cost bases
      fromCurrencyInfo.costBasisUSD -= transferCostBasisUSD;
      toCurrencyInfo.costBasisUSD += transferCostBasisUSD;
      
      // Record the realized profit/loss
      fromCurrencyInfo.realizedPL += transferPL;
    }
  
  
  // Calculate total profit/loss and format results for display
  let totalProfitLoss = 0;
  const profitLossByCurrency = {};
  
  Object.entries(currencyData).forEach(([currency, data]) => {
    // We don't need external rates here - using only transaction data
    const averageCostPerUnit = data.balance > 0 ? data.costBasisUSD / data.balance : 0;
    
    profitLossByCurrency[currency] = {
      currentBalance: data.balance,
      costBasisUSD: data.costBasisUSD,
      averageCostPerUnit: averageCostPerUnit,
      realizedPL: data.realizedPL
    };
    
    totalProfitLoss += data.realizedPL;
  });
  
  return {
    profitLossByCurrency,
    totalProfitLoss
  };

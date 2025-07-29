// Currency service for managing currencies and exchange rates
export const CURRENCIES = {
  USD: { code: 'USD', symbol: '$', name: 'US Dollar' },
  EUR: { code: 'EUR', symbol: '€', name: 'Euro' },
  GBP: { code: 'GBP', symbol: '£', name: 'British Pound' },
  CAD: { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  AUD: { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  JPY: { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  CNY: { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  CHF: { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc' },
  INR: { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  BRL: { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  MXN: { code: 'MXN', symbol: 'Mex$', name: 'Mexican Peso' },
  RUB: { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  KRW: { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  SGD: { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  HKD: { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' }
};

// Mock exchange rates (in a real app, you'd fetch from an API like exchangerate-api.com)
export const EXCHANGE_RATES = {
  USD: 1.0,    // Base currency
  EUR: 0.85,
  GBP: 0.73,
  CAD: 1.35,
  AUD: 1.50,
  JPY: 110.0,
  CNY: 6.45,
  CHF: 0.92,
  INR: 74.5,
  BRL: 5.20,
  MXN: 20.0,
  RUB: 75.0,
  KRW: 1200.0,
  SGD: 1.35,
  HKD: 7.80
};

export const convertCurrency = (amount, fromCurrency, toCurrency) => {
  if (fromCurrency === toCurrency) return amount;
  
  // Convert to USD first, then to target currency
  const usdAmount = amount / EXCHANGE_RATES[fromCurrency];
  return usdAmount * EXCHANGE_RATES[toCurrency];
};

export const formatCurrency = (amount, currencyCode) => {
  const currency = CURRENCIES[currencyCode];
  if (!currency) return `${amount.toFixed(2)}`;
  
  // Special formatting for currencies with different decimal places
  let decimals = 2;
  if (currencyCode === 'JPY' || currencyCode === 'KRW') {
    decimals = 0;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(amount);
};

export const getCurrencySymbol = (currencyCode) => {
  return CURRENCIES[currencyCode]?.symbol || currencyCode;
};

export const getCurrencyName = (currencyCode) => {
  return CURRENCIES[currencyCode]?.name || currencyCode;
};

// Default currency
export const DEFAULT_CURRENCY = 'USD';
// Mock data for budget planner app
export const mockCategories = {
  income: [
    { id: 'salary', name: 'Salary', color: '#10b981', icon: 'Banknote' },
    { id: 'freelance', name: 'Freelance', color: '#3b82f6', icon: 'Laptop' },
    { id: 'investments', name: 'Investments', color: '#8b5cf6', icon: 'TrendingUp' },
    { id: 'business', name: 'Business', color: '#06b6d4', icon: 'Building2' },
    { id: 'other-income', name: 'Other Income', color: '#f59e0b', icon: 'Plus' }
  ],
  expense: [
    { id: 'food', name: 'Food & Dining', color: '#ef4444', icon: 'Utensils' },
    { id: 'transport', name: 'Transportation', color: '#f97316', icon: 'Car' },
    { id: 'shopping', name: 'Shopping', color: '#ec4899', icon: 'ShoppingBag' },
    { id: 'entertainment', name: 'Entertainment', color: '#a855f7', icon: 'Music' },
    { id: 'healthcare', name: 'Healthcare', color: '#14b8a6', icon: 'Heart' },
    { id: 'education', name: 'Education', color: '#3b82f6', icon: 'BookOpen' },
    { id: 'utilities', name: 'Utilities', color: '#6b7280', icon: 'Zap' },
    { id: 'rent', name: 'Rent & Housing', color: '#0891b2', icon: 'Home' },
    { id: 'insurance', name: 'Insurance', color: '#dc2626', icon: 'Shield' },
    { id: 'other-expense', name: 'Other Expenses', color: '#78716c', icon: 'MoreHorizontal' }
  ]
};

export const mockTransactions = [
  // April 2025
  { id: '1', type: 'income', amount: 5000, currency: 'USD', category: 'salary', description: 'Monthly Salary', date: '2025-04-01' },
  { id: '2', type: 'income', amount: 1500, currency: 'USD', category: 'freelance', description: 'UI Design Project', date: '2025-04-05' },
  { id: '3', type: 'expense', amount: 800, currency: 'USD', category: 'rent', description: 'Monthly Rent', date: '2025-04-01' },
  { id: '4', type: 'expense', amount: 300, currency: 'USD', category: 'food', description: 'Groceries', date: '2025-04-03' },
  { id: '5', type: 'expense', amount: 150, currency: 'USD', category: 'transport', description: 'Gas & Maintenance', date: '2025-04-04' },
  { id: '6', type: 'expense', amount: 200, currency: 'USD', category: 'shopping', description: 'Clothing', date: '2025-04-07' },
  
  // May 2025
  { id: '7', type: 'income', amount: 5000, currency: 'USD', category: 'salary', description: 'Monthly Salary', date: '2025-05-01' },
  { id: '8', type: 'income', amount: 800, currency: 'USD', category: 'freelance', description: 'Logo Design', date: '2025-05-10' },
  { id: '9', type: 'expense', amount: 800, currency: 'USD', category: 'rent', description: 'Monthly Rent', date: '2025-05-01' },
  { id: '10', type: 'expense', amount: 250, currency: 'USD', category: 'food', description: 'Groceries', date: '2025-05-05' },
  { id: '11', type: 'expense', amount: 100, currency: 'USD', category: 'entertainment', description: 'Movie & Dinner', date: '2025-05-14' },
  { id: '12', type: 'expense', amount: 120, currency: 'USD', category: 'utilities', description: 'Electricity Bill', date: '2025-05-15' },
  
  // June 2025
  { id: '13', type: 'income', amount: 5000, currency: 'USD', category: 'salary', description: 'Monthly Salary', date: '2025-06-01' },
  { id: '14', type: 'income', amount: 2200, currency: 'USD', category: 'freelance', description: 'Web Design Project', date: '2025-06-08' },
  { id: '15', type: 'expense', amount: 800, currency: 'USD', category: 'rent', description: 'Monthly Rent', date: '2025-06-01' },
  { id: '16', type: 'expense', amount: 350, currency: 'USD', category: 'food', description: 'Groceries & Dining', date: '2025-06-05' },
  { id: '17', type: 'expense', amount: 180, currency: 'USD', category: 'transport', description: 'Car Service', date: '2025-06-10' },
  { id: '18', type: 'expense', amount: 400, currency: 'USD', category: 'shopping', description: 'Electronics', date: '2025-06-15' },
  { id: '19', type: 'expense', amount: 90, currency: 'USD', category: 'healthcare', description: 'Doctor Visit', date: '2025-06-20' },
  
  // July 2025 (Current Month) - Mix of currencies
  { id: '20', type: 'income', amount: 5000, currency: 'USD', category: 'salary', description: 'Monthly Salary', date: '2025-07-01' },
  { id: '21', type: 'income', amount: 1000, currency: 'EUR', category: 'freelance', description: 'Website Redesign', date: '2025-07-12' },
  { id: '22', type: 'expense', amount: 800, currency: 'USD', category: 'rent', description: 'Monthly Rent', date: '2025-07-01' },
  { id: '23', type: 'expense', amount: 200, currency: 'USD', category: 'food', description: 'Groceries', date: '2025-07-03' },
  { id: '24', type: 'expense', amount: 75, currency: 'USD', category: 'transport', description: 'Gas', date: '2025-07-05' },
  { id: '25', type: 'expense', amount: 140, currency: 'EUR', category: 'entertainment', description: 'Concert Tickets', date: '2025-07-08' },
  { id: '26', type: 'expense', amount: 95, currency: 'USD', category: 'food', description: 'Restaurant', date: '2025-07-10' },
  { id: '27', type: 'expense', amount: 50, currency: 'USD', category: 'transport', description: 'Subway Card', date: '2025-07-15' },
  { id: '28', type: 'expense', amount: 250, currency: 'EUR', category: 'shopping', description: 'Summer Clothes', date: '2025-07-20' }
];

// Helper functions for data processing
export const getCategoryById = (categoryId, type) => {
  return mockCategories[type].find(cat => cat.id === categoryId);
};

export const getTransactionsByDateRange = (startDate, endDate) => {
  return mockTransactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= new Date(startDate) && transactionDate <= new Date(endDate);
  });
};

export const getMonthlyData = () => {
  const monthlyData = {};
  
  mockTransactions.forEach(transaction => {
    const date = new Date(transaction.date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { income: 0, expense: 0 };
    }
    
    monthlyData[monthKey][transaction.type] += transaction.amount;
  });
  
  return monthlyData;
};

export const getCategoryTotals = (type, dateRange = null) => {
  let transactions = mockTransactions;
  
  if (dateRange) {
    transactions = getTransactionsByDateRange(dateRange.start, dateRange.end);
  }
  
  const categoryTotals = {};
  
  transactions
    .filter(t => t.type === type)
    .forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += transaction.amount;
    });
  
  return categoryTotals;
};
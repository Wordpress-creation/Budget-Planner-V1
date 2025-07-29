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
  // January 2024
  { id: '1', type: 'income', amount: 5000, category: 'salary', description: 'Monthly Salary', date: '2024-01-01' },
  { id: '2', type: 'income', amount: 1500, category: 'freelance', description: 'UI Design Project', date: '2024-01-05' },
  { id: '3', type: 'expense', amount: 800, category: 'rent', description: 'Monthly Rent', date: '2024-01-01' },
  { id: '4', type: 'expense', amount: 300, category: 'food', description: 'Groceries', date: '2024-01-03' },
  { id: '5', type: 'expense', amount: 150, category: 'transport', description: 'Gas & Maintenance', date: '2024-01-04' },
  { id: '6', type: 'expense', amount: 200, category: 'shopping', description: 'Clothing', date: '2024-01-07' },
  
  // February 2024
  { id: '7', type: 'income', amount: 5000, category: 'salary', description: 'Monthly Salary', date: '2024-02-01' },
  { id: '8', type: 'income', amount: 800, category: 'freelance', description: 'Logo Design', date: '2024-02-10' },
  { id: '9', type: 'expense', amount: 800, category: 'rent', description: 'Monthly Rent', date: '2024-02-01' },
  { id: '10', type: 'expense', amount: 250, category: 'food', description: 'Groceries', date: '2024-02-05' },
  { id: '11', type: 'expense', amount: 100, category: 'entertainment', description: 'Movie & Dinner', date: '2024-02-14' },
  { id: '12', type: 'expense', amount: 120, category: 'utilities', description: 'Electricity Bill', date: '2024-02-15' },
  
  // March 2024
  { id: '13', type: 'income', amount: 5000, category: 'salary', description: 'Monthly Salary', date: '2024-03-01' },
  { id: '14', type: 'income', amount: 2200, category: 'freelance', description: 'Web Design Project', date: '2024-03-08' },
  { id: '15', type: 'expense', amount: 800, category: 'rent', description: 'Monthly Rent', date: '2024-03-01' },
  { id: '16', type: 'expense', amount: 350, category: 'food', description: 'Groceries & Dining', date: '2024-03-05' },
  { id: '17', type: 'expense', amount: 180, category: 'transport', description: 'Car Service', date: '2024-03-10' },
  { id: '18', type: 'expense', amount: 400, category: 'shopping', description: 'Electronics', date: '2024-03-15' },
  { id: '19', type: 'expense', amount: 90, category: 'healthcare', description: 'Doctor Visit', date: '2024-03-20' },
  
  // April 2024 (Recent)
  { id: '20', type: 'income', amount: 5000, category: 'salary', description: 'Monthly Salary', date: '2024-04-01' },
  { id: '21', type: 'expense', amount: 800, category: 'rent', description: 'Monthly Rent', date: '2024-04-01' },
  { id: '22', type: 'expense', amount: 200, category: 'food', description: 'Groceries', date: '2024-04-03' },
  { id: '23', type: 'expense', amount: 75, category: 'transport', description: 'Gas', date: '2024-04-05' },
  { id: '24', type: 'expense', amount: 160, category: 'entertainment', description: 'Concert Tickets', date: '2024-04-08' }
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
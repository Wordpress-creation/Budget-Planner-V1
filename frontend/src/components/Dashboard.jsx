import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  Calendar,
  Plus,
  Wallet
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { mockTransactions, mockCategories, getMonthlyData, getCategoryTotals, getCategoryById } from '../mockData';
import { convertCurrency, formatCurrency, DEFAULT_CURRENCY } from '../services/currencyService';
import TransactionForm from './TransactionForm';
import TransactionHistory from './TransactionHistory';
import CurrencySelector from './CurrencySelector';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedCurrency, setSelectedCurrency] = useState(DEFAULT_CURRENCY);
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactions, setTransactions] = useState(mockTransactions);

  // Calculate summary data based on selected period with trends
  const summaryData = useMemo(() => {
    const now = new Date();
    let startDate, endDate, prevStartDate, prevEndDate, periodLabel;
    
    switch (selectedPeriod) {
      case 'weekly':
        // Current week (Monday to Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        startDate = startOfWeek.toISOString().slice(0, 10);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endDate = endOfWeek.toISOString().slice(0, 10);
        
        // Previous week
        const prevWeekStart = new Date(startOfWeek);
        prevWeekStart.setDate(startOfWeek.getDate() - 7);
        prevStartDate = prevWeekStart.toISOString().slice(0, 10);
        const prevWeekEnd = new Date(prevWeekStart);
        prevWeekEnd.setDate(prevWeekStart.getDate() + 6);
        prevEndDate = prevWeekEnd.toISOString().slice(0, 10);
        periodLabel = 'last week';
        break;
      case 'yearly':
        // Current year
        startDate = `${now.getFullYear()}-01-01`;
        endDate = `${now.getFullYear()}-12-31`;
        
        // Previous year
        prevStartDate = `${now.getFullYear() - 1}-01-01`;
        prevEndDate = `${now.getFullYear() - 1}-12-31`;
        periodLabel = 'last year';
        break;
      case 'monthly':
      default:
        // Current month
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        
        // Previous month
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        prevStartDate = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-01`;
        const prevLastDay = new Date(prevYear, prevMonth + 1, 0).getDate();
        prevEndDate = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${prevLastDay}`;
        periodLabel = 'last month';
        break;
    }

    // Current period transactions
    const periodTransactions = transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );
    
    // Previous period transactions for comparison
    const prevPeriodTransactions = transactions.filter(t => 
      t.date >= prevStartDate && t.date <= prevEndDate
    );

    // Convert amounts to selected currency
    const totalIncome = periodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);

    const totalExpense = periodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);
    
    const prevTotalIncome = prevPeriodTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);

    const prevTotalExpense = prevPeriodTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);

    const balance = totalIncome - totalExpense;

    // Calculate trends
    const incomeChange = prevTotalIncome > 0 ? ((totalIncome - prevTotalIncome) / prevTotalIncome) * 100 : 0;
    const expenseChange = prevTotalExpense > 0 ? ((totalExpense - prevTotalExpense) / prevTotalExpense) * 100 : 0;
    
    const incomeTrend = incomeChange > 0 ? `+${incomeChange.toFixed(0)}% from ${periodLabel}` : 
                       incomeChange < 0 ? `${incomeChange.toFixed(0)}% from ${periodLabel}` : 
                       `No change from ${periodLabel}`;
    
    const expenseTrend = expenseChange > 0 ? `+${expenseChange.toFixed(0)}% from ${periodLabel}` : 
                        expenseChange < 0 ? `${expenseChange.toFixed(0)}% from ${periodLabel}` : 
                        `No change from ${periodLabel}`;

    return { 
      totalIncome, 
      totalExpense, 
      balance, 
      incomeTrend, 
      expenseTrend,
      startDate,
      endDate
    };
  }, [selectedPeriod, selectedCurrency, transactions]);

  // Monthly chart data based on selected period
  const monthlyChartData = useMemo(() => {
    let filteredTransactions = transactions;
    const now = new Date();
    
    if (selectedPeriod === 'weekly') {
      // Show last 8 weeks
      const weeksData = [];
      for (let i = 7; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay() + 1 - (i * 7));
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        
        const weekTransactions = transactions.filter(t => 
          t.date >= weekStart.toISOString().slice(0, 10) && 
          t.date <= weekEnd.toISOString().slice(0, 10)
        );
        
        const income = weekTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);
        const expense = weekTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);
        
        weeksData.push({
          month: `W${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`,
          income,
          expense,
          balance: income - expense
        });
      }
      return weeksData;
    } else if (selectedPeriod === 'yearly') {
      // Show last 4 years
      const yearsData = [];
      for (let i = 3; i >= 0; i--) {
        const year = now.getFullYear() - i;
        const yearTransactions = transactions.filter(t => t.date.startsWith(year.toString()));
        
        const income = yearTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);
        const expense = yearTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + convertCurrency(t.amount, t.currency || 'USD', selectedCurrency), 0);
        
        yearsData.push({
          month: year.toString(),
          income,
          expense,
          balance: income - expense
        });
      }
      return yearsData;
    } else {
      // Monthly view (default)
      const monthlyData = {};
      
      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { income: 0, expense: 0 };
        }
        
        monthlyData[monthKey][transaction.type] += convertCurrency(transaction.amount, transaction.currency || 'USD', selectedCurrency);
      });
      
      return Object.entries(monthlyData)
        .map(([month, data]) => ({
          month: new Date(month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' }),
          income: data.income,
          expense: data.expense,
          balance: data.income - data.expense
        }))
        .sort((a, b) => new Date(a.month) - new Date(b.month));
    }
  }, [transactions, selectedPeriod, selectedCurrency]);

  // Category pie chart data based on selected period
  const expensePieData = useMemo(() => {
    const now = new Date();
    let startDate, endDate;
    
    switch (selectedPeriod) {
      case 'weekly':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        startDate = startOfWeek.toISOString().slice(0, 10);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endDate = endOfWeek.toISOString().slice(0, 10);
        break;
      case 'yearly':
        startDate = `${now.getFullYear()}-01-01`;
        endDate = `${now.getFullYear()}-12-31`;
        break;
      case 'monthly':
      default:
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        break;
    }

    const periodTransactions = transactions.filter(t => 
      t.date >= startDate && t.date <= endDate && t.type === 'expense'
    );
    
    const categoryTotals = {};
    periodTransactions.forEach(transaction => {
      if (!categoryTotals[transaction.category]) {
        categoryTotals[transaction.category] = 0;
      }
      categoryTotals[transaction.category] += convertCurrency(transaction.amount, transaction.currency || 'USD', selectedCurrency);
    });
    
    return Object.entries(categoryTotals)
      .map(([categoryId, total]) => {
        const category = getCategoryById(categoryId, 'expense');
        return {
          name: category?.name || categoryId,
          value: total,
          color: category?.color || '#64748b'
        };
      })
      .sort((a, b) => b.value - a.value)
      .slice(0, 8); // Top 8 categories
  }, [transactions, selectedPeriod, selectedCurrency]);

  const formatCurrencyAmount = (amount) => {
    return formatCurrency(amount, selectedCurrency);
  };

  const handleAddTransaction = (newTransaction) => {
    // Add currency to the transaction if not present
    const transactionWithCurrency = {
      ...newTransaction,
      currency: newTransaction.currency || selectedCurrency
    };
    setTransactions(prev => [transactionWithCurrency, ...prev]);
  };

  const handleUpdateTransaction = (updatedTransaction) => {
    // Ensure currency is set
    const transactionWithCurrency = {
      ...updatedTransaction,
      currency: updatedTransaction.currency || selectedCurrency
    };
    setTransactions(prev => 
      prev.map(t => t.id === updatedTransaction.id ? transactionWithCurrency : t)
    );
  };

  const handleDeleteTransaction = (transactionId) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };

  const StatCard = ({ title, value, icon: Icon, trend, trendValue, color = 'bg-gradient-to-r from-blue-50 to-indigo-50' }) => (
    <Card className={`${color} border-0 shadow-sm hover:shadow-md transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-gray-900">{formatCurrencyAmount(value)}</h3>
            {trend && (
              <div className={`flex items-center mt-2 text-sm ${trend === 'up' ? 'text-green-600' : trend === 'down' ? 'text-red-600' : 'text-gray-600'}`}>
                {trend === 'up' ? <TrendingUp className="w-4 h-4 mr-1" /> : 
                 trend === 'down' ? <TrendingDown className="w-4 h-4 mr-1" /> : null}
                <span>{trendValue}</span>
              </div>
            )}
          </div>
          <div className="p-3 bg-white/60 rounded-full">
            <Icon className="w-6 h-6 text-gray-700" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl">
                <Wallet className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Budget Planner by Wordpress-creation.fr
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <CurrencySelector 
                selectedCurrency={selectedCurrency} 
                onCurrencyChange={setSelectedCurrency}
              />
              <Button 
                onClick={() => setShowAddTransaction(true)}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Income"
            value={summaryData.totalIncome}
            icon={TrendingUp}
            trend="up"
            trendValue={summaryData.incomeTrend}
            color="bg-gradient-to-r from-green-50 to-emerald-50"
          />
          <StatCard
            title="Total Expenses"
            value={summaryData.totalExpense}
            icon={TrendingDown}
            trend="down"
            trendValue={summaryData.expenseTrend}
            color="bg-gradient-to-r from-red-50 to-pink-50"
          />
          <StatCard
            title="Net Balance"
            value={summaryData.balance}
            icon={DollarSign}
            trend={summaryData.balance > 0 ? 'up' : 'down'}
            trendValue={summaryData.balance > 0 ? 'Looking good!' : 'Watch spending'}
            color={summaryData.balance > 0 ? 'bg-gradient-to-r from-blue-50 to-cyan-50' : 'bg-gradient-to-r from-orange-50 to-red-50'}
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex justify-between items-center mb-6">
            <TabsList className="grid w-fit grid-cols-3 bg-white shadow-sm border">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Overview</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center space-x-2">
                <PieChart className="w-4 h-4" />
                <span>Analytics</span>
              </TabsTrigger>
              <TabsTrigger value="transactions" className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Transactions</span>
              </TabsTrigger>
            </TabsList>

            <div className="flex space-x-2">
              {['weekly', 'monthly', 'yearly'].map((period) => (
                <Badge
                  key={period}
                  variant={selectedPeriod === period ? 'default' : 'outline'}
                  className={`cursor-pointer capitalize hover:bg-blue-100 transition-colors ${
                    selectedPeriod === period ? 'bg-blue-600 text-white' : ''
                  }`}
                  onClick={() => setSelectedPeriod(period)}
                >
                  {period}
                </Badge>
              ))}
            </div>
          </div>

          <TabsContent value="overview" className="space-y-6">
            <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Income vs Expenses Trend</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" fontSize={12} />
                      <YAxis stroke="#64748b" fontSize={12} />
                      <Tooltip 
                        contentStyle={{
                          backgroundColor: 'rgba(255, 255, 255, 0.95)',
                          border: 'none',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        formatter={(value) => [formatCurrencyAmount(value), '']}
                      />
                      <Bar dataKey="income" fill="#10b981" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="w-5 h-5" />
                    <span>Expense Breakdown</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RechartsPieChart>
                        <Pie
                          data={expensePieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          {expensePieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [formatCurrencyAmount(value), 'Amount']} />
                      </RechartsPieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Top Spending Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expensePieData.slice(0, 5).map((category, index) => {
                      const percentage = (category.value / expensePieData.reduce((sum, cat) => sum + cat.value, 0)) * 100;
                      return (
                        <div key={category.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div 
                              className="w-4 h-4 rounded-full" 
                              style={{ backgroundColor: category.color }}
                            />
                            <span className="font-medium text-gray-700">{category.name}</span>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-gray-900">{formatCurrencyAmount(category.value)}</div>
                            <div className="text-sm text-gray-500">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions">
            <TransactionHistory 
              transactions={transactions}
              selectedPeriod={selectedPeriod}
              onDeleteTransaction={handleDeleteTransaction}
              onUpdateTransaction={handleUpdateTransaction}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Add Transaction Modal */}
      {showAddTransaction && (
        <TransactionForm 
          isOpen={showAddTransaction}
          onClose={() => setShowAddTransaction(false)}
          onSave={handleAddTransaction}
        />
      )}
    </div>
  );
};

export default Dashboard;
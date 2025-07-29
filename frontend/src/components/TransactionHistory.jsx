import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockCategories, getCategoryById } from '../mockData';
import { convertCurrency, formatCurrency } from '../services/currencyService';
import { 
  Search, 
  Filter, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Edit,
  Trash2,
  MoreHorizontal
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../hooks/use-toast';
import TransactionForm from './TransactionForm';

const TransactionHistory = ({ transactions = [], selectedPeriod = 'monthly', selectedCurrency = 'USD', onDeleteTransaction, onUpdateTransaction }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date-desc');
  const [editingTransaction, setEditingTransaction] = useState(null);
  
  const { toast } = useToast();

  // Filter transactions based on selected period
  const periodFilteredTransactions = useMemo(() => {
    const now = new Date();
    let startDate, endDate;
    
    switch (selectedPeriod) {
      case 'weekly':
        // Current week (Monday to Sunday)
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay() + 1);
        startDate = startOfWeek.toISOString().slice(0, 10);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endDate = endOfWeek.toISOString().slice(0, 10);
        break;
      case 'yearly':
        // Current year
        startDate = `${now.getFullYear()}-01-01`;
        endDate = `${now.getFullYear()}-12-31`;
        break;
      case 'monthly':
      default:
        // Current month
        startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-01`;
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${lastDay}`;
        break;
    }

    return transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );
  }, [transactions, selectedPeriod]);

  // Filter and search transactions
  const filteredTransactions = useMemo(() => {
    let filtered = [...periodFilteredTransactions];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        getCategoryById(t.category, t.type)?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(t => t.type === filterType);
    }

    // Apply category filter
    if (filterCategory !== 'all') {
      filtered = filtered.filter(t => t.category === filterCategory);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return b.amount - a.amount;
        case 'amount-asc':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });

    return filtered;
  }, [periodFilteredTransactions, searchTerm, filterType, filterCategory, sortBy]);

  // Get all categories for filter dropdown
  const allCategories = useMemo(() => {
    return [...mockCategories.income, ...mockCategories.expense];
  }, []);

  const formatCurrencyAmount = (amount, currency) => {
    return formatCurrency(convertCurrency(amount, currency || 'USD', selectedCurrency), selectedCurrency);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'MMM dd, yyyy');
  };

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
  };

  const handleSaveEdit = (updatedTransaction) => {
    if (onUpdateTransaction) {
      onUpdateTransaction(updatedTransaction);
      toast({
        title: "Transaction Updated",
        description: "The transaction has been successfully updated.",
      });
    }
    setEditingTransaction(null);
  };

  const handleDelete = (transactionId) => {
    if (onDeleteTransaction) {
      onDeleteTransaction(transactionId);
      toast({
        title: "Transaction Deleted",
        description: "The transaction has been successfully removed.",
      });
    }
  };

  const TransactionItem = ({ transaction }) => {
    const category = getCategoryById(transaction.category, transaction.type);
    const isIncome = transaction.type === 'income';

    return (
      <div className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-100 hover:border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center space-x-4 flex-1">
          {/* Category Icon & Color */}
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: `${category?.color}20` }}
          >
            <div 
              className="w-6 h-6 rounded-full"
              style={{ backgroundColor: category?.color }}
            />
          </div>

          {/* Transaction Details */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-1">
              <h3 className="font-semibold text-gray-900 truncate">
                {transaction.description}
              </h3>
              <Badge variant={isIncome ? 'default' : 'destructive'} className="shrink-0">
                {isIncome ? (
                  <TrendingUp className="w-3 h-3 mr-1" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1" />
                )}
                {transaction.type}
              </Badge>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-500">
              <span className="font-medium">{category?.name || transaction.category}</span>
              <span>•</span>
              <span className="flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(transaction.date)}
              </span>
            </div>
          </div>
        </div>

        {/* Amount & Actions */}
        <div className="flex items-center space-x-4">
          <div className="text-right">
            <div className={`text-lg font-bold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
              {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
            </div>
          </div>
          
          <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleEdit(transaction)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleDelete(transaction.id)}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-bold text-gray-900">Transaction History</CardTitle>
          <Badge variant="outline" className="text-sm">
            {filteredTransactions.length} transactions
          </Badge>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Type Filter */}
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Category Filter */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {allCategories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort Options */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
              <SelectItem value="amount-desc">Highest Amount</SelectItem>
              <SelectItem value="amount-asc">Lowest Amount</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent>
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MoreHorizontal className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' || filterCategory !== 'all'
                ? "Try adjusting your filters to see more results"
                : "Add your first transaction to get started"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => (
              <TransactionItem key={transaction.id} transaction={transaction} />
            ))}
          </div>
        )}
      </CardContent>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <TransactionForm
          isOpen={!!editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSave={handleSaveEdit}
          editingTransaction={editingTransaction}
        />
      )}
    </Card>
  );
};

export default TransactionHistory;
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Badge } from './ui/badge';
import { mockCategories } from '../mockData';
import { DEFAULT_CURRENCY } from '../services/currencyService';
import CurrencySelector from './CurrencySelector';
import { 
  Plus, 
  Minus, 
  CalendarDays, 
  DollarSign,
  Save,
  X
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '../hooks/use-toast';

const TransactionForm = ({ isOpen, onClose, onSave, editingTransaction = null, selectedCurrency = DEFAULT_CURRENCY }) => {
  const [transactionType, setTransactionType] = useState(editingTransaction?.type || 'expense');
  const [amount, setAmount] = useState(editingTransaction?.amount?.toString() || '');
  const [currency, setCurrency] = useState(editingTransaction?.currency || selectedCurrency);
  const [category, setCategory] = useState(editingTransaction?.category || '');
  const [description, setDescription] = useState(editingTransaction?.description || '');
  const [date, setDate] = useState(editingTransaction ? new Date(editingTransaction.date) : new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!amount || !category || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount", 
        description: "Amount must be greater than 0",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would save to backend
    const transactionData = {
      id: editingTransaction?.id || Date.now().toString(),
      type: transactionType,
      amount: parseFloat(amount),
      currency: currency,
      category: showCustomCategory ? customCategory.toLowerCase().replace(/\s+/g, '-') : category,
      description,
      date: format(date, 'yyyy-MM-dd')
    };

    if (onSave) {
      onSave(transactionData);
    }
    
    toast({
      title: editingTransaction ? "Transaction Updated" : "Transaction Added",
      description: `${transactionType === 'income' ? 'Income' : 'Expense'} of $${amount} has been ${editingTransaction ? 'updated' : 'saved'}`,
    });

    // Reset form
    setAmount('');
    setCurrency(selectedCurrency);
    setCategory('');
    setDescription('');
    setDate(new Date());
    setCustomCategory('');
    setShowCustomCategory(false);
    onClose();
  };

  const currentCategories = mockCategories[transactionType];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-xl">
            <div className={`p-2 rounded-lg ${transactionType === 'income' ? 'bg-green-100' : 'bg-red-100'}`}>
              {transactionType === 'income' ? (
                <Plus className="w-5 h-5 text-green-600" />
              ) : (
                <Minus className="w-5 h-5 text-red-600" />
              )}
            </div>
            <span>{editingTransaction ? 'Edit' : 'Add'} Transaction</span>
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Transaction Type Toggle */}
          <Tabs value={transactionType} onValueChange={setTransactionType}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                value="income" 
                className="flex items-center space-x-2 data-[state=active]:bg-green-500 data-[state=active]:text-white"
              >
                <Plus className="w-4 h-4" />
                <span>Income</span>
              </TabsTrigger>
              <TabsTrigger 
                value="expense"
                className="flex items-center space-x-2 data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                <Minus className="w-4 h-4" />
                <span>Expense</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
              Amount *
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="amount"
                type="number"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-9 text-lg font-semibold"
                step="0.01"
                min="0"
                required
              />
            </div>
          </div>

          {/* Category Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">
              Category *
            </Label>
            
            {!showCustomCategory ? (
              <>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentCategories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        <div className="flex items-center space-x-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: cat.color }}
                          />
                          <span>{cat.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCustomCategory(true)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Custom Category
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Input
                  placeholder="Enter custom category name"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="font-medium"
                  required
                />
                <div className="flex space-x-2">
                  <Button 
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowCustomCategory(false);
                      setCustomCategory('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              Date *
            </Label>
            <Popover open={showCalendar} onOpenChange={setShowCalendar}>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarDays className="mr-2 h-4 w-4" />
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => {
                    setDate(newDate || new Date());
                    setShowCalendar(false);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium text-gray-700">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Enter transaction description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="resize-none"
              rows={3}
              required
            />
          </div>

          {/* Form Actions */}
          <div className="flex space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button
              type="submit"
              className={`flex-1 ${
                transactionType === 'income' 
                  ? 'bg-green-600 hover:bg-green-700' 
                  : 'bg-red-600 hover:bg-red-700'
              } text-white`}
            >
              <Save className="w-4 h-4 mr-2" />
              {editingTransaction ? 'Update' : 'Save'} Transaction
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TransactionForm;
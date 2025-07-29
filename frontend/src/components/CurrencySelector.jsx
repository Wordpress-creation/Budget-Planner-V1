import React, { useState } from 'react';
import { Button } from './ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator 
} from './ui/dropdown-menu';
import { Badge } from './ui/badge';
import { ChevronDown, DollarSign } from 'lucide-react';
import { CURRENCIES, getCurrencySymbol } from '../services/currencyService';

const CurrencySelector = ({ selectedCurrency, onCurrencyChange, className = "" }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleCurrencySelect = (currencyCode) => {
    onCurrencyChange(currencyCode);
    setIsOpen(false);
  };

  const selectedCurrencyInfo = CURRENCIES[selectedCurrency];

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          className={`flex items-center space-x-2 min-w-[100px] ${className}`}
        >
          <span className="text-lg font-bold">{getCurrencySymbol(selectedCurrency)}</span>
          <span className="text-sm font-medium">{selectedCurrency}</span>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="flex items-center space-x-2">
          <DollarSign className="w-4 h-4" />
          <span>Select Currency</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-64 overflow-y-auto">
          {Object.entries(CURRENCIES).map(([code, currency]) => (
            <DropdownMenuItem 
              key={code} 
              onClick={() => handleCurrencySelect(code)}
              className={`cursor-pointer ${selectedCurrency === code ? 'bg-blue-50' : ''}`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-bold w-6">{currency.symbol}</span>
                  <div>
                    <div className="font-medium">{currency.name}</div>
                    <div className="text-xs text-gray-500">{code}</div>
                  </div>
                </div>
                {selectedCurrency === code && (
                  <Badge variant="default" className="ml-2">Current</Badge>
                )}
              </div>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CurrencySelector;
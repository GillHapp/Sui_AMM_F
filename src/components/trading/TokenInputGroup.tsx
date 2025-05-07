'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import type { Token } from '@/types';
import TokenIcon from './TokenIcon';
import { ChevronDown, Loader2 } from 'lucide-react';

interface TokenInputGroupProps {
  label: string;
  amount: string;
  onAmountChange: (value: string) => void;
  selectedToken?: Token;
  onTokenClick: () => void; // To open TokenSelectorModal
  disabled?: boolean;
  inputId: string;
  isOutput?: boolean; // If true, amount input might be read-only or styled differently
  isLoading?: boolean; // For loading state on output field during calculation
}

export default function TokenInputGroup({
  label,
  amount,
  onAmountChange,
  selectedToken,
  onTokenClick,
  disabled = false,
  inputId,
  isOutput = false,
  isLoading = false,
}: TokenInputGroupProps) {
  return (
    <div className="space-y-2 bg-muted/30 p-4 rounded-lg border border-border transition-all hover:border-primary/50 focus-within:border-primary">
      <Label htmlFor={inputId} className="text-sm font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2 sm:gap-3">
        <Input
          id={inputId}
          type="number"
          placeholder="0.0"
          value={amount}
          onChange={(e) => onAmountChange(e.target.value)}
          className="text-xl sm:text-2xl font-mono py-6 flex-grow bg-transparent border-0 focus:ring-0 focus:outline-none shadow-none px-1 disabled:bg-transparent"
          disabled={disabled || (isOutput && !isLoading)} // Output fields are typically not directly editable unless loading
          readOnly={isOutput && !isLoading}
          aria-label={`${label} amount`}
          min="0"
          step="any"
        />
        <Button
          type="button"
          variant="outline"
          onClick={onTokenClick}
          className="min-w-[120px] sm:min-w-[150px] h-12 sm:h-14 flex items-center justify-between px-3 py-2 rounded-lg bg-background hover:bg-muted shadow-sm text-base sm:text-lg"
          disabled={disabled}
          aria-label={`Select token for ${label}`}
        >
          {isLoading && isOutput ? (
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          ) : selectedToken ? (
            <>
              <TokenIcon token={selectedToken} size={28} className="mr-2" />
              <span className="font-semibold">{selectedToken.symbol}</span>
            </>
          ) : (
            <span className="text-muted-foreground">Select</span>
          )}
          {!isLoading && <ChevronDown className="h-5 w-5 ml-auto text-muted-foreground opacity-70" />}
        </Button>
      </div>
    </div>
  );
}

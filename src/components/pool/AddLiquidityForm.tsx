'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { Token } from '@/types';
import { MOCK_TOKENS, findTokenBySymbol, DEFAULT_TOKEN_A_SYMBOL, DEFAULT_TOKEN_B_SYMBOL } from '@/config/tokens';
import { useToast } from '@/hooks/use-toast';
import { Loader2, PlusCircle, Info, AlertTriangle } from 'lucide-react';
import { gsap } from 'gsap';
import TokenInputGroup from '@/components/trading/TokenInputGroup';
import TokenSelectorModal from '@/components/trading/TokenSelectorModal';

export default function AddLiquidityForm() {
  const [tokenA, setTokenA] = useState<Token | undefined>(findTokenBySymbol(DEFAULT_TOKEN_A_SYMBOL));
  const [tokenB, setTokenB] = useState<Token | undefined>(findTokenBySymbol(DEFAULT_TOKEN_B_SYMBOL));
  const [amountA, setAmountA] = useState<string>('');
  const [amountB, setAmountB] = useState<string>('');
  const [slippage, setSlippage] = useState<string>('0.5'); // Default slippage 0.5%
  const [shareOfPool, setShareOfPool] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
  const [modalOpenFor, setModalOpenFor] = useState<'A' | 'B' | null>(null);

  const { toast } = useToast();
  const formRef = useRef<HTMLDivElement>(null);
  const confirmButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // GSAP entrance animation for the form
    if (formRef.current) {
      gsap.fromTo(
        formRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, []);

  // Mock price ratio and pool share calculation
  const calculateDependentAmountAndPoolShare = useCallback(() => {
    if (tokenA && tokenB && amountA) {
      const numericAmountA = parseFloat(amountA);
      if (!isNaN(numericAmountA) && numericAmountA > 0) {
        setIsCalculating(true);
        setTimeout(() => { // Simulate async calculation
          // Mock price: 1 TokenA = 1.2 TokenB (adjust as needed or make dynamic)
          const mockPriceRatio = 1.2; 
          setAmountB((numericAmountA * mockPriceRatio).toFixed(Math.min(8, tokenB.decimals || 4)));
          // Mock pool share calculation
          const mockTotalLiquidityA = 10000; // Mock existing liquidity for token A
          setShareOfPool(((numericAmountA / (mockTotalLiquidityA + numericAmountA)) * 100).toFixed(2));
          setIsCalculating(false);
        }, 500);
      } else {
        setAmountB('');
        setShareOfPool(null);
      }
    } else if (amountA === '') {
        setAmountB('');
        setShareOfPool(null);
    }
  }, [tokenA, tokenB, amountA]);

  useEffect(() => {
    calculateDependentAmountAndPoolShare();
  }, [tokenA, tokenB, amountA, calculateDependentAmountAndPoolShare]);


  const handleTokenSelect = (symbol: string, field: 'A' | 'B') => {
    const selectedToken = findTokenBySymbol(symbol);
    setModalOpenFor(null);

    if (field === 'A') {
      if (selectedToken?.symbol === tokenB?.symbol) {
        setTokenB(tokenA); // Swap if same token selected
      }
      setTokenA(selectedToken);
    } else { // Field B
      if (selectedToken?.symbol === tokenA?.symbol) {
        setTokenA(tokenB); // Swap if same token selected
      }
      setTokenB(selectedToken);
    }
     // Reset amounts when tokens change to avoid stale data
    setAmountA('');
    setAmountB('');
    setShareOfPool(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidSubmission) return;

    setIsSubmitting(true);
    gsap.to(confirmButtonRef.current, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1 });

    // Simulate API call and wallet confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Liquidity Added!',
        description: `Successfully added ${amountA} ${tokenA?.symbol} and ${amountB} ${tokenB?.symbol} to the pool. You received LP tokens.`,
        variant: 'default',
      });

      // GSAP animation for LP token receipt (mock)
      const lpTokenElement = document.createElement('div');
      lpTokenElement.innerHTML = `🎉 LP Tokens Minted!`;
      lpTokenElement.className = 'fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-accent text-accent-foreground p-4 rounded-lg shadow-xl text-lg z-50';
      document.body.appendChild(lpTokenElement);
      gsap.fromTo(lpTokenElement, 
        { opacity: 0, scale: 0.5, y: 50 }, 
        { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)',
          onComplete: () => {
            gsap.to(lpTokenElement, { opacity: 0, scale: 0.5, y: -50, duration: 0.5, delay: 1.5, ease: 'power2.in', onComplete: () => lpTokenElement.remove() });
          }
        }
      );

      setAmountA('');
      setAmountB('');
      setShareOfPool(null);
    }, 2000);
  };

  const numericAmountA = parseFloat(amountA);
  const numericAmountB = parseFloat(amountB);
  const isValidAmounts = !isNaN(numericAmountA) && numericAmountA > 0 && !isNaN(numericAmountB) && numericAmountB > 0;
  const isValidSubmission = isValidAmounts && !!tokenA && !!tokenB && !isCalculating;
  
  let buttonText = "Add Liquidity";
  if (!tokenA || !tokenB) buttonText = "Select Tokens";
  else if (!amountA || !amountB) buttonText = "Enter Amounts";
  else if (!isValidAmounts) buttonText = "Enter Valid Amounts";
  else if (isCalculating) buttonText = "Calculating...";


  return (
    <>
    <div ref={formRef} className="w-full space-y-6">
      <TokenInputGroup
        label="Token A Amount"
        amount={amountA}
        onAmountChange={(val) => {
          setAmountA(val);
          // If user types in token A, token B becomes dependent and read-only for amount
          // Or, we can let them type both and show a warning if ratio is off. For now, A drives B.
        }}
        selectedToken={tokenA}
        onTokenClick={() => setModalOpenFor('A')}
        disabled={isSubmitting}
        inputId="pool-tokenA-amount"
      />

      <div className="flex justify-center items-center text-primary my-2">
        <PlusCircle className="h-6 w-6" />
      </div>

      <TokenInputGroup
        label="Token B Amount"
        amount={amountB}
        onAmountChange={(val) => {
          setAmountB(val);
          // If amountB is changed, clear amountA to indicate B is now driving A (or recalculate A)
          // For simplicity, we'll assume A drives B for now; B input is effectively read-only or indicative.
          // If you want B to drive A, you'd need similar logic as in TradingForm
        }}
        selectedToken={tokenB}
        onTokenClick={() => setModalOpenFor('B')}
        disabled={isSubmitting || isCalculating} // Disable B amount input if A is driving it and calculating
        inputId="pool-tokenB-amount"
        isOutput={true} // Marking as output-like as it's calculated from Token A
        isLoading={isCalculating && !!amountA} // Show loading only if A has value and B is being calculated
      />
      
      <div className="space-y-2">
        <Label htmlFor="slippage" className="flex items-center">
          Slippage Tolerance <Info className="ml-1 h-4 w-4 text-muted-foreground cursor-help" title="Your transaction will revert if the price changes unfavorably by more than this percentage." />
        </Label>
        <div className="flex space-x-2">
          {['0.1', '0.5', '1.0'].map(val => (
            <Button
              key={val}
              type="button"
              variant={slippage === val ? "default" : "outline"}
              onClick={() => setSlippage(val)}
              className="flex-1"
              disabled={isSubmitting}
            >
              {val}%
            </Button>
          ))}
          <Input
            id="slippage"
            type="number"
            placeholder="Custom"
            value={slippage}
            onChange={(e) => setSlippage(e.target.value)}
            className="w-24 text-center"
            step="0.1"
            min="0"
            disabled={isSubmitting}
          />
        </div>
      </div>

      {shareOfPool && (
        <Card className="bg-muted/50 border-primary/30">
          <CardContent className="p-4">
            <p className="text-sm text-foreground font-medium">
              Estimated share of pool: <span className="text-primary font-bold">{shareOfPool}%</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Output is estimated. You will receive LP tokens that represent your position.
            </p>
          </CardContent>
        </Card>
      )}

      <Button
        ref={confirmButtonRef}
        type="button" // Changed to button, will be called by form's onSubmit handler if wrapped
        onClick={handleSubmit} // Direct click handler
        className="w-full text-lg py-6 bg-accent hover:bg-accent/90 transition-all duration-300 ease-out transform hover:scale-102 active:scale-98 shadow-md hover:shadow-lg"
        disabled={!isValidSubmission || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Confirming...
          </>
        ) : buttonText === "Add Liquidity" ? (
          "Add Liquidity"
        ) : (
          <>
            <AlertTriangle className="mr-2 h-5 w-5" />
            {buttonText}
          </>
        )}
      </Button>
      </div>
      <TokenSelectorModal
        isOpen={!!modalOpenFor}
        onClose={() => setModalOpenFor(null)}
        onSelectToken={(tokenSymbol) => {
          if (modalOpenFor) {
            handleTokenSelect(tokenSymbol, modalOpenFor);
          }
        }}
        currentTokenA={tokenA}
        currentTokenB={tokenB}
        selectingFor={modalOpenFor}
      />
    </>
  );
}

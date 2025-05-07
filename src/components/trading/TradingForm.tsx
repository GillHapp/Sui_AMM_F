'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TokenSelect from './TokenSelect'; // This will be part of TokenInputGroup
import type { Token } from '@/types';
import { ArrowDownUp, Loader2, AlertTriangle } from 'lucide-react';
import { MOCK_TOKENS, findTokenBySymbol, DEFAULT_TOKEN_A_SYMBOL, DEFAULT_TOKEN_B_SYMBOL } from '@/config/tokens';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';
import TokenInputGroup from './TokenInputGroup';
import TokenSelectorModal from './TokenSelectorModal';


export default function TradingForm() {
  const [tokenA, setTokenA] = useState<Token | undefined>(findTokenBySymbol(DEFAULT_TOKEN_A_SYMBOL));
  const [tokenB, setTokenB] = useState<Token | undefined>(findTokenBySymbol(DEFAULT_TOKEN_B_SYMBOL));
  const [amountA, setAmountA] = useState<string>('');
  const [amountB, setAmountB] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false); // For mock price calculation
  const [modalOpenFor, setModalOpenFor] = useState<'A' | 'B' | null>(null);

  const { toast } = useToast();

  const cardRef = useRef<HTMLDivElement>(null);
  const tokenAGroupRef = useRef<HTMLDivElement>(null);
  const tokenBGroupRef = useRef<HTMLDivElement>(null);
  const swapButtonRef = useRef<HTMLButtonElement>(null);

  // Mock price calculation logic
  const calculateRate = useCallback((fromToken?: Token, toToken?: Token) => {
    if (!fromToken || !toToken) return 1;
    // Simple mock rates, ideally fetched from an oracle or AMM logic
    if (fromToken.symbol === 'SUI' && toToken.symbol === 'USDC') return 1.2;
    if (fromToken.symbol === 'USDC' && toToken.symbol === 'SUI') return 1 / 1.2;
    if (fromToken.symbol === 'BTC' && toToken.symbol === 'USDC') return 60000;
    if (fromToken.symbol === 'USDC' && toToken.symbol === 'BTC') return 1 / 60000;
    return Math.random() * 2 + 0.5; // Generic random rate
  }, []);

  useEffect(() => {
    if (tokenA && tokenB && amountA) {
      const numericAmountA = parseFloat(amountA);
      if (!isNaN(numericAmountA) && numericAmountA > 0) {
        setIsCalculating(true);
        setTimeout(() => { // Simulate async price fetch
          const rate = calculateRate(tokenA, tokenB);
          setAmountB((numericAmountA * rate).toFixed(Math.min(8, tokenB.decimals || 4)));
          setIsCalculating(false);
        }, 300);
      } else {
        setAmountB('');
      }
    } else if (amountA === '') { // Clear B if A is cleared
        setAmountB('');
    }
  }, [tokenA, tokenB, amountA, calculateRate]);

  useEffect(() => {
    if (tokenA && tokenB && amountB && !amountA) { // Only calculate A if A is not the source of truth
      const numericAmountB = parseFloat(amountB);
      if (!isNaN(numericAmountB) && numericAmountB > 0) {
        setIsCalculating(true);
         setTimeout(() => {
          const rate = calculateRate(tokenB, tokenA); // Inverted rate
          setAmountA((numericAmountB * rate).toFixed(Math.min(8, tokenA.decimals || 4)));
          setIsCalculating(false);
        }, 300);
      } else {
        setAmountA('');
      }
    } else if (amountB === '') { // Clear A if B is cleared (and A wasn't primary input)
      // setAmountA(''); // This caused issues, handled by amountA useEffect
    }
  }, [tokenA, tokenB, amountB, calculateRate, amountA]);


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
  };

  const handleSwapTokens = () => {
    const tl = gsap.timeline();
    tl.to([tokenAGroupRef.current, tokenBGroupRef.current], {
      y: (i) => (i === 0 ? 110 : -110), // Adjusted y translation based on typical input group height
      opacity: 0,
      duration: 0.35,
      ease: 'power2.in',
      onComplete: () => {
        // Swap state
        const tempToken = tokenA;
        setTokenA(tokenB);
        setTokenB(tempToken);
        
        const tempAmount = amountA;
        setAmountA(amountB); // Set amount A first
        // Let useEffect for amountA handle amountB recalculation
        // This prevents double calculation and potential race conditions
        // setAmountB(tempAmount); - removed

        // Animate back in
        gsap.set([tokenAGroupRef.current, tokenBGroupRef.current], { y: (i) => (i === 0 ? -110 : 110) });
        gsap.to([tokenAGroupRef.current, tokenBGroupRef.current], {
          y: 0,
          opacity: 1,
          duration: 0.35,
          ease: 'power2.out',
        });
      },
    });
    gsap.to(swapButtonRef.current, { rotation: '+=180', duration: 0.6, ease: 'elastic.out(1, 0.75)' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTrade) return;

    setIsSubmitting(true);

    gsap.to(cardRef.current, {
      scale: 0.97,
      boxShadow: '0px 8px 20px hsla(var(--primary) / 0.2)',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Trade Simulated!',
        description: `Successfully swapped ${amountA} ${tokenA?.symbol} for ${amountB} ${tokenB?.symbol}.`,
        variant: 'default', // ShadCN uses default for success like style
      });
      setAmountA('');
      setAmountB('');
      
      gsap.fromTo(cardRef.current, 
        { outlineColor: 'hsla(var(--accent))', outlineWidth: 0, outlineStyle: 'solid', outlineOffset: '0px' },
        { outlineWidth: 3, outlineOffset: '3px', duration: 0.4, yoyo: true, repeat: 1, ease: 'elastic.out(1, 0.4)', 
          onComplete: () => {
            gsap.to(cardRef.current, { outlineWidth: 0, duration: 0.2 });
          }
        }
      );
    }, 1500);
  };

  const numericAmountA = parseFloat(amountA);
  const isValidAmountA = !isNaN(numericAmountA) && numericAmountA > 0;
  const isValidTrade = isValidAmountA && !!tokenA && !!tokenB && !isCalculating;

  let buttonText = "Swap Tokens";
  if (!tokenA || !tokenB) buttonText = "Select Tokens";
  else if (!amountA) buttonText = "Enter Amount";
  else if (!isValidAmountA) buttonText = "Enter Valid Amount";
  else if (isCalculating) buttonText = "Calculating...";


  return (
    <>
      <Card ref={cardRef} className="w-full max-w-md shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-card/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center text-primary">Swap Tokens</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Exchange tokens seamlessly and securely.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div ref={tokenAGroupRef}>
              <TokenInputGroup
                label="You Send"
                amount={amountA}
                onAmountChange={setAmountA}
                selectedToken={tokenA}
                onTokenClick={() => setModalOpenFor('A')}
                disabled={isSubmitting}
                inputId="tokenA-amount"
              />
            </div>

            <div className="flex justify-center items-center my-[-0.5rem] py-2"> {/* Added py-2 for spacing */}
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleSwapTokens}
                className="rounded-full border-2 border-primary hover:bg-primary/10 transition-all duration-300 ease-out transform hover:scale-110 active:scale-95 focus:ring-2 focus:ring-primary/50"
                aria-label="Swap tokens"
                ref={swapButtonRef}
                disabled={isSubmitting || !tokenA || !tokenB}
              >
                <ArrowDownUp className="h-5 w-5 text-primary" />
              </Button>
            </div>

            <div ref={tokenBGroupRef}>
              <TokenInputGroup
                label="You Receive (Estimated)"
                amount={amountB}
                onAmountChange={(val) => {
                  setAmountB(val);
                  if (val === '') setAmountA(''); // If B is cleared, clear A if B was the focus
                }}
                selectedToken={tokenB}
                onTokenClick={() => setModalOpenFor('B')}
                disabled={isSubmitting}
                inputId="tokenB-amount"
                isOutput={true}
                isLoading={isCalculating}
              />
            </div>
            
            { tokenA && tokenB && amountA && amountB && !isCalculating && (
                <p className="text-sm text-muted-foreground text-center">
                    1 {tokenA.symbol} ≈ {(parseFloat(amountB) / parseFloat(amountA)).toFixed(Math.min(6, tokenB.decimals || 4))} {tokenB.symbol}
                </p>
            )}

            <Button 
              type="submit" 
              className="w-full text-lg py-6 bg-accent hover:bg-accent/90 transition-all duration-300 ease-out transform hover:scale-102 active:scale-98 shadow-md hover:shadow-lg" 
              disabled={!isValidTrade || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing Swap...
                </>
              ) : buttonText === "Swap Tokens" ? (
                 "Swap Tokens"
              ) : (
                <>
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  {buttonText}
                </>
              )}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="text-xs text-muted-foreground text-center block">
          <p>Note: This is a simulation. No real assets are involved.</p>
          <p>Prices are estimates and subject to change.</p>
        </CardFooter>
      </Card>

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

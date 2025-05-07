'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import TokenSelect from './TokenSelect';
import type { Token } from '@/types';
import { ArrowDownUp, Loader2 } from 'lucide-react';
import { MOCK_TOKENS, findTokenBySymbol, DEFAULT_TOKEN_A_SYMBOL, DEFAULT_TOKEN_B_SYMBOL } from '@/config/tokens';
import { useToast } from '@/hooks/use-toast';
import { gsap } from 'gsap';

export default function TradingForm() {
  const [tokenA, setTokenA] = useState<Token | undefined>(findTokenBySymbol(DEFAULT_TOKEN_A_SYMBOL));
  const [tokenB, setTokenB] = useState<Token | undefined>(findTokenBySymbol(DEFAULT_TOKEN_B_SYMBOL));
  const [amountA, setAmountA] = useState<string>('');
  const [amountB, setAmountB] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const cardRef = useRef<HTMLDivElement>(null);
  const inputARef = useRef<HTMLInputElement>(null);
  const inputBRef = useRef<HTMLInputElement>(null);
  const swapButtonRef = useRef<HTMLButtonElement>(null);


  useEffect(() => {
    if (tokenA && tokenB && amountA) {
      const numericAmountA = parseFloat(amountA);
      if (!isNaN(numericAmountA) && numericAmountA > 0) {
        // Mock price: 1 TokenA = 1.2 TokenB
        const mockPrice = 1.2;
        setAmountB((numericAmountA * mockPrice).toFixed(4));
      } else {
        setAmountB('');
      }
    } else {
      setAmountB('');
    }
  }, [tokenA, tokenB, amountA]);

  useEffect(() => {
    if (tokenA && tokenB && amountB) {
      const numericAmountB = parseFloat(amountB);
      if (!isNaN(numericAmountB) && numericAmountB > 0) {
        const mockPrice = 1.2; // 1 Token A = 1.2 Token B, so 1 Token B = 1/1.2 Token A
        setAmountA((numericAmountB / mockPrice).toFixed(4));
      } else {
        setAmountA('');
      }
    } else {
      // setAmountA(''); // Only clear if amountA not primary input
    }
  }, [tokenA, tokenB, amountB]);


  const handleTokenASelect = (symbol: string) => {
    const selectedToken = findTokenBySymbol(symbol);
    if (selectedToken?.symbol === tokenB?.symbol) {
      setTokenB(tokenA); // Swap if same token selected
    }
    setTokenA(selectedToken);
  };

  const handleTokenBSelect = (symbol: string) => {
    const selectedToken = findTokenBySymbol(symbol);
    if (selectedToken?.symbol === tokenA?.symbol) {
      setTokenA(tokenB); // Swap if same token selected
    }
    setTokenB(selectedToken);
  };

  const handleSwapTokens = () => {
    gsap.to([inputARef.current, inputBRef.current], {
      y: (i) => (i === 0 ? 100 : -100),
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      onComplete: () => {
        setTokenA(tokenB);
        setTokenB(tokenA);
        setAmountA(amountB);
        setAmountB(amountA);
        gsap.fromTo(
          [inputARef.current, inputBRef.current],
          { y: (i) => (i === 0 ? -100 : 100), opacity: 0 },
          { y: 0, opacity: 1, duration: 0.3, ease: 'power2.out' }
        );
      },
    });
    gsap.to(swapButtonRef.current, { rotation: '+=180', duration: 0.5, ease: 'power2.inOut' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    gsap.to(cardRef.current, {
      scale: 0.98,
      boxShadow: '0px 5px 15px rgba(0,0,0,0.1)',
      duration: 0.2,
      yoyo: true,
      repeat: 1,
      ease: 'power1.inOut',
    });

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: 'Trade Simulated!',
        description: `Successfully swapped ${amountA} ${tokenA?.symbol} for ${amountB} ${tokenB?.symbol}.`,
        variant: 'default',
      });
      setAmountA('');
      setAmountB('');
      
      // Animation for successful trade
      gsap.fromTo(cardRef.current, 
        { outlineColor: 'hsla(var(--accent))', outlineWidth: 0, outlineStyle: 'solid', outlineOffset: '0px' },
        { outlineWidth: 4, outlineOffset: '4px', duration: 0.3, yoyo: true, repeat: 1, ease: 'elastic.out(1, 0.3)', 
          onComplete: () => {
            gsap.to(cardRef.current, { outlineWidth: 0, duration: 0.2 });
          }
        }
      );

    }, 1500);
  };

  return (
    <Card ref={cardRef} className="w-full max-w-md shadow-xl hover:shadow-2xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-2xl">Simulate Trade</CardTitle>
        <CardDescription>Test your trading strategies in a simulated environment.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2" ref={inputARef}>
            <Label htmlFor="tokenA-amount">You Send</Label>
            <div className="flex gap-2">
              <Input
                id="tokenA-amount"
                type="number"
                placeholder="0.0"
                value={amountA}
                onChange={(e) => setAmountA(e.target.value)}
                className="text-lg"
                disabled={isSubmitting}
              />
              <TokenSelect
                selectedToken={tokenA}
                onTokenSelect={handleTokenASelect}
                disabledTokens={[tokenB?.symbol || '']}
                label="Token A"
              />
            </div>
          </div>

          <div className="flex justify-center my-[-0.5rem]">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleSwapTokens}
              className="rounded-full border-2 border-primary hover:bg-primary/10 transition-all"
              aria-label="Swap tokens"
              ref={swapButtonRef}
              disabled={isSubmitting}
            >
              <ArrowDownUp className="h-5 w-5 text-primary" />
            </Button>
          </div>

          <div className="space-y-2" ref={inputBRef}>
            <Label htmlFor="tokenB-amount">You Receive (Estimated)</Label>
            <div className="flex gap-2">
              <Input
                id="tokenB-amount"
                type="number"
                placeholder="0.0"
                value={amountB}
                onChange={(e) => setAmountB(e.target.value)}
                className="text-lg"
                disabled={isSubmitting}
              />
              <TokenSelect
                selectedToken={tokenB}
                onTokenSelect={handleTokenBSelect}
                disabledTokens={[tokenA?.symbol || '']}
                label="Token B"
              />
            </div>
          </div>
          
          <Button type="submit" className="w-full text-lg py-6 bg-accent hover:bg-accent/90" disabled={isSubmitting || !amountA || !tokenA || !tokenB || parseFloat(amountA) <= 0}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Simulating...
              </>
            ) : (
              'Simulate Trade'
            )}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="text-xs text-muted-foreground">
        <p>Note: This is a simulation. No real assets are involved. Prices are estimates.</p>
      </CardFooter>
    </Card>
  );
}

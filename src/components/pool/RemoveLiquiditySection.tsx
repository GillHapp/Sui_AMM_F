'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import type { Token } from '@/types';
import { MOCK_TOKENS, findTokenBySymbol } from '@/config/tokens';
import TokenIcon from '@/components/trading/TokenIcon';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ArrowDown, Trash2 } from 'lucide-react';
import { gsap } from 'gsap';

interface LiquidityPosition {
  id: string;
  tokenA: Token;
  tokenB: Token;
  lpAmount: number; // Amount of LP tokens user holds
  sharePercent: number; // User's share of the pool
  tokenAAmountPooled: number; // Amount of Token A in their share
  tokenBAmountPooled: number; // Amount of Token B in their share
}

// Mock user's liquidity positions
const MOCK_LP_POSITIONS: LiquidityPosition[] = [
  {
    id: 'lp1',
    tokenA: findTokenBySymbol('SUI')!,
    tokenB: findTokenBySymbol('USDC')!,
    lpAmount: 150.75,
    sharePercent: 0.05,
    tokenAAmountPooled: 750,
    tokenBAmountPooled: 900,
  },
  {
    id: 'lp2',
    tokenA: findTokenBySymbol('BTC')!,
    tokenB: findTokenBySymbol('ETH')!,
    lpAmount: 2.5,
    sharePercent: 0.01,
    tokenAAmountPooled: 0.1,
    tokenBAmountPooled: 1.5,
  },
];

export default function RemoveLiquiditySection() {
  const [selectedPosition, setSelectedPosition] = useState<LiquidityPosition | null>(MOCK_LP_POSITIONS[0] || null);
  const [redeemPercent, setRedeemPercent] = useState<number>(50); // Default 50%
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { toast } = useToast();
  const sectionRef = useRef<HTMLDivElement>(null);
  const lpTokenCardRef = useRef<HTMLDivElement>(null);
  const receivedTokensRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      gsap.fromTo(
        sectionRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', delay: 0.1 }
      );
    }
  }, []);

  const handleRedeem = () => {
    if (!selectedPosition) return;
    setIsSubmitting(true);

    // GSAP animation for LP token fade-out and real tokens fade-in
    const tl = gsap.timeline({
      onComplete: () => {
        setIsSubmitting(false);
        toast({
          title: 'Liquidity Removed!',
          description: `Successfully redeemed ${redeemPercent}% of your LP tokens.`,
          variant: 'default',
        });
        // Mock: Update LP position (e.g., reduce lpAmount or remove if 100%)
        // This would typically involve refetching data or updating local state
        if (redeemPercent === 100) {
            // setSelectedPosition(null); // Or filter out from MOCK_LP_POSITIONS
        } else {
            // Update selectedPosition with new amounts (mock)
            // setSelectedPosition(prev => prev ? {...prev, lpAmount: prev.lpAmount * (1 - redeemPercent/100)} : null);
        }
        setRedeemPercent(50); // Reset slider
      }
    });

    if (lpTokenCardRef.current) {
      tl.to(lpTokenCardRef.current, {
        opacity: 0,
        scale: 0.8,
        duration: 0.5,
        ease: 'power2.in',
      });
    }

    if (receivedTokensRef.current) {
      gsap.set(receivedTokensRef.current, { opacity: 0, y: 30 }); // Initial state for received tokens
      tl.to(receivedTokensRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
      }, ">-0.2"); // Start slightly before LP token animation ends
    }
    
    // Simulate API call
    setTimeout(() => {
      tl.play(); // This will trigger onComplete after animations
    }, 1500);
  };

  const receivedTokenA = selectedPosition ? (selectedPosition.tokenAAmountPooled * redeemPercent) / 100 : 0;
  const receivedTokenB = selectedPosition ? (selectedPosition.tokenBAmountPooled * redeemPercent) / 100 : 0;

  if (MOCK_LP_POSITIONS.length === 0) {
    return (
      <Card className="text-center py-8">
        <CardContent>
          <Trash2 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg text-muted-foreground">You have no liquidity positions.</p>
          <p className="text-sm text-muted-foreground mt-1">Add liquidity to a pool to see your positions here.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div ref={sectionRef} className="space-y-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>Your Liquidity Positions</CardTitle>
          <CardDescription>Select a position to manage your liquidity.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {MOCK_LP_POSITIONS.map(pos => (
            <Button
              key={pos.id}
              variant={selectedPosition?.id === pos.id ? "default" : "outline"}
              className="w-full justify-start h-auto py-3"
              onClick={() => setSelectedPosition(pos)}
            >
              <div className="flex items-center space-x-3">
                <div className="flex -space-x-2">
                  <TokenIcon token={pos.tokenA} size={28} />
                  <TokenIcon token={pos.tokenB} size={28} />
                </div>
                <div>
                  <p className="font-semibold text-base">{pos.tokenA.symbol}/{pos.tokenB.symbol}</p>
                  <p className="text-xs text-left">LP Amount: {pos.lpAmount.toFixed(4)}</p>
                </div>
              </div>
            </Button>
          ))}
        </CardContent>
      </Card>

      {selectedPosition && (
        <Card ref={lpTokenCardRef} className="shadow-lg transition-all duration-500">
          <CardHeader>
            <CardTitle>Remove Liquidity from {selectedPosition.tokenA.symbol}/{selectedPosition.tokenB.symbol}</CardTitle>
            <CardDescription>Specify the percentage of LP tokens to redeem.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label htmlFor="redeem-percent" className="text-base">
                Redeem Percentage: <span className="font-bold text-primary">{redeemPercent}%</span>
              </Label>
              <Slider
                id="redeem-percent"
                min={0}
                max={100}
                step={1}
                value={[redeemPercent]}
                onValueChange={(value) => setRedeemPercent(value[0])}
                className="my-3"
                disabled={isSubmitting}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>

            <div ref={receivedTokensRef} className="space-y-3 opacity-100"> {/* Initial opacity for normal view */}
              <h3 className="text-lg font-semibold text-foreground">You will receive (estimated):</h3>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center space-x-2">
                  <TokenIcon token={selectedPosition.tokenA} size={24} />
                  <span className="font-medium">{selectedPosition.tokenA.symbol}</span>
                </div>
                <span className="font-semibold text-primary">{receivedTokenA.toFixed(Math.min(8,selectedPosition.tokenA.decimals || 4))}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                <div className="flex items-center space-x-2">
                  <TokenIcon token={selectedPosition.tokenB} size={24} />
                  <span className="font-medium">{selectedPosition.tokenB.symbol}</span>
                </div>
                <span className="font-semibold text-primary">{receivedTokenB.toFixed(Math.min(8,selectedPosition.tokenB.decimals || 4))}</span>
              </div>
            </div>

            <Button
              onClick={handleRedeem}
              className="w-full text-lg py-6 bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-all duration-300 ease-out transform hover:scale-102 active:scale-98 shadow-md hover:shadow-lg"
              disabled={isSubmitting || redeemPercent === 0}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 h-5 w-5" />
                  Remove Liquidity
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

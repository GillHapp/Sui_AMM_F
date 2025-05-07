'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import type { Token } from '@/types';
import { MOCK_TOKENS, findTokenBySymbol } from '@/config/tokens'; // Assuming MOCK_TOKENS can be used
import TokenIcon from '@/components/trading/TokenIcon';
import { Layers, PlusCircle, MinusCircle, Info } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface LiquidityPosition {
  id: string;
  tokenA: Token;
  tokenB: Token;
  lpAmount: number;
  // Add more relevant details like share percentage, underlying token amounts, etc.
  tokenAAmountPooled: number;
  tokenBAmountPooled: number;
}

// Mock user's liquidity positions - same as in RemoveLiquiditySection for consistency
const MOCK_USER_POSITIONS: LiquidityPosition[] = [
  {
    id: 'lp1',
    tokenA: findTokenBySymbol('SUI')!,
    tokenB: findTokenBySymbol('USDC')!,
    lpAmount: 150.75,
    tokenAAmountPooled: 750,
    tokenBAmountPooled: 900,
  },
  {
    id: 'lp2',
    tokenA: findTokenBySymbol('BTC')!,
    tokenB: findTokenBySymbol('ETH')!,
    lpAmount: 2.5,
    tokenAAmountPooled: 0.1,
    tokenBAmountPooled: 1.5,
  },
];

export default function UserLiquidityPositions() {
  const [positions, setPositions] = useState<LiquidityPosition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulate fetching user positions
    setTimeout(() => {
      setPositions(MOCK_USER_POSITIONS);
      setIsLoading(false);
    }, 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map(i => (
          <Card key={i} className="p-4">
            <div className="flex items-center space-x-3 animate-pulse">
              <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-muted"></div>
                <div className="h-8 w-8 rounded-full bg-muted"></div>
              </div>
              <div className="flex-1 space-y-1">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
              <div className="h-8 w-20 bg-muted rounded"></div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-6">
        <Layers className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
        <p className="text-muted-foreground mb-3">You have no active liquidity positions.</p>
        <Link href="/app/pool" passHref>
          <Button variant="default">
            <PlusCircle className="mr-2 h-4 w-4" /> Add Liquidity
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {positions.map((pos) => (
        <Card key={pos.id} className="p-4 hover:shadow-md transition-shadow duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="flex -space-x-2">
                <TokenIcon token={pos.tokenA} size={32} />
                <TokenIcon token={pos.tokenB} size={32} />
              </div>
              <div>
                <p className="font-semibold text-lg text-foreground">{pos.tokenA.symbol}/{pos.tokenB.symbol}</p>
                <p className="text-xs text-muted-foreground">
                  LP: {pos.lpAmount.toFixed(4)} | {pos.tokenA.symbol}: {pos.tokenAAmountPooled.toFixed(2)}, {pos.tokenB.symbol}: {pos.tokenBAmountPooled.toFixed(2)}
                </p>
              </div>
            </div>
            <div className="flex space-x-2 justify-end sm:justify-normal">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/app/pool#add')} // Navigate and potentially pre-fill or highlight related pool
              >
                <PlusCircle className="mr-1.5 h-4 w-4" /> Add
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/app/pool#remove')} // Navigate and potentially select this position
              >
                <MinusCircle className="mr-1.5 h-4 w-4" /> Remove
              </Button>
            </div>
          </div>
        </Card>
      ))}
       <div className="pt-2 text-center">
          <Link href="/app/pool" passHref>
            <Button variant="link" className="text-primary">
                Manage All Positions
            </Button>
          </Link>
        </div>
    </div>
  );
}

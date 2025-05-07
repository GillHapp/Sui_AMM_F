'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getMarketData, type MarketData } from '@/services/sui-blockchain';
import { DollarSign, Droplets, BarChart3, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description?: string;
  isLoading: boolean;
}

function StatCard({ title, value, icon: Icon, description, isLoading }: StatCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-5 w-5 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </>
        ) : (
          <>
            <div className="text-2xl font-bold text-foreground">
              {typeof value === 'number' && !title.toLowerCase().includes("price") ? value.toLocaleString() : value}
            </div>
            {description && <p className="text-xs text-muted-foreground pt-1">{description}</p>}
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default function MarketStats() {
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Using mock token addresses for now
        const data = await getMarketData('SUI_MOCK_ADDRESS', 'USDC_MOCK_ADDRESS');
        setMarketData(data);
      } catch (err) {
        setError('Failed to fetch market data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  if (error) {
    return <Card><CardContent className="text-destructive-foreground p-4">{error}</CardContent></Card>
  }
  
  const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Token Pair Price (SUI/USDC)"
        value={marketData ? formatCurrency(marketData.tokenPrice) : 'N/A'}
        icon={DollarSign}
        description="Current exchange rate"
        isLoading={isLoading}
      />
      <StatCard
        title="Liquidity Pool Size"
        value={marketData ? marketData.liquidityPoolSize : 0}
        icon={Droplets}
        description="Total value locked in pool"
        isLoading={isLoading}
      />
      <StatCard
        title="24h Trading Volume"
        value={marketData ? marketData.tradingVolume : 0}
        icon={BarChart3}
        description="Volume traded in last 24 hours"
        isLoading={isLoading}
      />
      <StatCard
        title="Market Trend"
        value="Stable" // Placeholder
        icon={TrendingUp}
        description="Overall market sentiment"
        isLoading={isLoading} // Assuming this could also load
      />
    </div>
  );
}

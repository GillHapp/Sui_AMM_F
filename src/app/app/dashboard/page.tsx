import MarketStats from '@/components/dashboard/MarketStats';
import HistoricalChart from '@/components/dashboard/HistoricalChart';
import UserLiquidityPositions from '@/components/dashboard/UserLiquidityPositions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { LayoutDashboard } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center space-x-3 mb-6">
        <LayoutDashboard className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold text-foreground">AMM Dashboard</h1>
      </div>

      <section aria-labelledby="market-overview-heading">
        <h2 id="market-overview-heading" className="text-2xl font-semibold text-foreground mb-4">
          Market Overview
        </h2>
        <MarketStats />
      </section>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <section aria-labelledby="historical-data-heading" className="lg:col-span-2">
          <h2 id="historical-data-heading" className="sr-only">
            Historical Market Data
          </h2>
          <HistoricalChart />
        </section>

        <section aria-labelledby="user-liquidity-heading" className="lg:col-span-1">
           <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Your Liquidity</CardTitle>
              <CardDescription>Manage your current liquidity positions.</CardDescription>
            </CardHeader>
            <CardContent>
              <UserLiquidityPositions />
            </CardContent>
          </Card>
        </section>
      </div>

      {/* Optional: Swap History Section */}
      {/* <section aria-labelledby="swap-history-heading">
        <h2 id="swap-history-heading" className="text-xl font-semibold text-foreground mb-3">
          Recent Swaps (Mock)
        </h2>
        <Card>
          <CardContent className="p-4">
            <p className="text-muted-foreground">Swap history will be shown here.</p>
          </CardContent>
        </Card>
      </section> */}
    </div>
  );
}

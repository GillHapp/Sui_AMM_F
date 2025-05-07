import MarketStats from '@/components/dashboard/MarketStats';
import HistoricalChart from '@/components/dashboard/HistoricalChart';
import TradingForm from '@/components/trading/TradingForm';

export default function HomePage() {
  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="space-y-8">
        <section aria-labelledby="market-stats-heading">
          <h2 id="market-stats-heading" className="sr-only">
            Market Statistics
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

          <section aria-labelledby="trading-form-heading" className="lg:col-span-1">
            <h2 id="trading-form-heading" className="sr-only">
              Simulated Trading
            </h2>
            <TradingForm />
          </section>
        </div>
      </div>
    </div>
  );
}

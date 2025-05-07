'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { getHistoricalMarketData, type HistoricalDataPoint } from '@/services/sui-blockchain';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

const chartConfigPrice: ChartConfig = {
  price: {
    label: 'Price (USD)',
    color: 'hsl(var(--primary))',
  },
};

const chartConfigVolume: ChartConfig = {
  volume: {
    label: 'Volume',
    color: 'hsl(var(--accent))',
  },
};

export default function HistoricalChart() {
  const [historicalData, setHistoricalData] = useState<HistoricalDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        // Using mock parameters for now
        const data = await getHistoricalMarketData('SUI_MOCK_ADDRESS', 'USDC_MOCK_ADDRESS', Date.now() - 86400000 * 7, Date.now());
        setHistoricalData(data.sort((a, b) => a.timestamp - b.timestamp)); // Ensure data is sorted by time
      } catch (err) {
        setError('Failed to fetch historical data.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  const formattedData = historicalData.map(item => ({
    ...item,
    date: format(new Date(item.timestamp), 'MMM d, HH:mm'),
  }));

  if (error) {
    return <Card><CardContent className="text-destructive-foreground p-4">{error}</CardContent></Card>
  }

  const renderChart = (dataKey: 'price' | 'volume', config: ChartConfig, ChartComponent: typeof LineChart | typeof BarChart, SeriesComponent: typeof Line | typeof Bar) => (
    <ChartContainer config={config} className="min-h-[300px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <ChartComponent data={formattedData} margin={{ left: 12, right: 12, top: 5, bottom: 5 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => value.slice(0, 6)} // Shorten date format for X-axis
          />
          <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => (dataKey === 'price' ? `$${value}` : value.toLocaleString())}
            domain={['auto', 'auto']}
          />
          <ChartTooltip
            cursor={true}
            content={<ChartTooltipContent
              labelFormatter={(label) => format(new Date(historicalData.find(d=>d.date === label)?.timestamp || Date.now()), 'PPpp')}
              formatter={(value, name) => ([
                (name === 'price' ? `$${Number(value).toFixed(2)}` : Number(value).toLocaleString()),
                config[name as keyof typeof config]?.label
              ])} 
            />}
          />
          <ChartLegend content={<ChartLegendContent />} />
          <SeriesComponent dataKey={dataKey} type="monotone" fill={`var(--color-${dataKey})`} stroke={`var(--color-${dataKey})`} radius={dataKey === 'volume' ? 4 : undefined} />
        </ChartComponent>
      </ResponsiveContainer>
    </ChartContainer>
  );

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle>Historical Data (SUI/USDC)</CardTitle>
        <CardDescription>Price and volume trends over time.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <Skeleton className="h-[350px] w-full" />
        ) : (
          <Tabs defaultValue="price" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="price">Price</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>
            <TabsContent value="price">
              {renderChart('price', chartConfigPrice, LineChart, Line)}
            </TabsContent>
            <TabsContent value="volume">
              {renderChart('volume', chartConfigVolume, BarChart, Bar)}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

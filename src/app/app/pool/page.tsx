'use client';

import AddLiquidityForm from '@/components/pool/AddLiquidityForm';
import RemoveLiquiditySection from '@/components/pool/RemoveLiquiditySection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Droplets, MinusCircle, PlusCircle } from 'lucide-react';

export default function PoolPage() {
  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <Card className="shadow-xl">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Droplets className="h-10 w-10 text-primary mr-3" />
            <CardTitle className="text-3xl font-bold">Liquidity Pool</CardTitle>
          </div>
          <CardDescription className="text-lg">
            Provide liquidity to earn rewards or remove your existing liquidity.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="add" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="add" className="py-3 text-base">
                <PlusCircle className="mr-2 h-5 w-5" /> Add Liquidity
              </TabsTrigger>
              <TabsTrigger value="remove" className="py-3 text-base">
                <MinusCircle className="mr-2 h-5 w-5" /> Remove Liquidity
              </TabsTrigger>
            </TabsList>
            <TabsContent value="add">
              <AddLiquidityForm />
            </TabsContent>
            <TabsContent value="remove">
              <RemoveLiquiditySection />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

import type { Token } from '@/types';
import { Bitcoin, Waves, Box } from 'lucide-react'; // Waves for SUI (water-like), Box as generic

export const MOCK_TOKENS: Token[] = [
  {
    id: 'sui',
    name: 'Sui',
    symbol: 'SUI',
    address: '0xSUI_ADDRESS',
    icon: Waves,
    color: 'hsl(var(--primary))', // Teal
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '0xBTC_ADDRESS',
    icon: Bitcoin,
    color: 'hsl(39, 100%, 50%)', // Orange
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xETH_ADDRESS',
    icon: Box, // Lucide doesn't have a direct Ether icon, using Sigma
    color: 'hsl(220, 50%, 60%)', // Blue-ish grey
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xUSDC_ADDRESS',
    icon: Box,
    color: 'hsl(206, 80%, 52%)', // Blue
  },
];

export const DEFAULT_TOKEN_A_SYMBOL = 'SUI';
export const DEFAULT_TOKEN_B_SYMBOL = 'USDC';

export const findTokenBySymbol = (symbol: string): Token | undefined => {
  return MOCK_TOKENS.find(token => token.symbol === symbol);
};

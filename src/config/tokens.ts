import type { Token } from '@/types';
import { Bitcoin, Box } from 'lucide-react'; // Box as generic, Bitcoin for BTC

export const MOCK_TOKENS: Token[] = [
  {
    id: 'sui',
    name: 'Sui',
    symbol: 'SUI',
    address: '0xSUI_ADDRESS',
    icon: Box, // Using generic Box icon for SUI
    color: 'hsl(var(--primary))', // Teal-like, from theme if possible
    decimals: 9,
  },
  {
    id: 'btc',
    name: 'Bitcoin',
    symbol: 'BTC',
    address: '0xBTC_ADDRESS',
    icon: Bitcoin,
    color: 'hsl(39, 100%, 50%)', // Orange
    decimals: 8,
  },
  {
    id: 'eth',
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0xETH_ADDRESS',
    icon: Box, // Using generic Box icon for ETH
    color: 'hsl(220, 50%, 60%)', // Blue-ish grey
    decimals: 18,
  },
  {
    id: 'usdc',
    name: 'USD Coin',
    symbol: 'USDC',
    address: '0xUSDC_ADDRESS',
    icon: Box, // Using generic Box icon for USDC
    color: 'hsl(206, 80%, 52%)', // Blue
    decimals: 6,
  },
  {
    id: 'usdt',
    name: 'Tether',
    symbol: 'USDT',
    address: '0xUSDT_ADDRESS',
    icon: Box,
    color: 'hsl(145, 58%, 45%)', // Greenish for USDT
    decimals: 6,
  },
  {
    id: 'dai',
    name: 'Dai',
    symbol: 'DAI',
    address: '0xDAI_ADDRESS',
    icon: Box,
    color: 'hsl(30, 90%, 55%)', // Orangey-Yellow for DAI
    decimals: 18,
  }
];

export const DEFAULT_TOKEN_A_SYMBOL = 'SUI';
export const DEFAULT_TOKEN_B_SYMBOL = 'USDC';

export const findTokenBySymbol = (symbol: string): Token | undefined => {
  return MOCK_TOKENS.find(token => token.symbol === symbol);
};

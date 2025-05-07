export interface Token {
  id: string;
  name: string;
  symbol: string;
  icon?: React.ElementType; // Component type for icon
  address: string; // Mock address
  color?: string; // For simple colored circle icons
  decimals?: number; // Number of decimal places for the token
}

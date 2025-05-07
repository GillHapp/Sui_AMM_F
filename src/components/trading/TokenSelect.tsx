import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MOCK_TOKENS } from "@/config/tokens";
import type { Token } from "@/types";
import TokenIcon from "./TokenIcon";

interface TokenSelectProps {
  selectedToken?: Token;
  onTokenSelect: (tokenSymbol: string) => void;
  disabledTokens?: string[]; // Symbols of tokens to disable
  label?: string;
}

export default function TokenSelect({
  selectedToken,
  onTokenSelect,
  disabledTokens = [],
  label = "Select Token"
}: TokenSelectProps) {
  return (
    <Select
      value={selectedToken?.symbol}
      onValueChange={(value) => onTokenSelect(value)}
    >
      <SelectTrigger className="w-full h-12 text-base">
        <SelectValue placeholder={label}>
          {selectedToken ? (
            <div className="flex items-center gap-2">
              <TokenIcon token={selectedToken} size={24} />
              <span>{selectedToken.symbol}</span>
            </div>
          ) : (
            label
          )}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {MOCK_TOKENS.map((token) => (
          <SelectItem
            key={token.id}
            value={token.symbol}
            disabled={disabledTokens.includes(token.symbol)}
            className="py-2"
          >
            <div className="flex items-center gap-3">
              <TokenIcon token={token} size={24} />
              <div>
                <p className="font-medium">{token.name}</p>
                <p className="text-xs text-muted-foreground">{token.symbol}</p>
              </div>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

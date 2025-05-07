'use client';

import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { MOCK_TOKENS } from '@/config/tokens';
import type { Token } from '@/types';
import TokenIcon from './TokenIcon';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Search } from 'lucide-react';
import { gsap } from 'gsap';

interface TokenSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectToken: (tokenSymbol: string) => void;
  currentTokenA?: Token;
  currentTokenB?: Token;
  selectingFor: 'A' | 'B' | null; // To disable the other selected token
}

export default function TokenSelectorModal({
  isOpen,
  onClose,
  onSelectToken,
  currentTokenA,
  currentTokenB,
  selectingFor
}: TokenSelectorModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      // GSAP pop-in animation
      gsap.fromTo(
        modalRef.current,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: 'power2.out' }
      );
      // Staggered fade-in for token list items
      if (listRef.current) {
        const items = listRef.current.querySelectorAll('[data-token-item]');
        gsap.fromTo(
          items,
          { opacity: 0, x: -20 },
          { opacity: 1, x: 0, duration: 0.3, stagger: 0.05, ease: 'power1.out', delay: 0.1 }
        );
      }
      setSearchTerm(''); // Reset search on open
    }
  }, [isOpen]);

  const handleClose = () => {
    // GSAP pop-out animation
    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.95,
      y: 10,
      duration: 0.2,
      ease: 'power1.in',
      onComplete: onClose,
    });
  };

  const filteredTokens = MOCK_TOKENS.filter(
    (token) =>
      token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDisabledSymbol = () => {
    if (selectingFor === 'A') return currentTokenB?.symbol;
    if (selectingFor === 'B') return currentTokenA?.symbol;
    return undefined;
  }
  const disabledSymbol = getDisabledSymbol();

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent 
        ref={modalRef} 
        className="sm:max-w-[425px] p-0 bg-card shadow-2xl rounded-xl overflow-hidden"
        onPointerDownOutside={(e) => e.preventDefault()} // Prevents closing on outside click during animation
        onEscapeKeyDown={handleClose}
      >
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-2xl font-semibold text-foreground">Select a Token</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Search for a token by name or symbol.
          </DialogDescription>
          <DialogClose asChild>
             <Button variant="ghost" size="icon" className="absolute right-4 top-4 rounded-full" onClick={handleClose}>
                <X className="h-5 w-5" />
             </Button>
          </DialogClose>
        </DialogHeader>
        
        <div className="p-6 pt-2 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search name or symbol..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-base rounded-lg border-border focus:ring-2 focus:ring-primary"
              data-ai-hint="search filter"
            />
          </div>

          <ScrollArea className="h-[300px] pr-3 -mr-3"> {/* Negative margin to hide original scrollbar if any */}
            <div ref={listRef} className="space-y-1">
              {filteredTokens.length > 0 ? (
                filteredTokens.map((token) => (
                  <Button
                    key={token.id}
                    variant="ghost"
                    className="w-full justify-start h-auto py-3 px-3 text-left rounded-md hover:bg-muted disabled:opacity-50"
                    onClick={() => {
                      onSelectToken(token.symbol);
                      handleClose(); // Close after selection
                    }}
                    disabled={token.symbol === disabledSymbol}
                    data-token-item // For GSAP animation targeting
                  >
                    <div className="flex items-center space-x-3 w-full">
                      <TokenIcon token={token} size={32} />
                      <div className="flex-grow">
                        <p className="font-semibold text-foreground">{token.symbol}</p>
                        <p className="text-xs text-muted-foreground">{token.name}</p>
                      </div>
                      {token.symbol === disabledSymbol && (
                        <span className="text-xs text-destructive-foreground/70 bg-destructive/50 px-2 py-0.5 rounded-sm">Selected</span>
                      )}
                    </div>
                  </Button>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-4">No tokens found.</p>
              )}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}

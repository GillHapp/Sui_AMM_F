'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, X, Menu, Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes'; // Assuming next-themes is or will be installed
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  const pathname = usePathname();
  const isActive = pathname === href || (href === '/app' && pathname.startsWith('/app/swap')); // Treat /app as /app/swap for active state

  // Special handling for /app default route to highlight Swap
  const actualHref = href === '/app' ? '/app/swap' : href;

  return (
    <Link href={actualHref} passHref>
      <Button
        variant="ghost"
        className={cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary font-semibold" : "text-muted-foreground"
        )}
      >
        {children}
      </Button>
    </Link>
  );
};

const ThemeToggle = () => {
  const { setTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <Button variant="ghost" size="icon" className="w-9 h-9" disabled><Sun className="h-5 w-5" /></Button>;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="rounded-full w-9 h-9 transition-all duration-300 ease-in-out hover:bg-accent/20"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="h-5 w-5 text-yellow-400 transform transition-transform duration-500 rotate-0 hover:rotate-180" />
      ) : (
        <Moon className="h-5 w-5 text-primary transform transition-transform duration-500 rotate-0 hover:-rotate-45" />
      )}
    </Button>
  );
};

const ConnectWalletButton = () => {
  // Placeholder for wallet connection logic
  const [isConnected, setIsConnected] = useState(false);
  const connectWallet = () => {
    // Mock connection
    setIsConnected(true);
    // Replace with actual wallet connection logic (e.g. Wagmi, RainbowKit)
    console.log("Connect wallet clicked");
  };
  const disconnectWallet = () => setIsConnected(false);

  return (
    <Button
      onClick={isConnected ? disconnectWallet : connectWallet}
      className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-out"
    >
      {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
    </Button>
  );
};


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Hide header on the landing page
  if (pathname === '/') {
    return null;
  }

  const navItems = [
    { href: '/app/swap', label: 'Swap' },
    { href: '/app/pool', label: 'Pool' },
    // { href: '/app/dashboard', label: 'Dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <Link href="/app" className="flex items-center space-x-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block text-lg text-foreground">
            SUI AMM
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-2 lg:space-x-4">
          {navItems.map((item) => (
            <NavLink key={item.href} href={item.href}>{item.label}</NavLink>
          ))}
        </nav>

        <div className="flex items-center space-x-2 md:space-x-4">
          <ThemeToggle />
          <div className="hidden md:block">
            <ConnectWalletButton />
          </div>
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background shadow-lg border-t border-border/40 p-4 space-y-2">
          <nav className="flex flex-col space-y-2">
            {navItems.map((item) => (
              <Link href={item.href} key={item.href} passHref>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-start text-base py-3",
                    (pathname === item.href || (item.href === '/app/swap' && pathname.startsWith('/app'))) ? "text-primary bg-muted font-semibold" : "text-foreground"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-border/40">
            <ConnectWalletButton />
          </div>
        </div>
      )}
    </header>
  );
}

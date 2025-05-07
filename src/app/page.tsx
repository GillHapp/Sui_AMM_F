'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { MOCK_TOKENS } from '@/config/tokens';
import TokenIcon from '@/components/trading/TokenIcon';
import AnimatedParticles from '@/components/landing/AnimatedParticles';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const ctaButtonRef = useRef<HTMLAnchorElement>(null);
  const tokenIconsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(
      titleRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(
        subtitleRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.6'
      )
      .fromTo(
        ctaButtonRef.current,
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.7)' },
        '-=0.5'
      );

    tokenIconsRef.current.forEach((icon, index) => {
      if (icon) {
        gsap.fromTo(
          icon,
          { opacity: 0, scale: 0.5, y: () => Math.random() * 100 - 50, x: () => Math.random() * 100 - 50 },
          {
            opacity: 1,
            scale: 1,
            duration: 1,
            delay: 0.5 + index * 0.1,
            ease: 'elastic.out(1, 0.5)',
          }
        );
        // Floating animation
        gsap.to(icon, {
          y: '+=15',
          x: '+=' + (Math.random() > 0.5 ? 1 : -1) * 10,
          repeat: -1,
          yoyo: true,
          duration: 2 + Math.random() * 2,
          ease: 'sine.inOut',
          delay: 1 + index * 0.2,
        });
      }
    });
  }, []);

  const displayTokens = MOCK_TOKENS.slice(0, 4);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-background to-primary/30 dark:to-primary/50 p-4">
      <AnimatedParticles />
      
      <div
        ref={heroRef}
        className="relative z-10 flex flex-col items-center text-center space-y-8 max-w-3xl"
      >
        <div className="flex space-x-4 mb-8">
          {displayTokens.map((token, index) => (
            <div
              key={token.id}
              ref={(el) => { tokenIconsRef.current[index] = el; }}
              className="p-2 bg-card rounded-full shadow-xl"
              data-ai-hint={`${token.symbol} icon`}
            >
              <TokenIcon token={token} size={index === 0 || index === 3 ? 64 : 48} />
            </div>
          ))}
        </div>

        <h1
          ref={titleRef}
          className="text-5xl md:text-7xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-secondary"
          style={{ WebkitBackgroundClip: 'text' }}
        >
          SUI AMM Visualizer
        </h1>
        <p ref={subtitleRef} className="text-xl md:text-2xl text-foreground/80 max-w-xl">
          Swap, Pool, Earn — All in One. Experience the future of decentralized finance.
        </p>
        <Link href="/app" passHref ref={ctaButtonRef}>
          <Button size="lg" className="text-lg px-8 py-6 rounded-full shadow-lg bg-accent hover:bg-accent/90 transform hover:scale-105 transition-transform duration-300 ease-out group">
            Launch App
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-foreground/60 z-10">
        <p>&copy; {new Date().getFullYear()} SUI AMM Visualizer. All rights reserved.</p>
      </div>
    </div>
  );
}

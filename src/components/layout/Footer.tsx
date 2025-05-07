'use client';
import Link from 'next/link';
import { Github, FileText, Shield, Twitter, Linkedin, Youtube } from 'lucide-react';
import { usePathname } from 'next/navigation';

const SocialIcon = ({ href, icon: Icon, label }: { href: string; icon: React.ElementType; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="text-muted-foreground hover:text-primary transition-colors duration-300 transform hover:scale-110"
  >
    <Icon className="h-6 w-6" />
  </a>
);

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on the landing page
  if (pathname === '/') {
    return null;
  }
  
  return (
    <footer className="border-t border-border/40 bg-background/80 backdrop-blur mt-16">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="flex items-center justify-center md:justify-start space-x-2">
             <svg width="32" height="32" viewBox="0 0 100 100" className="text-primary">
                <path fill="currentColor" d="M50,5A45,45,0,1,0,95,50,45,45,0,0,0,50,5Zm0,82A37,37,0,1,1,87,50,37,37,0,0,1,50,87Z"/>
                <path fill="currentColor" d="M50,26.36a3.5,3.5,0,0,0-3.5,3.5V47.5H28.86a3.5,3.5,0,0,0,0,7H46.5V72.14a3.5,3.5,0,0,0,7,0V54.5H71.14a3.5,3.5,0,0,0,0-7H53.5V29.86A3.5,3.5,0,0,0,50,26.36Z"/>
             </svg>
            <span className="font-semibold text-lg text-foreground">SUI AMM Visualizer</span>
          </div>

          <nav className="flex flex-wrap justify-center md:justify-center space-x-4 sm:space-x-6">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
              <Github className="inline-block mr-1 h-4 w-4" /> GitHub
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
              <FileText className="inline-block mr-1 h-4 w-4" /> Docs
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-300">
              <Shield className="inline-block mr-1 h-4 w-4" /> Terms
            </Link>
          </nav>

          <div className="flex justify-center md:justify-end space-x-5">
            <SocialIcon href="#" icon={Twitter} label="Twitter" />
            <SocialIcon href="#" icon={Linkedin} label="LinkedIn" />
            <SocialIcon href="#" icon={Youtube} label="YouTube" />
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} SUI AMM Visualizer. All rights reserved. Not financial advice.</p>
        </div>
      </div>
    </footer>
  );
}

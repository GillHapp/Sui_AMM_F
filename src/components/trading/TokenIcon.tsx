import type { Token } from '@/types';
import { cn } from '@/lib/utils';

interface TokenIconProps {
  token?: Token;
  size?: number;
  className?: string;
}

export default function TokenIcon({ token, size = 24, className }: TokenIconProps) {
  if (!token) {
    return <div style={{ width: size, height: size }} className={cn("rounded-full bg-muted", className)} />;
  }

  const IconComponent = token.icon;

  return (
    <div
      style={{ width: size, height: size }}
      className={cn(
        "flex items-center justify-center rounded-full",
        !IconComponent && token.color ? '' : 'bg-muted',
        className
      )}
    >
      {IconComponent ? (
        <IconComponent style={{ width: size * 0.7, height: size * 0.7 }} color={token.color || 'hsl(var(--foreground))'} />
      ) : (
        <div 
          style={{ 
            width: size * 0.8, 
            height: size * 0.8, 
            backgroundColor: token.color || 'hsl(var(--muted-foreground))' 
          }} 
          className="rounded-full"
        />
      )}
    </div>
  );
}

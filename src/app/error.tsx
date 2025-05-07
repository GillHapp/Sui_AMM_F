'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
 
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Global Error:", error)
  }, [error])
 
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
          <h2 className="text-4xl font-bold text-destructive mb-6">Application Error</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-lg text-center">
            We're sorry, but a critical error has occurred. Our team has been notified.
          </p>
          <p className="text-sm text-muted-foreground mb-2">Error details (for debugging):</p>
          <pre className="text-xs bg-muted p-3 rounded-md max-w-full overflow-auto mb-8">
            {error.message}
            {error.digest && `\nDigest: ${error.digest}`}
          </pre>
          <Button
            onClick={() => reset()}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Attempt to Recover
          </Button>
        </div>
      </body>
    </html>
  )
}

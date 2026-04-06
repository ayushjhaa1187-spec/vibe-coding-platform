import { cn } from '@/lib/utils'

interface Props {
  className?: string
}

export function Footer({ className }: Props) {
  return (
    <footer
      className={cn(
        'flex items-center justify-between px-4 py-2 border-t border-border text-xs text-muted-foreground bg-background',
        className
      )}
    >
      <span>
        Vibe Coding Platform — Built by{' '}
        <a
          href="https://github.com/ayushjhaa1187-spec"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Ayush Kumar Jha
        </a>
        {' '}(IIT Madras)
      </span>
      <span className="hidden sm:inline">
        Powered by Next.js, Vercel AI SDK &amp; Supabase
      </span>
    </footer>
  )
}

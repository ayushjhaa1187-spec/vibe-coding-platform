'use client'

import { ToggleWelcome } from '@/components/modals/welcome'
import { ThemeToggle } from '@/components/theme-toggle'
import { UserMenu } from '@/components/user-menu'
import { cn } from '@/lib/utils'
import { Code2 } from 'lucide-react'

interface Props {
  className?: string
}

export function Header({ className }: Props) {
  return (
    <header
      className={cn(
        'flex items-center justify-between px-4 py-3 bg-card border-b border-border',
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Code2 className="w-5 h-5 text-primary" />
        <div className="flex flex-col">
          <span className="text-sm font-bold tracking-tight text-foreground leading-none">
            Vibe <span className="text-primary">Code</span>
          </span>
          <span className="text-[9px] font-mono text-muted-foreground tracking-wider uppercase mt-0.5">
            AI Coding Platform
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 ml-auto">
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          <span className="text-[10px] font-mono font-medium text-primary uppercase tracking-wide">
            Online
          </span>
        </div>
        <ThemeToggle />
        <ToggleWelcome />
        <UserMenu />
      </div>
    </header>
  )
}

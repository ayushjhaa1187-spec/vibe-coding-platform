import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface Props {
  className?: string
  children: ReactNode
}

export function Panel({ className, children }: Props) {
  return (
    <div
      className={cn(
        'flex flex-col relative border border-border w-full h-full shadow-sm rounded-lg',
        className
      )}
    >
      {children}
    </div>
  )
}

export function PanelHeader({ className, children }: Props) {
  return (
    <div
      className={cn(
        'text-sm flex items-center border-b border-border px-3 py-2 text-foreground bg-card',
        className
      )}
    >
      {children}
    </div>
  )
}

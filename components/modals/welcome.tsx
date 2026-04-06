'use client'

import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { InfoIcon, Code2, Cpu, Globe, Zap } from 'lucide-react'
import { create } from 'zustand'
import { useEffect } from 'react'

interface State {
  open: boolean | undefined
  setOpen: (open: boolean) => void
}

export const useWelcomeStore = create<State>((set) => ({
  open: undefined,
  setOpen: (open) => set({ open }),
}))

export function Welcome(props: {
  onDismissAction(): void
  defaultOpen: boolean
}) {
  const { open, setOpen } = useWelcomeStore()

  useEffect(() => {
    setOpen(props.defaultOpen)
  }, [setOpen, props.defaultOpen])

  if (!(typeof open === 'undefined' ? props.defaultOpen : open)) {
    return null
  }

  const handleDismiss = () => {
    props.onDismissAction()
    setOpen(false)
  }

  return (
    <div className="fixed w-screen h-screen z-10 flex items-center justify-center p-4">
      <div className="absolute w-full h-full bg-background/80 backdrop-blur-sm transition-all duration-300" onClick={handleDismiss} />

      <div
        className="relative w-full max-w-xl bg-card border border-border shadow-xl rounded-xl overflow-hidden animate-in fade-in zoom-in-95 duration-300"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="p-8 space-y-6">
          <div className="p-3 w-fit rounded-lg bg-primary/10">
            <Code2 className="text-primary w-6 h-6" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Vibe <span className="text-primary">Code</span>
          </h1>

          <div className="space-y-4">
            <p className="text-base text-foreground leading-relaxed">
              Welcome to the AI-powered coding platform.
            </p>
            <p className="text-sm text-muted-foreground leading-6">
              Describe what you want to build, and the AI will generate production-ready
              code with live preview in an isolated sandbox.
            </p>

            <div className="pt-4 border-t border-border space-y-3">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
                Key Features
              </p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Isolated Sandbox', icon: Globe },
                  { label: 'Multi-Model AI', icon: Cpu },
                  { label: 'Live Preview', icon: Zap },
                  { label: 'Code Editor', icon: Code2 },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center gap-2 p-2.5 rounded-lg bg-secondary border border-border"
                  >
                    <item.icon className="w-4 h-4 text-primary" />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-secondary/50 px-8 py-4 border-t border-border flex justify-between items-center">
          <span className="text-xs text-muted-foreground">
            Built by Ayush Kumar Jha
          </span>
          <Button
            className="px-6"
            onClick={handleDismiss}
          >
            Get Started
          </Button>
        </footer>
      </div>
    </div>
  )
}

export function ToggleWelcome() {
  const { open, setOpen } = useWelcomeStore()
  return (
    <Button
      className="cursor-pointer"
      onClick={() => setOpen(!open)}
      variant="outline"
      size="sm"
    >
      <InfoIcon /> <span className="hidden lg:inline">About</span>
    </Button>
  )
}

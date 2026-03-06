import React from "react"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs))
}

type Props = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  hint?: string
  error?: string
  rightSlot?: React.ReactNode
}

export default function Input({ label, hint, error, rightSlot, className, ...props }: Props) {
  return (
    <div className="w-full">
      {label ? <label className="mb-2 block text-xs font-semibold tracking-wide text-muted">{label}</label> : null}

      <div
        className={cn(
          "group relative flex h-14 items-center overflow-hidden rounded-[22px] border bg-surface text-foreground transition-all",
          error ? "border-danger/70 shadow-[0_0_0_2px_rgba(255,77,79,0.12)]" : "border-border hover:border-white/15 focus-within:border-ring/70 focus-within:shadow-[0_0_0_2px_rgba(122,162,255,0.18)]"
        )}
      >
        <input
          {...props}
          className={cn(
            "h-full w-full bg-transparent px-4 text-sm text-foreground outline-none placeholder:text-muted/55",
            rightSlot ? "pr-12" : "",
            className
          )}
        />
        {rightSlot ? <div className="absolute right-3 inline-flex items-center justify-center">{rightSlot}</div> : null}
      </div>

      {error ? (
        <div className="mt-2 text-xs font-medium text-danger">{error}</div>
      ) : hint ? (
        <div className="mt-2 text-xs leading-relaxed text-muted">{hint}</div>
      ) : null}
    </div>
  )
}
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
      {label ? <div className="mb-2 text-xs font-semibold text-muted">{label}</div> : null}

      <div className={cn("relative", rightSlot ? "flex items-center" : "")}>
        <input
          className={cn(
            "h-12 w-full rounded-2xl border border-border bg-surfaceElev px-4 text-sm text-foreground outline-none transition-all placeholder:text-muted/60 focus-visible:ring-2 focus-visible:ring-ring/30",
            rightSlot ? "pr-12" : "",
            error ? "ring-2 ring-danger/25" : "",
            className
          )}
          {...props}
        />
        {rightSlot ? <div className="absolute right-2 inline-flex items-center justify-center">{rightSlot}</div> : null}
      </div>

      {error ? (
        <div className="mt-2 text-xs font-semibold text-danger">{error}</div>
      ) : hint ? (
        <div className="mt-2 text-xs text-muted">{hint}</div>
      ) : null}
    </div>
  )
}
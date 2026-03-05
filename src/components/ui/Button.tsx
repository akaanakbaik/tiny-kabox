import React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "@radix-ui/react-slot"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 rounded-2xl border border-border bg-surfaceElev px-4 py-3 text-sm font-semibold text-foreground shadow-soft transition-all hover:bg-surfaceElev2 active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        md: "h-12",
        sm: "h-10 px-3 py-2 text-sm",
        xs: "h-9 px-3 py-2 text-xs"
      },
      tone: {
        neutral: "",
        danger: "border-border bg-surfaceElev text-foreground hover:bg-surfaceElev2"
      }
    },
    defaultVariants: {
      size: "md",
      tone: "neutral"
    }
  }
)

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
  }

export default function Button({ className, size, tone, asChild, leftIcon, rightIcon, children, ...props }: Props) {
  const Comp = asChild ? Slot : "button"
  return (
    <Comp className={cn(buttonVariants({ size, tone }), className)} {...props}>
      {leftIcon ? <span className="inline-flex">{leftIcon}</span> : null}
      <span className="inline-flex items-center">{children}</span>
      {rightIcon ? <span className="inline-flex">{rightIcon}</span> : null}
    </Comp>
  )
}
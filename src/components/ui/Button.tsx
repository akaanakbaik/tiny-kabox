import React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

function cn(...inputs: Array<string | undefined | null | false>) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  "inline-flex select-none items-center justify-center gap-2 rounded-2xl border font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "border-border bg-foreground text-surface hover:opacity-90 active:scale-[0.99] shadow-soft",
        secondary:
          "border-border bg-surfaceElev text-foreground hover:bg-surfaceElev2 active:scale-[0.99] shadow-soft",
        ghost:
          "border-transparent bg-transparent text-foreground hover:bg-surfaceElev/70 active:scale-[0.99]",
        danger:
          "border-border bg-danger/10 text-danger hover:bg-danger/15 active:scale-[0.99]"
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-5 text-sm",
        lg: "h-14 px-6 text-base"
      },
      block: {
        true: "w-full",
        false: ""
      }
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
      block: false
    }
  }
)

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
  }

export default function Button({
  asChild,
  className,
  variant,
  size,
  block,
  leftIcon,
  rightIcon,
  children,
  ...props
}: Props) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp className={cn(buttonVariants({ variant, size, block }), className)} {...props}>
      {leftIcon ? <span className="inline-flex shrink-0">{leftIcon}</span> : null}
      <span className="truncate">{children}</span>
      {rightIcon ? <span className="inline-flex shrink-0">{rightIcon}</span> : null}
    </Comp>
  )
}
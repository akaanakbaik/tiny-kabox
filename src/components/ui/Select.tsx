import React from "react"
import * as Select from "@radix-ui/react-select"
import { AnimatePresence, motion } from "framer-motion"
import { Check, ChevronDown } from "lucide-react"

export type SelectItem = {
  value: string
  label: string
  description?: string
}

type Props = {
  label?: string
  hint?: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  items: SelectItem[]
}

export default function SelectBox({ label, hint, value, onChange, placeholder, items }: Props) {
  return (
    <div className="w-full">
      {label ? <div className="mb-2 text-xs font-semibold text-muted">{label}</div> : null}

      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger className="inline-flex h-12 w-full items-center justify-between rounded-2xl border border-border bg-surfaceElev px-4 text-sm font-semibold text-foreground shadow-soft transition-all hover:bg-surfaceElev2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60">
          <Select.Value placeholder={placeholder || "Select"} />
          <Select.Icon>
            <ChevronDown className="h-4 w-4 text-muted" />
          </Select.Icon>
        </Select.Trigger>

        <AnimatePresence>
          <Select.Portal>
            <Select.Content asChild position="popper" sideOffset={10}>
              <motion.div
                initial={{ opacity: 0, y: 8, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.99 }}
                transition={{ duration: 0.16 }}
                className="z-[80] w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-border bg-surface shadow-2xl"
              >
                <Select.Viewport className="p-2">
                  {items.map((it) => (
                    <Select.Item
                      key={it.value}
                      value={it.value}
                      className="relative flex cursor-pointer select-none items-start gap-3 rounded-xl border border-transparent px-3 py-2 outline-none transition-all focus:border-border focus:bg-surfaceElev data-[state=checked]:bg-surfaceElev"
                    >
                      <div className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-surfaceElev">
                        <Select.ItemIndicator>
                          <Check className="h-4 w-4 text-ok" />
                        </Select.ItemIndicator>
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <Select.ItemText>
                          <div className="text-sm font-semibold">{it.label}</div>
                        </Select.ItemText>
                        {it.description ? <div className="text-xs text-muted">{it.description}</div> : null}
                      </div>
                    </Select.Item>
                  ))}
                </Select.Viewport>
              </motion.div>
            </Select.Content>
          </Select.Portal>
        </AnimatePresence>
      </Select.Root>

      {hint ? <div className="mt-2 text-xs text-muted">{hint}</div> : null}
    </div>
  )
}
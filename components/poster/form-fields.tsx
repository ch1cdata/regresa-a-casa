"use client"

import type React from "react"
import { useId } from "react"
import { AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

export type Errors = Partial<Record<string, string>>

const controlBase =
  "w-full rounded-lg border bg-card px-3.5 py-3 text-base text-foreground shadow-xs outline-none transition placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/30"

export function controlClass(invalid?: boolean) {
  return cn(controlBase, invalid ? "border-destructive ring-3 ring-destructive/15" : "border-input")
}

interface FieldProps {
  label: string
  required?: boolean
  error?: string
  hint?: React.ReactNode
  className?: string
  children: (props: { id: string; "aria-invalid": boolean; "aria-describedby"?: string }) => React.ReactNode
}

export function Field({ label, required, error, hint, className, children }: FieldProps) {
  const id = useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(" ") || undefined
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold">
        {label}
        {required ? (
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
        ) : (
          <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
        )}
        {required && <span className="sr-only">(obligatorio)</span>}
      </label>
      {children({ id, "aria-invalid": Boolean(error), "aria-describedby": describedBy })}
      {hint && !error && (
        <p id={hintId} className="text-xs leading-relaxed text-muted-foreground">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="flex items-center gap-1.5 text-sm font-medium text-destructive" role="alert">
          <AlertCircle className="size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  )
}

export function StepHeading({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <header className="flex flex-col gap-1">
      <p className="text-xs font-bold uppercase tracking-widest text-accent-foreground/70">Paso {step} de 5</p>
      <h2 className="text-balance text-2xl font-extrabold tracking-tight">{title}</h2>
      <p className="text-pretty text-sm leading-relaxed text-muted-foreground">{description}</p>
    </header>
  )
}

export function ChoiceChip({
  selected,
  onClick,
  children,
  invalid,
}: {
  selected: boolean
  onClick: () => void
  children: React.ReactNode
  invalid?: boolean
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onClick}
      className={cn(
        "min-h-12 rounded-lg border-2 px-4 py-2.5 text-base font-semibold transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
        selected
          ? "border-primary bg-primary/15 text-foreground"
          : invalid
            ? "border-destructive/60 bg-card hover:border-primary/60"
            : "border-border bg-card hover:border-primary/60",
      )}
    >
      {children}
    </button>
  )
}

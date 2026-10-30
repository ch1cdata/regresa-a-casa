"use client"

import { Check, FileText, Image as ImageIcon } from "lucide-react"
import { type Errors, StepHeading } from "./form-fields"
import { FORMATS, type FormatId, type PosterData, type PrintMode } from "@/lib/poster/types"
import { cn } from "@/lib/utils"

interface StepProps {
  data: PosterData
  update: (patch: Partial<PosterData>) => void
  errors: Errors
}

const PRINT_MODES: { id: PrintMode; label: string; description: string }[] = [
  { id: "color", label: "A color", description: "Respeta la gama elegida" },
  { id: "bn", label: "Blanco y negro", description: "Más económico de imprimir" },
]

export function StepExport({ data, update, errors }: StepProps) {
  function toggle(id: FormatId) {
    update({ formats: { ...data.formats, [id]: !data.formats[id] } })
  }

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={5}
        title="Descarga tu cartel"
        description="Elige uno o varios formatos. Todos se descargarán a la vez, listos para imprimir y compartir."
      />

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 flex items-center gap-2 text-sm font-semibold">
          Formatos
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
          <span className="text-xs font-normal text-muted-foreground">Puedes elegir varios</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(FORMATS) as FormatId[]).map((id) => {
            const f = FORMATS[id]
            const checked = data.formats[id]
            const Icon = f.kind === "pdf" ? FileText : ImageIcon
            return (
              <label
                key={id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-xl border-2 bg-card p-3.5 transition has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-primary/40",
                  checked ? "border-primary bg-primary/10" : errors.formats ? "border-destructive/60" : "border-border hover:border-primary/60",
                )}
              >
                <input type="checkbox" className="sr-only" checked={checked} onChange={() => toggle(id)} />
                <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted" aria-hidden="true">
                  <Icon className="size-5" />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-bold">{f.label}</span>
                  <span className="text-xs text-muted-foreground">{f.detail}</span>
                </span>
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-md border-2",
                    checked ? "border-primary bg-primary text-primary-foreground" : "border-input",
                  )}
                  aria-hidden="true"
                >
                  {checked && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </label>
            )
          })}
        </div>
        {errors.formats && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {errors.formats}
          </p>
        )}
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold">Optimizar impresión (PDF)</legend>
        <div role="radiogroup" aria-label="Optimizar impresión" className="grid grid-cols-2 gap-3">
          {PRINT_MODES.map((m) => {
            const selected = data.printMode === m.id
            return (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update({ printMode: m.id })}
                className={cn(
                  "flex flex-col items-start rounded-xl border-2 bg-card p-3.5 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
                  selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/60",
                )}
              >
                <span className="text-sm font-bold">{m.label}</span>
                <span className="text-xs text-muted-foreground">{m.description}</span>
              </button>
            )
          })}
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Las imágenes para redes sociales siempre se generan a color.
        </p>
      </fieldset>
    </div>
  )
}

"use client"

import { Check } from "lucide-react"
import { type Errors, Field, StepHeading, controlClass } from "./form-fields"
import { CUSTOM, FOOTER_PRESETS, HEADER_PRESETS, PALETTES, type PaletteId, type PosterData, wordCount } from "@/lib/poster/types"
import { cn } from "@/lib/utils"

interface StepProps {
  data: PosterData
  update: (patch: Partial<PosterData>) => void
  errors: Errors
}

export function StepDesign({ data, update, errors }: StepProps) {
  const headerWords = wordCount(data.headerCustom)
  const footerWords = wordCount(data.footerCustom)

  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={4}
        title="Personaliza tu cartel"
        description="Elige el mensaje principal, el pie de página y la gama de colores. Verás el resultado al instante."
      />

      <div className="flex flex-col gap-3">
        <Field label="Encabezado" required>
          {(p) => (
            <select {...p} className={controlClass()} value={data.headerPreset} onChange={(e) => update({ headerPreset: e.target.value })}>
              {HEADER_PRESETS.map((h) => (
                <option key={h} value={h}>
                  {h}
                </option>
              ))}
              <option value={CUSTOM}>Escribir mi propio texto…</option>
            </select>
          )}
        </Field>
        {data.headerPreset === CUSTOM && (
          <Field
            label="Tu encabezado"
            required
            error={errors.headerCustom}
            hint={`${headerWords} de 5 palabras máximo`}
          >
            {(p) => (
              <input
                {...p}
                className={controlClass(!!errors.headerCustom)}
                value={data.headerCustom}
                onChange={(e) => update({ headerCustom: e.target.value })}
                placeholder="Ej. AYÚDANOS A ENCONTRAR A LUNA"
                maxLength={40}
                autoFocus
              />
            )}
          </Field>
        )}
      </div>

      <div className="flex flex-col gap-3">
        <Field label="Pie de página" required>
          {(p) => (
            <select {...p} className={controlClass()} value={data.footerPreset} onChange={(e) => update({ footerPreset: e.target.value })}>
              {FOOTER_PRESETS.map((f) => (
                <option key={f} value={f}>
                  {f}
                </option>
              ))}
              <option value={CUSTOM}>Escribir mi propio texto…</option>
            </select>
          )}
        </Field>
        {data.footerPreset === CUSTOM && (
          <Field
            label="Tu pie de página"
            required
            error={errors.footerCustom}
            hint={`${footerWords} de 10 palabras máximo`}
          >
            {(p) => (
              <input
                {...p}
                className={controlClass(!!errors.footerCustom)}
                value={data.footerCustom}
                onChange={(e) => update({ footerCustom: e.target.value })}
                placeholder="Ej. ES MUY TÍMIDA, LLÁMANOS"
                maxLength={70}
                autoFocus
              />
            )}
          </Field>
        )}
      </div>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-1 text-sm font-semibold">Gama de colores del cartel</legend>
        <div role="radiogroup" aria-label="Gama de colores" className="grid gap-3 sm:grid-cols-2">
          {(Object.keys(PALETTES) as PaletteId[]).map((id) => {
            const p = PALETTES[id]
            const selected = data.palette === id
            return (
              <button
                key={id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => update({ palette: id })}
                className={cn(
                  "flex items-center gap-3 rounded-xl border-2 bg-card p-3 text-left transition focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
                  selected ? "border-primary bg-primary/10" : "border-border hover:border-primary/60",
                )}
              >
                <span className="flex h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-black/10" aria-hidden="true">
                  <span className="h-full w-2/3" style={{ backgroundColor: p.primary }} />
                  <span className="h-full w-1/3" style={{ backgroundColor: p.secondary }} />
                </span>
                <span className="flex min-w-0 flex-1 flex-col">
                  <span className="text-sm font-bold">{p.label}</span>
                  <span className="text-xs text-muted-foreground">{p.description}</span>
                </span>
                <span
                  className={cn(
                    "flex size-6 shrink-0 items-center justify-center rounded-full border-2",
                    selected ? "border-primary bg-primary text-primary-foreground" : "border-input",
                  )}
                  aria-hidden="true"
                >
                  {selected && <Check className="size-3.5" strokeWidth={3} />}
                </span>
              </button>
            )
          })}
        </div>
      </fieldset>
    </div>
  )
}

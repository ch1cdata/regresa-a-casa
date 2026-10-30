"use client"

import { type Errors, Field, StepHeading, controlClass } from "./form-fields"
import { type PosterData, formatDate } from "@/lib/poster/types"

interface StepProps {
  data: PosterData
  update: (patch: Partial<PosterData>) => void
  errors: Errors
}

const onlyDigits = (v: string) => v.replace(/\D/g, "").slice(0, 10)

export function StepLocation({ data, update, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={2}
        title="¿Dónde y cuándo se perdió?"
        description="El lugar es clave: los vecinos de la zona son quienes más pueden ayudarte."
      />

      <section aria-labelledby="lugar-title" className="flex flex-col gap-4">
        <h3 id="lugar-title" className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Lugar
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Colonia" required error={errors.colonia}>
            {(p) => (
              <input
                {...p}
                className={controlClass(!!errors.colonia)}
                value={data.colonia}
                onChange={(e) => update({ colonia: e.target.value })}
                placeholder="Ej. Col. Roma Norte"
                maxLength={50}
              />
            )}
          </Field>
          <Field label="Municipio" required error={errors.municipio}>
            {(p) => (
              <input
                {...p}
                className={controlClass(!!errors.municipio)}
                value={data.municipio}
                onChange={(e) => update({ municipio: e.target.value })}
                placeholder="Ej. Cuauhtémoc"
                maxLength={50}
              />
            )}
          </Field>
          <Field label="Calle">
            {(p) => (
              <input
                {...p}
                className={controlClass()}
                value={data.calle}
                onChange={(e) => update({ calle: e.target.value })}
                placeholder="Ej. Calle Orizaba"
                maxLength={50}
              />
            )}
          </Field>
          <Field label="Visto por última vez">
            {(p) => (
              <input
                {...p}
                className={controlClass()}
                value={data.lastSeen}
                onChange={(e) => update({ lastSeen: e.target.value })}
                placeholder="Ej. Cerca del parque, 8 pm"
                maxLength={60}
              />
            )}
          </Field>
        </div>
      </section>

      <section aria-labelledby="fecha-title" className="flex flex-col gap-4">
        <h3 id="fecha-title" className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Fecha
        </h3>
        <div className="grid items-start gap-5 sm:grid-cols-2">
          <Field
            label="Fecha de desaparición"
            required
            error={errors.date}
            hint={data.date ? `En el cartel: ${formatDate(data.date, data.includeYear)}` : undefined}
          >
            {(p) => (
              <input
                {...p}
                type="date"
                className={controlClass(!!errors.date)}
                value={data.date}
                onChange={(e) => update({ date: e.target.value })}
              />
            )}
          </Field>
          <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-border bg-card px-3.5 py-3 sm:mt-7">
            <input
              type="checkbox"
              className="size-5 accent-[#52B788]"
              checked={data.includeYear}
              onChange={(e) => update({ includeYear: e.target.checked })}
            />
            <span className="text-sm font-medium">Incluir año en la fecha</span>
          </label>
        </div>
      </section>

      <section aria-labelledby="tutor-title" className="flex flex-col gap-4">
        <h3 id="tutor-title" className="text-sm font-bold uppercase tracking-wide text-muted-foreground">
          Contacto del tutor
        </h3>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Teléfono principal" required error={errors.phone} hint="10 dígitos, sin espacios.">
            {(p) => (
              <input
                {...p}
                type="tel"
                inputMode="numeric"
                autoComplete="tel-national"
                className={controlClass(!!errors.phone)}
                value={data.phone}
                onChange={(e) => update({ phone: onlyDigits(e.target.value) })}
                placeholder="5512345678"
              />
            )}
          </Field>
          <Field label="Teléfono de respaldo" error={errors.phoneBackup}>
            {(p) => (
              <input
                {...p}
                type="tel"
                inputMode="numeric"
                className={controlClass(!!errors.phoneBackup)}
                value={data.phoneBackup}
                onChange={(e) => update({ phoneBackup: onlyDigits(e.target.value) })}
                placeholder="5587654321"
              />
            )}
          </Field>
          <Field label="Nombre del tutor" className="sm:col-span-2">
            {(p) => (
              <input
                {...p}
                autoComplete="given-name"
                className={controlClass()}
                value={data.tutorName}
                onChange={(e) => update({ tutorName: e.target.value })}
                placeholder="Ej. Ana"
                maxLength={30}
              />
            )}
          </Field>
        </div>
      </section>
    </div>
  )
}

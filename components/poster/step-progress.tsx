import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

export const STEP_LABELS = ["Mascota", "Lugar y contacto", "Fotos", "Diseño", "Descargar"]

export function StepProgress({ current }: { current: number }) {
  const pct = ((current - 1) / (STEP_LABELS.length - 1)) * 100
  return (
    <nav aria-label="Progreso" className="flex flex-col gap-3">
      <div className="flex items-baseline justify-between text-sm">
        <span className="font-bold">{STEP_LABELS[current - 1]}</span>
        <span className="tabular-nums text-muted-foreground">
          Paso {current} de {STEP_LABELS.length}
        </span>
      </div>
      <div
        className="relative h-2.5 overflow-hidden rounded-full bg-[#E9ECEF]"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={STEP_LABELS.length}
        aria-valuenow={current}
        aria-label={`Paso ${current} de ${STEP_LABELS.length}`}
      >
        <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out" style={{ width: `${Math.max(pct, 6)}%` }} />
      </div>
      <ol className="hidden grid-cols-5 gap-2 sm:grid">
        {STEP_LABELS.map((label, i) => {
          const n = i + 1
          const done = n < current
          const active = n === current
          return (
            <li key={label} className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
              <span
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  done && "bg-accent text-accent-foreground",
                  active && "bg-foreground text-background",
                  !done && !active && "bg-[#E9ECEF] text-muted-foreground",
                )}
              >
                {done ? <Check className="size-3.5" strokeWidth={3} aria-hidden="true" /> : n}
              </span>
              <span className={cn("truncate text-xs font-medium", active ? "text-foreground" : "text-muted-foreground")}>{label}</span>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

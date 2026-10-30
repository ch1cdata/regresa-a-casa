import { CheckCircle2, Circle, ShieldCheck } from "lucide-react"
import { type PosterData, formatDate, formatPhone, locationText, posterTitle } from "@/lib/poster/types"
import { cn } from "@/lib/utils"

export function SummaryPanel({ data }: { data: PosterData }) {
  const title = posterTitle(data)
  const rows = [
    { label: "Nombre", value: data.name.trim() },
    { label: "Así se verá el título", value: data.type && data.color.trim() ? title : "" },
    { label: "Seña particular", value: data.feature.trim() },
    { label: "Lugar", value: data.colonia.trim() && data.municipio.trim() ? locationText(data) : "" },
    { label: "Fecha", value: formatDate(data.date, data.includeYear) },
    { label: "Teléfono", value: data.phone.length === 10 ? formatPhone(data.phone) : "" },
    {
      label: "Fotos",
      value: data.mainPhoto ? (data.secondaryPhoto ? "Principal y secundaria" : "Principal") : "",
    },
  ]
  const done = rows.filter((r) => r.value).length

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Resumen</p>
        <h2 className="text-lg font-extrabold">Tu cartel va tomando forma</h2>
        <p className="text-sm text-muted-foreground">
          {done} de {rows.length} datos listos. La vista previa aparece en el paso 4.
        </p>
      </div>

      {title && data.type && data.color.trim() && (
        <div className="overflow-hidden rounded-xl border border-border bg-card">
          <div className="bg-[#E63946] px-4 py-2 text-center font-display text-xl tracking-wide text-white">¡SE BUSCA!</div>
          <p className="text-balance px-4 py-4 text-center font-display text-4xl uppercase leading-none tracking-wide text-[#E63946]">
            {title}
          </p>
        </div>
      )}

      <ul className="flex flex-col divide-y divide-border rounded-xl border border-border bg-card">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-3 px-4 py-3">
            {r.value ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-[#2D8A5F]" aria-hidden="true" />
            ) : (
              <Circle className="mt-0.5 size-4 shrink-0 text-input" aria-hidden="true" />
            )}
            <div className="flex min-w-0 flex-col">
              <span className="text-xs font-medium text-muted-foreground">{r.label}</span>
              <span className={cn("truncate text-sm font-semibold", !r.value && "font-normal text-muted-foreground/70")}>
                {r.value || "Pendiente"}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <p className="flex items-start gap-2 text-xs leading-relaxed text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-[#2D8A5F]" aria-hidden="true" />
        Todo se procesa en tu teléfono o computadora. No guardamos tus datos ni tus fotos.
      </p>
    </div>
  )
}

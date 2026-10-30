"use client"

import { useEffect, useRef, useState } from "react"
import { ensureFontsLoaded, getPosterFonts, renderPoster } from "@/lib/poster/render"
import { FORMATS, type FormatId, type PosterData } from "@/lib/poster/types"
import { cn } from "@/lib/utils"

const PREVIEW_WIDTH = 760

const TABS: { id: FormatId; label: string }[] = [
  { id: "carta", label: "Carta" },
  { id: "tabloide", label: "Tabloide" },
  { id: "facebook", label: "Facebook" },
  { id: "historia", label: "Historia" },
]

export function PosterPreview({ data, mono }: { data: PosterData; mono?: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [format, setFormat] = useState<FormatId>("carta")
  const spec = FORMATS[format]
  const height = Math.round((PREVIEW_WIDTH * spec.height) / spec.width)
  const grayscale = mono && spec.kind === "pdf"

  useEffect(() => {
    let cancelled = false
    const fonts = getPosterFonts()
    ensureFontsLoaded(fonts).then(() => {
      if (cancelled || !canvasRef.current) return
      renderPoster(canvasRef.current, data, PREVIEW_WIDTH, height, { fonts, grayscale, forceMono: grayscale })
    })
    return () => {
      cancelled = true
    }
  }, [data, height, grayscale])

  return (
    <div className="flex flex-col gap-3">
      <div role="tablist" aria-label="Formato de vista previa" className="grid grid-cols-4 gap-1 rounded-lg bg-muted p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={format === t.id}
            onClick={() => setFormat(t.id)}
            className={cn(
              "rounded-md px-2 py-1.5 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50",
              format === t.id ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="flex justify-center rounded-xl bg-[#E9ECEF] p-3 sm:p-5">
        <canvas
          ref={canvasRef}
          width={PREVIEW_WIDTH}
          height={height}
          className="h-auto max-h-[72vh] w-auto max-w-full rounded-sm bg-white shadow-lg ring-1 ring-black/5 sm:max-w-md lg:max-w-full"
          role="img"
          aria-label={`Vista previa del cartel en formato ${spec.label}`}
        />
      </div>
    </div>
  )
}

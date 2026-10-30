"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { ImagePlus, Move, RotateCcw, Trash2, ZoomIn } from "lucide-react"
import { drawCover } from "@/lib/poster/render"
import type { PhotoState } from "@/lib/poster/types"
import { cn } from "@/lib/utils"

interface PhotoCropperProps {
  title: string
  required?: boolean
  hint: string
  photo: PhotoState | null
  onChange: (photo: PhotoState | null) => void
  aspect: number
  error?: string
}

function loadImage(file: File): Promise<PhotoState> {
  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => resolve({ src, img, zoom: 1, x: 0, y: 0 })
    img.onerror = () => reject(new Error("No pudimos leer esa imagen. Prueba con un JPG o PNG."))
    img.src = src
  })
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

export function PhotoCropper({ title, required, hint, photo, onChange, aspect, error }: PhotoCropperProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dragRef = useRef<{ startX: number; startY: number; x: number; y: number } | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !photo) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = Math.round(rect.width * dpr)
    canvas.height = Math.round(rect.height * dpr)
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    drawCover(ctx, photo, 0, 0, canvas.width, canvas.height)
  }, [photo])

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return
    try {
      setLoadError(null)
      if (photo) URL.revokeObjectURL(photo.src)
      onChange(await loadImage(file))
    } catch (err) {
      setLoadError((err as Error).message)
    }
  }

  function overflow(canvas: HTMLCanvasElement, p: PhotoState) {
    const rect = canvas.getBoundingClientRect()
    const scale = Math.max(rect.width / p.img.naturalWidth, rect.height / p.img.naturalHeight) * p.zoom
    return {
      ox: (p.img.naturalWidth * scale - rect.width) / 2,
      oy: (p.img.naturalHeight * scale - rect.height) / 2,
    }
  }

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!photo) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = { startX: e.clientX, startY: e.clientY, x: photo.x, y: photo.y }
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const drag = dragRef.current
    if (!drag || !photo || !canvasRef.current) return
    const { ox, oy } = overflow(canvasRef.current, photo)
    const dx = e.clientX - drag.startX
    const dy = e.clientY - drag.startY
    onChange({
      ...photo,
      x: ox > 0 ? clamp(drag.x - dx / ox, -1, 1) : 0,
      y: oy > 0 ? clamp(drag.y - dy / oy, -1, 1) : 0,
    })
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLCanvasElement>) {
    if (!photo) return
    const step = 0.08
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [step, 0],
      ArrowRight: [-step, 0],
      ArrowUp: [0, step],
      ArrowDown: [0, -step],
    }
    const m = moves[e.key]
    if (!m) return
    e.preventDefault()
    onChange({ ...photo, x: clamp(photo.x + m[0], -1, 1), y: clamp(photo.y + m[1], -1, 1) })
  }

  const shownError = error || loadError

  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <div className="flex flex-col gap-0.5">
        <h3 className="flex items-center gap-2 text-sm font-semibold">
          {title}
          {required ? (
            <>
              <span className="text-destructive" aria-hidden="true">
                *
              </span>
              <span className="sr-only">(obligatorio)</span>
            </>
          ) : (
            <span className="text-xs font-normal text-muted-foreground">(opcional)</span>
          )}
        </h3>
        <p className="text-pretty text-xs leading-relaxed text-muted-foreground">{hint}</p>
      </div>

      <input ref={inputRef} type="file" accept="image/*" className="sr-only" onChange={handleFile} tabIndex={-1} aria-hidden="true" />

      {photo ? (
        <div className="flex flex-col gap-3">
          <div className="relative overflow-hidden rounded-xl border border-border bg-muted" style={{ aspectRatio: aspect }}>
            <canvas
              ref={canvasRef}
              className="size-full cursor-grab touch-none select-none active:cursor-grabbing focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/50"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={() => (dragRef.current = null)}
              onPointerCancel={() => (dragRef.current = null)}
              onKeyDown={onKeyDown}
              tabIndex={0}
              role="img"
              aria-label={`${title}: arrastra o usa las flechas para encuadrar`}
            />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-center gap-1.5 bg-gradient-to-t from-black/60 to-transparent px-3 pb-2 pt-6 text-xs font-medium text-white">
              <Move className="size-3.5" aria-hidden="true" />
              Arrastra para encuadrar
            </div>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <ZoomIn className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <span className="sr-only">Zoom</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.01}
              value={photo.zoom}
              onChange={(e) => onChange({ ...photo, zoom: Number(e.target.value) })}
              className="h-2 w-full accent-[#52B788]"
              aria-label="Zoom"
            />
            <span className="w-10 text-right tabular-nums text-muted-foreground">{photo.zoom.toFixed(1)}x</span>
          </label>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} className={secondaryBtn}>
              <ImagePlus className="size-4" aria-hidden="true" />
              Cambiar foto
            </button>
            <button type="button" onClick={() => onChange({ ...photo, zoom: 1, x: 0, y: 0 })} className={secondaryBtn}>
              <RotateCcw className="size-4" aria-hidden="true" />
              Restablecer
            </button>
            <button
              type="button"
              onClick={() => {
                URL.revokeObjectURL(photo.src)
                onChange(null)
              }}
              className={cn(secondaryBtn, "text-destructive hover:border-destructive/50")}
            >
              <Trash2 className="size-4" aria-hidden="true" />
              Quitar
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed bg-card px-4 py-10 text-center transition hover:border-primary hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40",
            shownError ? "border-destructive" : "border-input",
          )}
          style={{ aspectRatio: aspect }}
        >
          <span className="flex size-12 items-center justify-center rounded-full bg-primary/15 text-primary-foreground">
            <ImagePlus className="size-6" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold">Subir foto</span>
          <span className="text-xs text-muted-foreground">Toca para elegir de tu galería o tomar una foto</span>
        </button>
      )}

      {shownError && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {shownError}
        </p>
      )}
    </section>
  )
}

const secondaryBtn =
  "inline-flex min-h-10 items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40"

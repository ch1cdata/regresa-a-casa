"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, PawPrint, Printer } from "lucide-react"
import type { Errors } from "./form-fields"
import { PosterPreview } from "./poster-preview"
import { StepDesign } from "./step-design"
import { StepExport } from "./step-export"
import { StepLocation } from "./step-location"
import { StepPet } from "./step-pet"
import { StepPhotos } from "./step-photos"
import { StepProgress } from "./step-progress"
import { SummaryPanel } from "./summary-panel"
import { exportFormats } from "@/lib/poster/export"
import { CUSTOM, type FormatId, type PosterData, wordCount } from "@/lib/poster/types"

const INITIAL: PosterData = {
  name: "",
  alias: "",
  type: "",
  otherType: "",
  color: "",
  breed: "",
  gender: "",
  age: "",
  feature: "",
  colonia: "",
  municipio: "",
  calle: "",
  lastSeen: "",
  date: "",
  includeYear: false,
  phone: "",
  phoneBackup: "",
  tutorName: "",
  mainPhoto: null,
  secondaryPhoto: null,
  headerPreset: "¡SE BUSCA!",
  headerCustom: "",
  footerPreset: "RECOMPENSA",
  footerCustom: "",
  palette: "clasica",
  formats: { carta: true, tabloide: false, facebook: true, historia: false },
  printMode: "color",
}

const REQUIRED = "Este dato es obligatorio"

function validate(step: number, d: PosterData): Errors {
  const e: Errors = {}
  if (step === 1) {
    if (!d.name.trim()) e.name = REQUIRED
    if (!d.type) e.type = "Elige el tipo de mascota"
    if (d.type === "Otro" && !d.otherType.trim()) e.otherType = "Escribe qué animal es"
    if (!d.color.trim()) e.color = REQUIRED
    if (!d.feature.trim()) e.feature = "Describe al menos una seña que la distinga"
  }
  if (step === 2) {
    if (!d.colonia.trim()) e.colonia = REQUIRED
    if (!d.municipio.trim()) e.municipio = REQUIRED
    if (!d.date) e.date = "Elige la fecha"
    if (d.phone.length !== 10) e.phone = "El teléfono debe tener exactamente 10 dígitos"
    if (d.phoneBackup && d.phoneBackup.length !== 10) e.phoneBackup = "Debe tener 10 dígitos o dejarse vacío"
  }
  if (step === 3) {
    if (!d.mainPhoto) e.mainPhoto = "Sube la foto principal de tu mascota"
  }
  if (step === 4) {
    if (d.headerPreset === CUSTOM) {
      const n = wordCount(d.headerCustom)
      if (!n) e.headerCustom = "Escribe tu encabezado"
      else if (n > 5) e.headerCustom = `Máximo 5 palabras (llevas ${n})`
    }
    if (d.footerPreset === CUSTOM) {
      const n = wordCount(d.footerCustom)
      if (!n) e.footerCustom = "Escribe tu pie de página"
      else if (n > 10) e.footerCustom = `Máximo 10 palabras (llevas ${n})`
    }
  }
  if (step === 5) {
    if (!Object.values(d.formats).some(Boolean)) e.formats = "Elige al menos un formato"
  }
  return e
}

function todayISO() {
  const now = new Date()
  const m = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${now.getFullYear()}-${m}-${day}`
}

type Status = { kind: "idle" } | { kind: "working"; progress: number } | { kind: "done"; count: number } | { kind: "error"; message: string }

export function PosterApp() {
  const [step, setStep] = useState(1)
  const [data, setData] = useState<PosterData>(INITIAL)
  const [errors, setErrors] = useState<Errors>({})
  const [attempted, setAttempted] = useState(false)
  const [status, setStatus] = useState<Status>({ kind: "idle" })
  const formRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setData((d) => (d.date ? d : { ...d, date: todayISO() }))
  }, [])

  function update(patch: Partial<PosterData>) {
    const next = { ...data, ...patch }
    setData(next)
    if (attempted) setErrors(validate(step, next))
    if (status.kind !== "working") setStatus({ kind: "idle" })
  }

  function goTo(n: number) {
    setStep(n)
    setErrors({})
    setAttempted(false)
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function focusFirstError() {
    requestAnimationFrame(() => {
      const el = formRef.current?.querySelector<HTMLElement>('[aria-invalid="true"], [role="alert"]')
      el?.scrollIntoView({ behavior: "smooth", block: "center" })
      if (el && el.matches("input, select, textarea")) el.focus({ preventScroll: true })
    })
  }

  async function handleNext() {
    const e = validate(step, data)
    setErrors(e)
    setAttempted(true)
    if (Object.keys(e).length) {
      focusFirstError()
      return
    }
    if (step < 5) {
      goTo(step + 1)
      return
    }
    const ids = (Object.keys(data.formats) as FormatId[]).filter((id) => data.formats[id])
    try {
      setStatus({ kind: "working", progress: 0 })
      await exportFormats(data, ids, (done, total) => setStatus({ kind: "working", progress: done / total }))
      setStatus({ kind: "done", count: ids.length })
    } catch (err) {
      setStatus({ kind: "error", message: (err as Error).message || "Algo salió mal al generar los archivos" })
    }
  }

  const showPreview = step >= 4
  const working = status.kind === "working"

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <PawPrint className="size-5" aria-hidden="true" />
            </span>
            <div className="flex flex-col leading-tight">
              <span className="text-base font-extrabold tracking-tight">Regresa a Casa</span>
              <span className="text-xs text-muted-foreground">Carteles gratis para mascotas perdidas</span>
            </div>
          </div>
          <span className="hidden rounded-full bg-primary/15 px-3 py-1 text-xs font-semibold text-[#1E6B47] sm:inline">
            Gratis · Sin registro
          </span>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-32 pt-6 sm:px-6 lg:pb-12">
        <div ref={formRef} className="scroll-mt-4">
          <StepProgress current={step} />
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-8">
          <section aria-label="Formulario" className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-7">
            <form
              noValidate
              onSubmit={(e) => {
                e.preventDefault()
                handleNext()
              }}
              className="flex flex-col gap-6"
            >
              {step === 1 && <StepPet data={data} update={update} errors={errors} />}
              {step === 2 && <StepLocation data={data} update={update} errors={errors} />}
              {step === 3 && <StepPhotos data={data} update={update} errors={errors} />}
              {step === 4 && <StepDesign data={data} update={update} errors={errors} />}
              {step === 5 && <StepExport data={data} update={update} errors={errors} />}

              {showPreview && (
                <div className="flex flex-col gap-3 lg:hidden">
                  <h3 className="text-sm font-semibold">Vista previa</h3>
                  <PosterPreview data={data} mono={step === 5 && data.printMode === "bn"} />
                </div>
              )}

              <StatusMessage status={status} />

              <div className="fixed inset-x-0 bottom-0 z-20 flex gap-3 border-t border-border bg-card/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-card/80 lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={() => goTo(step - 1)}
                    disabled={working}
                    className="inline-flex min-h-13 flex-1 items-center justify-center gap-2 rounded-xl border-2 border-primary bg-card px-5 text-base font-bold text-[#1E6B47] transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 disabled:opacity-50 sm:flex-none"
                  >
                    <ArrowLeft className="size-5" aria-hidden="true" />
                    Atrás
                  </button>
                )}
                <button
                  type="submit"
                  disabled={working}
                  className="inline-flex min-h-13 flex-[2] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-base font-bold text-primary-foreground shadow-sm transition hover:bg-[#45A578] focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-primary/40 disabled:opacity-70 sm:ml-auto sm:flex-none"
                >
                  {step < 5 ? (
                    <>
                      Siguiente
                      <ArrowRight className="size-5" aria-hidden="true" />
                    </>
                  ) : working ? (
                    <>
                      <Loader2 className="size-5 animate-spin" aria-hidden="true" />
                      Generando…
                    </>
                  ) : (
                    <>
                      <Printer className="size-5" aria-hidden="true" />
                      Generar e Imprimir
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          <aside aria-label={showPreview ? "Vista previa del cartel" : "Resumen"} className="hidden lg:sticky lg:top-6 lg:block">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              {showPreview ? (
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Vista previa</p>
                    <h2 className="text-lg font-extrabold">Así se verá tu cartel</h2>
                  </div>
                  <PosterPreview data={data} mono={step === 5 && data.printMode === "bn"} />
                </div>
              ) : (
                <SummaryPanel data={data} />
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  )
}

function StatusMessage({ status }: { status: Status }) {
  if (status.kind === "idle") return null
  if (status.kind === "working")
    return (
      <div role="status" className="flex flex-col gap-2 rounded-xl bg-muted p-4 text-sm font-medium">
        Preparando tus archivos…
        <div className="h-2 overflow-hidden rounded-full bg-card">
          <div className="h-full bg-accent transition-[width]" style={{ width: `${Math.round(status.progress * 100)}%` }} />
        </div>
      </div>
    )
  if (status.kind === "done")
    return (
      <div role="status" className="flex items-start gap-3 rounded-xl border border-primary/40 bg-primary/10 p-4 text-sm leading-relaxed">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-[#2D8A5F]" aria-hidden="true" />
        <p>
          <strong className="font-semibold">¡Listo! Se descargaron {status.count} {status.count === 1 ? "archivo" : "archivos"}.</strong>{" "}
          Imprime los PDF y compártelos en grupos vecinales. Si tu navegador pregunta, permite las descargas múltiples. Mucha suerte, ojalá regrese pronto a casa.
        </p>
      </div>
    )
  return (
    <p role="alert" className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm font-medium text-destructive">
      {status.message}
    </p>
  )
}

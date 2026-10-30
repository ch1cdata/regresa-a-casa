import { ensureFontsLoaded, getPosterFonts, renderPoster } from "./render"
import { FORMATS, type FormatId, type PosterData } from "./types"

function slug(s: string) {
  return (
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "mascota"
  )
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality?: number) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("No se pudo generar la imagen"))), type, quality)
  })
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.rel = "noopener"
  a.style.display = "none"
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 60_000)
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))

export async function buildFile(data: PosterData, id: FormatId): Promise<{ blob: Blob; filename: string }> {
  const spec = FORMATS[id]
  const fonts = getPosterFonts()
  await ensureFontsLoaded(fonts)
  const canvas = document.createElement("canvas")
  const mono = spec.kind === "pdf" && data.printMode === "bn"
  renderPoster(canvas, data, spec.width, spec.height, { fonts, grayscale: mono, forceMono: mono })
  const base = `cartel-${slug(data.name)}-${id}`

  if (spec.kind === "png") {
    return { blob: await canvasToBlob(canvas, "image/png"), filename: `${base}.png` }
  }

  const { jsPDF } = await import("jspdf")
  const format = id === "carta" ? "letter" : "tabloid"
  const [pw, ph] = id === "carta" ? [8.5, 11] : [11, 17]
  const doc = new jsPDF({ orientation: "portrait", unit: "in", format })
  const jpeg = canvas.toDataURL("image/jpeg", 0.92)
  doc.addImage(jpeg, "JPEG", 0, 0, pw, ph, undefined, "FAST")
  return { blob: doc.output("blob"), filename: `${base}.pdf` }
}

/** Builds every file first, then downloads them sequentially with a small delay so browsers don't drop any. */
export async function exportFormats(data: PosterData, ids: FormatId[], onProgress?: (done: number, total: number) => void) {
  const files: { blob: Blob; filename: string }[] = []
  for (const id of ids) {
    files.push(await buildFile(data, id))
    onProgress?.(files.length, ids.length * 2)
  }
  for (let i = 0; i < files.length; i++) {
    triggerDownload(files[i].blob, files[i].filename)
    onProgress?.(ids.length + i + 1, ids.length * 2)
    if (i < files.length - 1) await wait(700)
  }
  return files
}

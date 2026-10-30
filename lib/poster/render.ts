import {
  PALETTES,
  type Palette,
  type PhotoState,
  type PosterData,
  footerText,
  formatDate,
  formatPhone,
  headerText,
  locationText,
  posterTitle,
} from "./types"

export interface PosterFonts {
  display: string
  body: string
}

export interface RenderOptions {
  fonts: PosterFonts
  grayscale?: boolean
  forceMono?: boolean
}

type Ctx = CanvasRenderingContext2D

interface InfoItem {
  label: string
  value: string
}

function roundRect(ctx: Ctx, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.max(0, Math.min(r, w / 2, h / 2))
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

/** Draws an image filling the box without distortion (object-fit: cover) honoring zoom and pan. */
export function drawCover(ctx: Ctx, photo: PhotoState, x: number, y: number, w: number, h: number) {
  const { img, zoom, x: px, y: py } = photo
  const iw = img.naturalWidth
  const ih = img.naturalHeight
  if (!iw || !ih || w <= 0 || h <= 0) return
  const scale = Math.max(w / iw, h / ih) * zoom
  const sw = w / scale
  const sh = h / scale
  const cx = iw / 2 + (px * (iw - sw)) / 2
  const cy = ih / 2 + (py * (ih - sh)) / 2
  ctx.drawImage(img, cx - sw / 2, cy - sh / 2, sw, sh, x, y, w, h)
}

function drawPhoto(ctx: Ctx, photo: PhotoState | null, x: number, y: number, w: number, h: number, r: number, p: Palette, fonts: PosterFonts) {
  ctx.save()
  roundRect(ctx, x, y, w, h, r)
  ctx.clip()
  if (photo) {
    drawCover(ctx, photo, x, y, w, h)
  } else {
    ctx.fillStyle = p.tint
    ctx.fillRect(x, y, w, h)
    ctx.fillStyle = p.primary
    ctx.globalAlpha = 0.5
    centerText(ctx, "FOTO", x + w / 2, y + h / 2, `${Math.round(Math.min(w, h) * 0.12)}px ${fonts.display}`)
  }
  ctx.restore()
}

function centerText(ctx: Ctx, text: string, cx: number, cy: number, font: string) {
  ctx.font = font
  ctx.textAlign = "center"
  ctx.textBaseline = "alphabetic"
  const m = ctx.measureText(text)
  const asc = m.actualBoundingBoxAscent
  const desc = m.actualBoundingBoxDescent
  ctx.fillText(text, cx, cy + (asc - desc) / 2)
}

function measureAt(ctx: Ctx, text: string, family: string, weight = "") {
  ctx.font = `${weight} 100px ${family}`.trim()
  const m = ctx.measureText(text)
  return {
    w: m.width || 1,
    h: m.actualBoundingBoxAscent + m.actualBoundingBoxDescent || 72,
  }
}

function splitBalanced(words: string[], n: number): string[] {
  if (n === 1 || words.length < 2) return [words.join(" ")]
  let best: string[] = [words.join(" ")]
  let bestScore = Infinity
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ")
    const b = words.slice(i).join(" ")
    const score = Math.max(a.length, b.length)
    if (score < bestScore) {
      bestScore = score
      best = [a, b]
    }
  }
  return best
}

/** Fits display text into a box filling it as much as possible, using 1 or 2 lines. */
function drawFitted(
  ctx: Ctx,
  text: string,
  x: number,
  y: number,
  w: number,
  h: number,
  family: string,
  color: string,
  opts: { maxLines?: number; weight?: string; gapRatio?: number } = {},
) {
  if (!text) return
  const { maxLines = 1, weight = "", gapRatio = 0.18 } = opts
  const words = text.split(/\s+/)
  let bestLines: string[] = [text]
  let bestSize = 0
  for (let n = 1; n <= Math.min(maxLines, words.length); n++) {
    const lines = splitBalanced(words, n)
    const lineH = h / (n + gapRatio * (n - 1))
    let size = Infinity
    for (const line of lines) {
      const m = measureAt(ctx, line, family, weight)
      size = Math.min(size, (100 * w) / m.w, (100 * lineH) / m.h)
    }
    if (size > bestSize * 1.12) {
      bestSize = size
      bestLines = lines
    }
  }
  const n = bestLines.length
  const lineH = h / (n + gapRatio * (n - 1))
  ctx.fillStyle = color
  bestLines.forEach((line, i) => {
    const cy = y + lineH / 2 + i * lineH * (1 + gapRatio)
    centerText(ctx, line, x + w / 2, cy, `${weight} ${bestSize}px ${family}`.trim())
  })
}

function wrapLines(ctx: Ctx, text: string, maxW: number) {
  const words = text.split(/\s+/).filter(Boolean)
  const lines: string[] = []
  let current = ""
  for (const word of words) {
    const test = current ? `${current} ${word}` : word
    if (ctx.measureText(test).width <= maxW || !current) {
      current = test
    } else {
      lines.push(current)
      current = word
    }
  }
  if (current) lines.push(current)
  return lines
}

function layoutInfo(ctx: Ctx, items: InfoItem[], w: number, valueSize: number, labelSize: number, fonts: PosterFonts) {
  ctx.font = `700 ${valueSize}px ${fonts.body}`
  const lh = valueSize * 1.16
  const itemGap = valueSize * 0.7
  const labelGap = labelSize * 0.45
  let total = 0
  const laid = items.map((item) => {
    const lines = wrapLines(ctx, item.value, w)
    const height = labelSize + labelGap + lines.length * lh
    total += height
    return { ...item, lines, height }
  })
  total += itemGap * Math.max(0, items.length - 1)
  return { laid, total, lh, itemGap, labelGap }
}

function drawInfoStack(ctx: Ctx, items: InfoItem[], x: number, y: number, w: number, h: number, s: number, p: Palette, fonts: PosterFonts) {
  ctx.save()
  roundRect(ctx, x, y, w, h, 14 * s)
  ctx.fillStyle = p.tint
  ctx.fill()
  ctx.fillStyle = p.primary
  ctx.fillRect(x, y + 14 * s, 9 * s, h - 28 * s)
  ctx.restore()

  const padX = 30 * s
  const padY = 24 * s
  const innerW = w - padX * 2 - 4 * s
  const innerH = h - padY * 2
  const labelSize = Math.max(14 * s, Math.min(22 * s, innerH * 0.06))

  let valueSize = 46 * s
  let layout = layoutInfo(ctx, items, innerW, valueSize, labelSize, fonts)
  while (layout.total > innerH && valueSize > 16 * s) {
    valueSize -= 1 * s
    layout = layoutInfo(ctx, items, innerW, valueSize, labelSize, fonts)
  }

  const startX = x + padX + 4 * s
  let cy = y + padY + Math.max(0, (innerH - layout.total) / 2)
  ctx.textAlign = "left"
  ctx.textBaseline = "top"
  for (const item of layout.laid) {
    ctx.fillStyle = p.primary
    ctx.font = `800 ${labelSize}px ${fonts.body}`
    ctx.fillText(item.label, startX, cy)
    cy += labelSize + layout.labelGap
    ctx.fillStyle = p.ink
    ctx.font = `700 ${valueSize}px ${fonts.body}`
    for (const line of item.lines) {
      ctx.fillText(line, startX, cy)
      cy += layout.lh
    }
    cy += layout.itemGap
  }
}

function buildInfoItems(d: PosterData): InfoItem[] {
  const items: InfoItem[] = [{ label: "SE PERDIÓ EN", value: locationText(d) }]
  if (d.lastSeen.trim()) items.push({ label: "VISTO POR ÚLTIMA VEZ", value: d.lastSeen.trim() })
  items.push({ label: "FECHA", value: formatDate(d.date, d.includeYear) })
  items.push({ label: "SEÑAS PARTICULARES", value: d.feature.trim() })
  const extra = [d.gender, d.age.trim()].filter(Boolean).join(", ")
  if (extra) items.push({ label: "SEXO Y EDAD", value: extra })
  return items.filter((i) => i.value)
}

function drawNameStrip(ctx: Ctx, d: PosterData, x: number, y: number, w: number, h: number, s: number, p: Palette, fonts: PosterFonts) {
  const bg = p.id === "bn" ? "#000000" : p.secondary
  const fg = p.id === "bn" ? "#FFFFFF" : p.onSecondary
  ctx.save()
  roundRect(ctx, x, y, w, h, 12 * s)
  ctx.fillStyle = bg
  ctx.fill()
  ctx.restore()

  const prefix = "RESPONDE AL NOMBRE DE"
  const name = d.name.trim().toUpperCase()
  const alias = d.alias.trim() ? ` O ${d.alias.trim().toUpperCase()}` : ""
  const nameText = `${name}${alias}`
  const pad = 26 * s
  const gap = 18 * s
  const availW = w - pad * 2

  const nameM = measureAt(ctx, nameText, fonts.display)
  const prefixM = measureAt(ctx, prefix, fonts.body, "800")
  let nameSize = Math.min((100 * h * 0.7) / nameM.h, 160 * s)
  let prefixSize = Math.min(nameSize * 0.5, h * 0.42)
  const totalW = () => (nameM.w * nameSize) / 100 + (prefixM.w * prefixSize) / 100 + gap
  if (totalW() > availW) {
    const k = (availW - gap) / (totalW() - gap)
    nameSize *= k
    prefixSize *= k
  }
  const startX = x + (w - totalW()) / 2
  const cy = y + h / 2

  ctx.fillStyle = fg
  ctx.textAlign = "left"
  ctx.textBaseline = "middle"
  ctx.font = `800 ${prefixSize}px ${fonts.body}`
  ctx.fillText(prefix, startX, cy)
  ctx.textBaseline = "alphabetic"
  ctx.font = `${nameSize}px ${fonts.display}`
  const m = ctx.measureText(nameText)
  ctx.fillText(nameText, startX + (prefixM.w * prefixSize) / 100 + gap, cy + (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2)
}

function drawContact(ctx: Ctx, d: PosterData, x: number, y: number, w: number, h: number, s: number, p: Palette, fonts: PosterFonts) {
  ctx.fillStyle = p.primary
  ctx.fillRect(x, y, w, h)

  const extras: string[] = []
  if (d.phoneBackup.replace(/\D/g, "").length === 10) extras.push(`También: ${formatPhone(d.phoneBackup)}`)
  if (d.tutorName.trim()) extras.push(`Pregunta por ${d.tutorName.trim()}`)
  const extraLine = extras.join("   ·   ")

  const padY = h * 0.1
  const innerH = h - padY * 2
  const labelH = innerH * 0.17
  const extraH = extraLine ? innerH * 0.14 : 0
  const gap = innerH * 0.06
  const phoneH = innerH - labelH - extraH - gap * (extraLine ? 2 : 1)

  let cy = y + padY
  ctx.fillStyle = "#FFFFFF"
  ctx.globalAlpha = 0.92
  centerText(ctx, "SI LO VES, AVISA A", x + w / 2, cy + labelH / 2, `800 ${labelH * 1.25}px ${fonts.body}`)
  ctx.globalAlpha = 1
  cy += labelH + gap
  drawFitted(ctx, formatPhone(d.phone), x + 48 * s, cy, w - 96 * s, phoneH, fonts.display, "#FFFFFF")
  cy += phoneH + gap
  if (extraLine) {
    ctx.fillStyle = "#FFFFFF"
    let size = extraH * 1.2
    ctx.font = `600 ${size}px ${fonts.body}`
    const tw = ctx.measureText(extraLine).width
    if (tw > w - 96 * s) size *= (w - 96 * s) / tw
    centerText(ctx, extraLine, x + w / 2, cy + extraH / 2, `600 ${size}px ${fonts.body}`)
  }
}

function applyGrayscale(ctx: Ctx, W: number, H: number) {
  const data = ctx.getImageData(0, 0, W, H)
  const px = data.data
  for (let i = 0; i < px.length; i += 4) {
    const l = px[i] * 0.299 + px[i + 1] * 0.587 + px[i + 2] * 0.114
    px[i] = px[i + 1] = px[i + 2] = l
  }
  ctx.putImageData(data, 0, 0)
}

export function renderPoster(canvas: HTMLCanvasElement, d: PosterData, W: number, H: number, opts: RenderOptions) {
  canvas.width = W
  canvas.height = H
  const ctx = canvas.getContext("2d")
  if (!ctx) return
  const p = PALETTES[opts.forceMono ? "bn" : d.palette]
  const { fonts } = opts
  const s = W / 1000

  ctx.fillStyle = "#FFFFFF"
  ctx.fillRect(0, 0, W, H)

  const pad = 44 * s
  const gap = 20 * s
  const innerW = W - pad * 2
  const footer = footerText(d)

  const headerH = 136 * s
  const titleH = 118 * s
  const nameH = 96 * s
  const contactH = footer ? 140 * s : 200 * s
  const footerH = footer ? 190 * s : 0

  // Header band
  ctx.fillStyle = p.primary
  ctx.fillRect(0, 0, W, headerH)
  drawFitted(ctx, headerText(d), pad, headerH * 0.16, innerW, headerH * 0.68, fonts.display, p.onPrimary)

  // Type + color
  let y = headerH + gap
  drawFitted(ctx, posterTitle(d), pad, y, innerW, titleH, fonts.display, p.id === "bn" ? "#000000" : p.primary, { maxLines: 2, gapRatio: 0.12 })
  y += titleH + gap * 0.8

  if (d.name.trim()) {
    drawNameStrip(ctx, d, pad, y, innerW, nameH, s, p, fonts)
    y += nameH + gap
  }

  const bottomStart = H - contactH - footerH
  const middleH = bottomStart - gap - y
  const items = buildInfoItems(d)
  const radius = 16 * s

  if (d.secondaryPhoto) {
    const colGap = 22 * s
    const colW = (innerW - colGap) / 2
    const leftX = pad
    const rightX = pad + colW + colGap
    drawPhoto(ctx, d.mainPhoto, rightX, y, colW, middleH, radius, p, fonts)
    const infoH = middleH * 0.56
    drawInfoStack(ctx, items, leftX, y, colW, infoH, s, p, fonts)
    drawPhoto(ctx, d.secondaryPhoto, leftX, y + infoH + colGap, colW, middleH - infoH - colGap, radius, p, fonts)
  } else {
    const infoH = Math.min(220 * s, middleH * 0.36)
    const photoH = middleH - infoH - gap
    drawPhoto(ctx, d.mainPhoto, pad, y, innerW, photoH, radius, p, fonts)
    const iy = y + photoH + gap
    const colGap = 18 * s
    const colW = (innerW - colGap) / 2
    const half = Math.ceil(items.length / 2)
    drawInfoStack(ctx, items.slice(0, half), pad, iy, colW, infoH, s, p, fonts)
    drawInfoStack(ctx, items.slice(half), pad + colW + colGap, iy, colW, infoH, s, p, fonts)
  }

  drawContact(ctx, d, 0, bottomStart, W, contactH, s, p, fonts)

  if (footer) {
    const fy = bottomStart + contactH
    ctx.fillStyle = p.secondary
    ctx.fillRect(0, fy, W, footerH)
    drawFitted(ctx, footer, pad, fy + footerH * 0.1, innerW, footerH * 0.76, fonts.display, p.onSecondary, { maxLines: 2, gapRatio: 0.08 })
  }

  // Side frame
  ctx.strokeStyle = p.primary
  ctx.lineWidth = 16 * s
  ctx.strokeRect(8 * s, 8 * s, W - 16 * s, H - 16 * s)

  if (opts.grayscale) applyGrayscale(ctx, W, H)
}

export function getPosterFonts(): PosterFonts {
  const style = getComputedStyle(document.documentElement)
  const display = style.getPropertyValue("--font-anton").trim() || "Impact, sans-serif"
  const body = style.getPropertyValue("--font-inter").trim() || "system-ui, sans-serif"
  return { display, body }
}

export async function ensureFontsLoaded(fonts: PosterFonts) {
  if (typeof document === "undefined" || !document.fonts) return
  await Promise.all([
    document.fonts.load(`48px ${fonts.display}`, "ÁÉÍÓÚÑ AB"),
    document.fonts.load(`700 48px ${fonts.body}`, "ÁÉÍÓÚÑ AB"),
    document.fonts.load(`800 48px ${fonts.body}`, "ÁÉÍÓÚÑ AB"),
    document.fonts.load(`600 48px ${fonts.body}`, "ÁÉÍÓÚÑ AB"),
  ]).catch(() => undefined)
}

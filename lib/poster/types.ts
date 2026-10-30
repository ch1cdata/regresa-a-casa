export type PetType = "Gato" | "Perro" | "Perico" | "Conejo" | "Otro"

export type PaletteId = "clasica" | "esperanza" | "bn" | "nocturna"

export type FormatId = "carta" | "tabloide" | "facebook" | "historia"

export type PrintMode = "color" | "bn"

export interface PhotoState {
  src: string
  img: HTMLImageElement
  zoom: number
  x: number
  y: number
}

export interface PosterData {
  name: string
  alias: string
  type: PetType | ""
  otherType: string
  color: string
  breed: string
  gender: "" | "Macho" | "Hembra"
  age: string
  feature: string
  colonia: string
  municipio: string
  calle: string
  lastSeen: string
  date: string
  includeYear: boolean
  phone: string
  phoneBackup: string
  tutorName: string
  mainPhoto: PhotoState | null
  secondaryPhoto: PhotoState | null
  headerPreset: string
  headerCustom: string
  footerPreset: string
  footerCustom: string
  palette: PaletteId
  formats: Record<FormatId, boolean>
  printMode: PrintMode
}

export const CUSTOM = "__custom__"

export const PET_TYPES: PetType[] = ["Gato", "Perro", "Perico", "Conejo", "Otro"]

export const HEADER_PRESETS = [
  "¡SE BUSCA!",
  "PERDIDO",
  "PERDIDA",
  "¿LO HAS VISTO?",
  "¿LA HAS VISTO?",
  "¡AYÚDANOS A ENCONTRARLO!",
  "¡AYÚDANOS A ENCONTRARLA!",
]

export const FOOTER_PRESETS = [
  "RECOMPENSA",
  "SE DARÁ UNA RECOMPENSA",
  "SU FAMILIA LO EXTRAÑA",
  "SU FAMILIA LO ESTÁ BUSCANDO",
  "AVÍSANOS A CUALQUIER HORA",
  "SI LO VES, TÓMALE UNA FOTO",
  "NO LO INTENTES AGARRAR, SOLO TOMA UNA FOTO Y AVÍSANOS",
  "PUEDE ESTAR ESCONDIDO EN TU PATIO O AZOTEA",
]

export interface Palette {
  id: PaletteId
  label: string
  description: string
  primary: string
  onPrimary: string
  secondary: string
  onSecondary: string
  tint: string
  ink: string
}

export const PALETTES: Record<PaletteId, Palette> = {
  clasica: {
    id: "clasica",
    label: "Alerta Clásica",
    description: "Máxima visibilidad y urgencia",
    primary: "#E63946",
    onPrimary: "#FFFFFF",
    secondary: "#FFB703",
    onSecondary: "#1D1D1D",
    tint: "#FDECEE",
    ink: "#1D1D1D",
  },
  esperanza: {
    id: "esperanza",
    label: "Esperanza y Comunidad",
    description: "Cálido y amigable",
    primary: "#4A7C59",
    onPrimary: "#FFFFFF",
    secondary: "#D87A43",
    onSecondary: "#FFFFFF",
    tint: "#EEF4EF",
    ink: "#1D1D1D",
  },
  bn: {
    id: "bn",
    label: "Alto Contraste B/N",
    description: "Ideal para impresión económica",
    primary: "#000000",
    onPrimary: "#FFFFFF",
    secondary: "#36454F",
    onSecondary: "#FFFFFF",
    tint: "#F1F1F1",
    ink: "#000000",
  },
  nocturna: {
    id: "nocturna",
    label: "Urgencia Nocturna",
    description: "Excelente para redes sociales",
    primary: "#2563EB",
    onPrimary: "#FFFFFF",
    secondary: "#FFCC00",
    onSecondary: "#0B1B3F",
    tint: "#EAF0FE",
    ink: "#0B1B3F",
  },
}

export interface FormatSpec {
  id: FormatId
  label: string
  detail: string
  width: number
  height: number
  kind: "pdf" | "png"
}

export const FORMATS: Record<FormatId, FormatSpec> = {
  carta: { id: "carta", label: "Cartel tamaño carta", detail: "PDF · 21.6 × 27.9 cm", width: 1275, height: 1650, kind: "pdf" },
  tabloide: { id: "tabloide", label: "Cartel tamaño tabloide", detail: "PDF · 27.9 × 43.2 cm", width: 1650, height: 2550, kind: "pdf" },
  facebook: { id: "facebook", label: "Post para Facebook", detail: "PNG · 1080 × 1350", width: 1080, height: 1350, kind: "png" },
  historia: { id: "historia", label: "Historia IG / TikTok", detail: "PNG · 1080 × 1920", width: 1080, height: 1920, kind: "png" },
}

export function petTypeLabel(d: Pick<PosterData, "type" | "otherType">) {
  if (d.type === "Otro") return d.otherType.trim()
  return d.type
}

export function posterTitle(d: PosterData) {
  const parts = [petTypeLabel(d)]
  if (d.type === "Perro" && d.breed.trim()) parts.push(d.breed.trim())
  parts.push(d.color.trim())
  return parts
    .filter(Boolean)
    .join(" ")
    .replace(/[.\-_,;:·|/]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase()
}

export function headerText(d: PosterData) {
  return (d.headerPreset === CUSTOM ? d.headerCustom : d.headerPreset).trim().toUpperCase()
}

export function footerText(d: PosterData) {
  return (d.footerPreset === CUSTOM ? d.footerCustom : d.footerPreset).trim().toUpperCase()
}

export function formatDate(iso: string, includeYear: boolean) {
  if (!iso) return ""
  const [y, m, day] = iso.split("-").map(Number)
  const date = new Date(y, m - 1, day)
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    ...(includeYear ? { year: "numeric" } : {}),
  }).format(date)
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "")
  if (digits.length !== 10) return digits
  return `${digits.slice(0, 2)} ${digits.slice(2, 6)} ${digits.slice(6)}`
}

export function locationText(d: PosterData) {
  return [d.calle, d.colonia, d.municipio].map((s) => s.trim()).filter(Boolean).join(", ")
}

export function wordCount(s: string) {
  return s.trim() ? s.trim().split(/\s+/).length : 0
}

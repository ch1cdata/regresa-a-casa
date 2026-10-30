"use client"

import { Lightbulb } from "lucide-react"
import { type Errors, StepHeading } from "./form-fields"
import { PhotoCropper } from "./photo-cropper"
import type { PosterData } from "@/lib/poster/types"

interface StepProps {
  data: PosterData
  update: (patch: Partial<PosterData>) => void
  errors: Errors
}

export function StepPhotos({ data, update, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={3}
        title="Fotos de tu mascota"
        description="Una buena foto es lo que más ayuda a que alguien la reconozca. Encuádrala arrastrando y usando el zoom."
      />

      <div className="flex gap-3 rounded-xl border border-accent/50 bg-accent/10 p-4 text-sm leading-relaxed">
        <Lightbulb className="mt-0.5 size-5 shrink-0 text-[#B8621B]" aria-hidden="true" />
        <p className="text-pretty">
          <strong className="font-semibold">Consejo:</strong> usa una foto con buena luz, de cuerpo completo, de pie o
          sentado mirando a la cámara. En la foto secundaria acércate a lo que la hace única: manchas, ojos o marcas.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <PhotoCropper
          title="Foto principal"
          required
          hint="De pie o sentado, viendo a la cámara."
          photo={data.mainPhoto}
          onChange={(mainPhoto) => update({ mainPhoto })}
          aspect={4 / 5}
          error={errors.mainPhoto}
        />
        <PhotoCropper
          title="Foto secundaria"
          hint="Acercamiento a manchas, ojos o marcas."
          photo={data.secondaryPhoto}
          onChange={(secondaryPhoto) => update({ secondaryPhoto })}
          aspect={4 / 5}
        />
      </div>
    </div>
  )
}

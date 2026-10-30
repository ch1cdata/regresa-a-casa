"use client"

import { ChoiceChip, type Errors, Field, StepHeading, controlClass } from "./form-fields"
import { PET_TYPES, type PosterData } from "@/lib/poster/types"

interface StepProps {
  data: PosterData
  update: (patch: Partial<PosterData>) => void
  errors: Errors
}

export function StepPet({ data, update, errors }: StepProps) {
  return (
    <div className="flex flex-col gap-6">
      <StepHeading
        step={1}
        title="Datos de tu mascota"
        description="Cuéntanos cómo es. Estos datos aparecerán en grande para que la gente la reconozca al instante."
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" required error={errors.name}>
          {(p) => (
            <input
              {...p}
              className={controlClass(!!errors.name)}
              value={data.name}
              onChange={(e) => update({ name: e.target.value })}
              placeholder="Ej. Luna"
              autoComplete="off"
              maxLength={30}
            />
          )}
        </Field>
        <Field label="También responde a" hint="Apodos o sobrenombres.">
          {(p) => (
            <input
              {...p}
              className={controlClass()}
              value={data.alias}
              onChange={(e) => update({ alias: e.target.value })}
              placeholder="Ej. Lunita"
              autoComplete="off"
              maxLength={30}
            />
          )}
        </Field>
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 flex items-center gap-2 text-sm font-semibold">
          Tipo de mascota
          <span className="text-destructive" aria-hidden="true">
            *
          </span>
          <span className="sr-only">(obligatorio)</span>
        </legend>
        <div role="radiogroup" aria-label="Tipo de mascota" className="flex flex-wrap gap-2">
          {PET_TYPES.map((t) => (
            <ChoiceChip key={t} selected={data.type === t} invalid={!!errors.type} onClick={() => update({ type: t })}>
              {t}
            </ChoiceChip>
          ))}
        </div>
        {errors.type && (
          <p className="text-sm font-medium text-destructive" role="alert">
            {errors.type}
          </p>
        )}
      </fieldset>

      {data.type === "Otro" && (
        <Field label="¿Qué animal es?" required error={errors.otherType}>
          {(p) => (
            <input
              {...p}
              className={controlClass(!!errors.otherType)}
              value={data.otherType}
              onChange={(e) => update({ otherType: e.target.value })}
              placeholder="Ej. Hurón, Tortuga, Hámster"
              maxLength={20}
              autoFocus
            />
          )}
        </Field>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Color" required error={errors.color} hint="Ej. Blanco, Negro con blanco, Atigrado.">
          {(p) => (
            <input
              {...p}
              className={controlClass(!!errors.color)}
              value={data.color}
              onChange={(e) => update({ color: e.target.value })}
              placeholder="Ej. Blanco"
              maxLength={30}
            />
          )}
        </Field>
        <Field label="Raza" hint={data.type === "Perro" ? "Se mostrará en el título del cartel." : "Déjalo vacío si no tiene raza."}>
          {(p) => (
            <input
              {...p}
              className={controlClass()}
              value={data.breed}
              onChange={(e) => update({ breed: e.target.value })}
              placeholder="Ej. Labrador"
              maxLength={30}
            />
          )}
        </Field>
        <Field label="Género">
          {(p) => (
            <select
              {...p}
              className={controlClass()}
              value={data.gender}
              onChange={(e) => update({ gender: e.target.value as PosterData["gender"] })}
            >
              <option value="">Sin especificar</option>
              <option value="Macho">Macho</option>
              <option value="Hembra">Hembra</option>
            </select>
          )}
        </Field>
        <Field label="Edad">
          {(p) => (
            <input
              {...p}
              className={controlClass()}
              value={data.age}
              onChange={(e) => update({ age: e.target.value })}
              placeholder="Ej. 3 años"
              maxLength={20}
            />
          )}
        </Field>
      </div>

      <Field
        label="Característica particular"
        required
        error={errors.feature}
        hint="Manchas, color de ojos, lunares, marcas, ropa, con o sin collar…"
      >
        {(p) => (
          <textarea
            {...p}
            className={controlClass(!!errors.feature)}
            rows={3}
            value={data.feature}
            onChange={(e) => update({ feature: e.target.value })}
            placeholder="Ej. Ojos verdes, mancha negra en la cola, collar rojo con cascabel"
            maxLength={140}
          />
        )}
      </Field>
    </div>
  )
}

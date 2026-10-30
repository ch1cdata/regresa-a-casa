# Regresa a Casa: Generador de Carteles para Mascotas Perdidas Gratis

## Objetivo

Perder una mascota es una situación muy estresante y actuar con rapidez es esencial. Esta herramienta ayuda a los tutores a crear carteles profesionales, armónicos y visualmente impactantes de forma rápida, intuitiva y gratuita.

## Funcionalidades

- **Formulario guiado por pasos** (5 pasos) con barra de progreso, botones grandes de "Siguiente" / "Atrás" y validación visual de campos obligatorios.
- **Datos de la mascota:** nombre, apodos, tipo (Gato, Perro, Perico, Conejo u Otro), color, raza, género, edad y característica particular.
- **Lugar y contacto:** colonia, municipio, calle, "visto por última vez", fecha (con o sin año) y teléfono validado a 10 dígitos.
- **Fotos con recorte visual:** arrastra y haz zoom para encuadrar, sin deformar nunca la imagen (equivalente a `object-fit: cover`).
- **Personalización:** encabezados y pies de página predefinidos o texto libre, y 4 gamas de color (Alerta Clásica, Esperanza y Comunidad, Alto Contraste B/N y Urgencia Nocturna).
- **Vista previa en vivo** a partir del paso 4, en todos los formatos.
- **Generación optimizada al imprimir:** opción a color o en blanco y negro.
- **Descargas múltiples simultáneas:** PDF tamaño carta, PDF tamaño tabloide y PNG para Facebook e Historias de Instagram / TikTok.
- **Privacidad:** todo se procesa en el navegador. No se envían ni almacenan datos personales ni fotos.

## Tecnologías

- Next.js (App Router) + React
- HTML5 Canvas para componer el cartel directamente en el navegador
- CSS3 / Tailwind CSS
- jsPDF (cargado bajo demanda solo al exportar PDF)

## ¿Cómo usarlo?

1. Abre el sitio en tu navegador (o ejecuta `pnpm install` y `pnpm dev` y visita `http://localhost:3000`).
2. Completa los datos de tu mascota, el lugar donde se perdió y tu teléfono.
3. Sube su foto y encuádrala.
4. Elige el encabezado, el pie de página y los colores.
5. Selecciona los formatos y pulsa **Generar e Imprimir**: tu cartel se descargará listo para imprimir y compartir.

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

## Prompt

PROMPTS - GENERADOR DE CARTEL DE MASCOTA PERDIDA

ROL:
Eres un desarrollador web senior frontend y un diseñador UX/UI experto con un enfoque obsesivo en la armonía visual, la distribución del espacio y la legibilidad a distancia.

TAREA:
Crea una página web ligera, intuitiva y 100% responsiva (enfoque mobile-first) que tenga como objetivo generar un cartel de búsqueda de gatos y perros perdidos para personas sin experiencia en diseño.

PRINCIPIOS DE DISEÑO Y ARMONÍA VISUAL (OBLIGATORIO):
- **Aprovechamiento óptimo del espacio:** Cada sección debe fluir de manera equilibrada, sin dejar huecos muertos ni saturar el área de impresión. El diseño debe respirar, utilizando retículas limpias y márgenes profesionales (padding/margins simétricos).
- **Maximización de la visibilidad de los datos:** Aplica una jerarquía tipográfica estricta donde el tipo de mascota, su color (con raza cuando es perro) y el lugar donde se perdió tengan un peso visual masivo. La información secundaria debe organizarse en bloques con viñetas o recuadros de alto contraste para que el ojo humano escanee y procese los datos críticos en menos de un segundo (crucial para carteles colocados en la calle).

FLUJO DE TRABAJO Y COMPORTAMIENTO:
- El usuario debe llenar un formulario guiado por pasos con una barra o línea de progreso, utilizando botones claros de "Siguiente" y "Atrás", hasta llegar al último paso que será "Generar e Imprimir".
- El formulario debe indicar claramente qué campos son obligatorios y marcar visualmente los errores cuando falte un dato al hacer clic en "Siguiente".
- Generar una vista previa, una vez que el usuario haya aportado los datos del paso 4.

---

ORDEN LÓGICO DEL FORMULARIO POR PASOS:

1. PASO 1 (Datos de la mascota):
- Nombre (campo obligatorio).
- También responde a: (campo opcional).
- Tipo: Elegir entre Gato, Perro, Perico, Conejo, Otro (campo obligatorio). Si selecciona "Otro", debe aparecer obligatoriamente un campo de texto adicional para especificar el animal.
- Color (campo obligatorio).
Raza (campo opcional, ya que la mayoría de mascotas no tienen una raza específica).
Género y Edad (opcionales).
- Característica particular (manchas, color de ojos, lunares, marcas, ropa, con collar, sin collar, etc) (campo obligatorio).

2. PASO 2 (Detalles de la desaparición y Tutor):
- Lugar: Colonia (obligatorio), Municipio (obligatorio), Calle / Visto por última vez (opcionales). Nota: Omitir completamente la opción de "Barrio".
- Fecha de desaparición: Por defecto se rellena automáticamente con la fecha de hoy. Incluye una casilla opcional que diga "Incluir año en la fecha" (por defecto desactivada, mostrando solo día y mes, ej. "29 de octubre").
- Contacto del Tutor: Número de Teléfono principal (validado estrictamente a 10 dígitos obligatorios), Teléfono de respaldo (opcional), Nombre del Tutor (opcional).

3. PASO 3 (Subida de fotos y Zoom sin deformar):
- Foto principal (requisitos: de pie o sentado viendo a la cámara, buena iluminación; buscar una posición distinta de cuerpo completo o sentado para diferenciarla de la secundaria).
- Foto secundaria opcional (acercamiento a características particulares: manchas, color de ojos, marcas).
- Incluye un recortador visual intuitivo (crop) para enfocar a la mascota.
- Reglas técnicas estrictas para fotos: Utiliza `object-fit: cover;` y `object-position: center;` con contenedores de `overflow: hidden;` para que las imágenes nunca se deformen al aplicar zoom o escala.

4. PASO 4 (Personalización y Gama de Colores del Cartel):
Elegir encabezado de una lista desplegable (ej. "¡SE BUSCA!", "PERDIDO", “¿LO HAS VISTO? etc.) o texto libre de máximo 5 palabras.
Elegir pie de página de una lista desplegable (ej. “RECOMPENSA”, “SE DARÁ UNA RECOMPENSA”, “SU FAMILIA LO EXTRAÑA”, “SU FAMILIA LO ESTÁ BUSCANDO”, “AVÍSANOS A CUALQUIER HORA”, “SI LO VES, TÓMALE UNA FOTO”, “NO LO INTENTES AGARRAR, SOLO TOMA UNA FOTO Y AVISANOS”, “PUEDE ESTAR ESCONDIDO EN TU PATIO O AZOTEA”) o UN texto libre de máximo 10 palabras.

- Selector de gama de colores para el marco y diseño del cartel:
  * Opción 1: Alerta Clásica (Rojo coral #E63946 + Amarillo ámbar #FFB703 — Máxima visibilidad y urgencia).
  * Opción 2: Esperanza y Comunidad (Verde oliva #4A7C59 + Naranja tierra #D87A43 — Cálido y amigable).
  * Opción 3: Alto Contraste / Blanco y Negro (Negro puro #000000 + Gris carbón — Ideal para impresiones económicas). Nota de contraste: En esta opción, el texto del nombre debe ser **blanco puro (#FFFFFF)** sobre fondo negro para garantizar legibilidad perfecta.
  * Opción 4: Urgencia Nocturna (Azul cobalto #2563EB + Amarillo brillante #FFCC00 — Excelente para redes sociales).

5. PASO 5 (Opciones de Exportación y Descargas):
- Permitir elegir múltiples formatos de exportación simultáneos: 1 cartel tamaño carta (PDF), 1 cartel tamaño tabloide (PDF), posts en PNG para redes sociales (Facebook / Historias de IG/TikTok).
- Corrección de descarga múltiple: Asegura mediante JavaScript que al seleccionar varios formatos, todos se disparen y descarguen correctamente sin bloquearse entre sí.
- Opción para elegir optimización de impresión en Blanco y Negro o a Color.

---

DISEÑO VISUAL Y MAQUETACIÓN (UI/UX):

1. PALETA DE COLORES PARA LA INTERFAZ DEL SITIO WEB (UI):
- Estilo: Fresco, humano y colaborativo, diseñado para transmitir esperanza y apoyo comunitario.
Color primario (botones de acción como Siguiente, Atrás y Generar): **Verde menta claro / Verde fresco luminoso (#52B788)**. - Color secundario / Acento / Barra de progreso: Ámbar dorado luminoso (#F4A261). - Fondo de la página web: Gris muy claro y limpio (#F8F9FA). - Texto general: Gris oscuro / Carbón (#212529) para máxima legibilidad en pantallas de celulares.

2. MAQUETACIÓN (Layout):
- En dispositivos móviles (Mobile-First): Diseño vertical en una sola columna con pasos claros, barra de progreso intuitiva y botones grandes y accesibles para el dedo pulgar.
- En pantallas grandes (Desktop): Vista dividida (split-screen) donde el formulario guiado por pasos se ubica a la izquierda y el espacio de resumen o pre-generación se mantiene a la derecha.

---

DISEÑO Y ESTRUCTURA DEL CARTEL (GENERADO AL IMPRIMIR / EXPORTAR):
Aplicando principios estrictos de composición visual armoniosa y optimización de espacio:

1. ENCABEZADO Y UBICACIÓN:
- Arriba: El encabezado seleccionado (ej. "¡SE BUSCA!") en tamaño grande, ocupando un bloque de impacto de lado a lado del espacio.
- Debajo: El Tipo combinado con el Color (ej. "GATO BLANCO”) en tamaño masivo completamente limpio, **sin puntos, guiones ni separadores extra**, diseñado para identificar al animal de inmediato. También ocupando todo el espacio disponible en esa línea.


2. DISTRIBUCIÓN 
Sección Superior Máxima Visibilidad: Tipo de mascota y color (raza si es perro), con tipografía robusta y limpia.
Después acomodar la foto o fotos. Si son dos en 2 columnas en la sección central con equilibrio visual.
Si hay 2 fotos, columna derecha: La **FOTO PRINCIPAL** va en la columna derecha en un contenedor amplio abarcando hasta la mitad del espacio, proporcionado y protagónico.
Si hay 2 fotos, columna izquierda con lugar de la desaparición, fecha y característica particular y abajo la foto secundaria.
Foto secundaria va en la columna izquierda abajo de los datos lugar de la desaparición, fecha y característica particular perfectamente enmarcada y contenida dentro de los límites sin desbordarse. 


  * Si solo hay 1 foto: La foto principal se expande de manera amplia, limpia y centrada, ocupando todo el espacio a una sola columna de forma armónica y sin dejar huecos visuales extraños.

  * Abajo de las fotos: El bloque de contacto con fondo sólido (según la gama elegida), diseñado con generoso espacio interno para incluir el texto "SI LO VES, AVISA A" y el **número de teléfono a 10 dígitos en tamaño grande (blanco puro)**, asegurando que sea el elemento que acapare toda la atención visual y no se corte jamás.

Abajo del número de teléfono el pie de página con el texto elegido (ej. RECOMPENSA).

---

RESTRICCIONES TÉCNICAS:
- Cero dependencias pesadas; debe cargar de inmediato, incluso con mala señal en la calle.
- Diseño 100% responsivo, enfoque mobile-first.
- Procesamiento de imágenes y generación de archivos (PDF/PNG) directamente en el navegador sin backend costoso (puedes usar librerías ligeras vía CDN, como html2canvas o jsPDF).
- Diseños optimizados para impresión y para compartir en internet.
- No almacenar datos personales sensibles de los usuarios en bases de datos externas.



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

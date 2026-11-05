# 🐾 GitFut · Chibi Club

> Tu perfil de GitHub entra al campo… en versión chibi.

**GitFut Chibi Club** convierte cualquier cuenta pública de GitHub en una carta de jugador coleccionable con estética chibi: rating, rol futbolístico, estadísticas y repositorios recientes.

![Vista previa de GitFut Chibi Club](assets/preview.png)

---

## ✨ Características

- 🔍 Búsqueda de cualquier usuario público de GitHub.
- 🐱 Diseño chibi original: papel crema, tinta, colores pastel, stickers y sombras duras.
- 🃏 Carta de jugador coleccionable con rating, rol y stats animadas.
- ⚽ Rol futbolístico calculado a partir de la actividad del perfil.
- 📦 Vista de los 4 repositorios actualizados más recientemente.
- 🎨 Colores por lenguaje y formato compacto de números (`1.2k`, `330.4k`).
- ⏳ Estado de carga con skeleton y spinner.
- 🧯 Manejo de errores: usuario inexistente, límite de la API o fallo de conexión.
- 📱 Diseño responsive para escritorio, tablet y móvil.
- ♿ Accesibilidad cuidada y soporte para `prefers-reduced-motion`.
- 🚫 Sin frameworks, sin build y sin dependencias.

---

## 🧠 Cómo funciona

1. Escribes un usuario de GitHub o eliges una sugerencia.
2. La app consulta el perfil público con la **API REST de GitHub**.
3. Después pide sus **4 repositorios actualizados más recientemente**.
4. Con esos datos calcula seis estadísticas, un rating general y un rol.
5. Todo se pinta en una ficha de scouting y una carta chibi.

Las estadísticas son una **interpretación lúdica** de datos públicos. No son una medida real de la calidad de un desarrollador.

---

## 📊 Estadísticas

| Stat | Nombre | Qué representa |
| --- | --- | --- |
| **PAC** | Ritmo | Actividad y frecuencia de publicación |
| **DRI** | Regate | Impacto de forks y cantidad de repositorios |
| **SHO** | Tiro | Popularidad e impacto: estrellas + seguidores |
| **DEF** | Defensa | Comunidad que sigue y gists públicos |
| **PAS** | Pase | Alcance de la red de seguidores |
| **PHY** | Físico | Volumen de repositorios y estrellas |

Cada valor se limita al rango **35–99**. El **rating general** es el promedio redondeado de las seis estadísticas.

### Roles

| Código | Rol | Condición aproximada |
| --- | --- | --- |
| `ST` | Delantero | El stat más alto es **SHO** |
| `CM` | Mediocampo | El stat más alto es **PAS** |
| `DF` | Defensa | El stat más alto es **DEF** |
| `GK` | Portero | Cualquier otro caso |

---

## 🚀 Cómo ejecutarlo

No necesita instalación ni build. Puedes abrir `index.html` directamente en el navegador.

Si prefieres servirlo en local:

```bash
# Con Python
python -m http.server 4173

# Con Node.js
npx serve .
```

Luego abre:

```text
http://localhost:4173
```

> La app usa la API pública de GitHub sin autenticación. El límite es de **60 peticiones por hora por IP**; cada scouting consume 2 peticiones. Si se agota, la app muestra un aviso.

---

## 🗂️ Estructura del proyecto

```text
Buscador_github/
├── index.html          # Estructura, mascota SVG y contenido
├── css/
│   └── styles.css      # Sistema visual chibi, responsive y animaciones
├── js/
│   └── app.js          # Búsqueda, cálculo de stats, render y estados
├── assets/
│   └── preview.png     # Captura de la interfaz
└── README.md
```

---

## 🛠️ Tecnologías

- **HTML5** semántico.
- **CSS3**: custom properties, Grid, Flexbox, animaciones y `prefers-reduced-motion`.
- **JavaScript vanilla**: `fetch`, manipulación del DOM y estados de interfaz.
- **GitHub REST API v3**.
- **Google Fonts**: Baloo 2, Nunito y Patrick Hand.

---

## ♿ Accesibilidad

- HTML semántico y etiquetas ARIA donde aportan valor.
- Estado de búsqueda anunciado con `role="status"` y `aria-live="polite"`.
- Foco gestionado al mostrar la carta del jugador.
- Contraste de color conforme a WCAG AA.
- Animaciones desactivadas si el sistema tiene activado *reducir movimiento*.

Auditoría Lighthouse del proyecto:

```text
Accesibilidad      100
Buenas prácticas   100
SEO                100
```

---

## ⚠️ Notas

- Solo se consultan **datos públicos** de GitHub.
- El avatar y los datos pertenecen a cada usuario.
- La inspiración para la idea de cartas viene de [GitFut](https://github.com/younesfdj/gitfut) y sus creadores.
- La mascota, el sistema visual y la implementación de esta versión son propios de este proyecto.

---

Hecho con ♥ y mucho café. ☕

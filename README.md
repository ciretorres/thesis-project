# thesis-project

refactorización

![](https://img.shields.io/badge/status-in%20progress-yellow)
![](https://img.shields.io/badge/npm%20v2.0.0-alpha.0-orange)
![](https://img.shields.io/badge/three-v0.186.1-blue)
![](https://img.shields.io/badge/vite-v8.3.4-green)

Interfaz 3D interactiva lúdica que visualiza el fenómeno astronómico del módulo de distancia.
JavaScript plano + [three.js](https://threejs.org/) + [Vite](https://vite.dev/), desplegada en GitHub Pages para presentarlo en el navegador
<a href="https://ciretorres.github.io/thesis-project/" target="_blank" rel="noopener noreferrer">
aquí
</a>.

## Contacto

- Eric Torres (erictorres.velasco@gmail.com)

## Instalación

1. Clona el repositorio con el siguiente comando en la terminal.

```bash
git clone https://github.com/ciretorres/thesis-project.git
```

2. Entra a la carpeta del proyecto.

```bash
cd thesis-project
```

3. Instala las dependencias del paquete

```bash
npm install
```

```bash
bun install
```

### Levantar en local

4. Compila y levanta el proyecto en un servidor local de desarrollo

```bash
bun run dev
```

## Estructura de archivos

```
thesis-project/
├── .github/workflows/        # deploy a GitHub Pages
├── .vscode/                  # configuración para Visual Studio Code
├── docs/                     # documentación
├── notebooks/                # pipeline Python con módulo de análisis
├── public/                   # datos estáticos
└── src/
│   ├── escena/               # renderer, escena, cámara...
│   ├── estrellas/            # datos, magnitudes, simulación...
│   ├── interaccion/          # hover/clic, enfoque de cámara
│   ├── reticula/             # grid, esfera celeste, etiquetas
│   ├── styles/               # CSS por componente
│   ├── ui/                   # inspector, buscador, ayuda, avisos...
│   └── main.js               # entrypoint
├── .gitignore
├── CHANGELOG.md              # registro de commits
├── DESIGN.md
├── index.html
├── LICENSE
├── package.json
├── README.md
└── vite.config.js
```

[Ir al inicio](#thesis-project)

## CHANGELOG

`CHANGELOG.md` se mantiene **manualmente** con commits convencionales (`feat:`, `fix:`, `docs:`, `chore:`):
tras cada commit, añade la entrada en `[Unreleased]` agrupada por tipo (✨ Features / 🐛 Bug Fixes / 📦 Other Changes)
con el mensaje y el link al commit. Al hacer release, mueve las entradas a una versión con tag (`vX.Y.Z`).

## Datos de estrellas

`public/data/vizier_I_239_hip_main_10pc.json` (catálogo Hipparcos <10 pc) contiene los datos
reales, integrados vía `src/estrellas/datos.js`.
`src/estrellas/manuales.js` añade estrellas fuera del catálogo con guard por HIP
(p. ej. Polaris, HIP 11767), concatenadas en `src/estrellas/datos.js`.

## Three.js

Es una librería en Javascript que facilita la creación y visualización de gráficos en navegadores web. Permite renderizar escenas 3d utilizando WebGL (una API para renderizar gráficos acelerados por hardware en el navegador). Three.js abstrae gran parte de la complejidad de WebGL haciéndolo más accesible y fácil de usar.

### Arquitectura y características clave

- **Escenas:** contenedores con objetos 3d, luces, cámara.
- **Objetos 3D:** formas geométricas (cubo, esferas, planos).
- **Materiales:** define los objetos en color, textura, brillo, etc.
- **Luces:** iluminan la escena con sombras y efectos.
- **Cámaras:** definen el punto de vista de la escena.
- **Renderizador:** WebGL toma la escena y la pasa a 2d en el navegador.
- **Animación:** mecanismos para animar objetos, cámaras, luces.
- **Importación de modelos 3d:** de Blender, Maya en gltF, OBJ, FBX.

La ventaja de usar Three.js para el desarrollo de un planetario interactivo es la creación de una experiencia interactiva donde el usuario puede navegar por el cielo, seleccionar objetos, obtener información, etcétera. Además, la compatibilidad con navegadores web es suficiente, puesto que funciona con la mayoría de los navegadores modernos sin necesidad de plugins adicionales. Una comunidad activa de desarrolladores ofrecen soporte, ejemplos y recursos.

Por lo que, crear un planetario interactivo con Three.js es un proyecto totalmente viable.

Three.js no incluye funciones astronómicas nativas. Las matemáticas se realizan de manera externa. Sin embargo; su arquitectura de escena, sistemas de coordenas, shaders, controles de cámara y entre otras, permiten construirlo desde cero o integrando librerías efímeras.

[Ir al inicio](#thesis-project)

## Por qué se dejó de mantener el proyecto anterior de Processing

Debido a que se buscaba una mejor manera de hacerlo en un ambiente más abierto y controlado con frameworks o librerías flexibles y modernas o motores para el desarrollo de gráficos en 3D o videojuegos.

- La [versión anterior (v1.0.0)](https://github.com/ciretorres/thesis-project/tree/v1.0.0) se puede consultar, descargar y levantar en local desde el repositorio del proyecto.
- Acá un video con el [prototipo](https://www.dropbox.com/scl/fi/tqdl9k975vtg9jlballuf/video_1.mov?rlkey=g9o2tn7nhgfyv4llj2qc31snp&e=2&dl=0).
- Los archivos de la aplicación ejecutable de la versión v1.0.0 pesan 520.5MB para **macos-aarch64**, 277.9MB **macos-x86_64** , 277MB **windows-amd64** y 277.4MB **linux-amd64**. Pero los logré subir a [https://ciretorres.itch.io/prototype-v1](https://ciretorres.itch.io/prototype-v1).

[Ir al inicio](#thesis-project)

## Referencias

Torres-Velasco, E. O., Laureano-Cruces, A. L., Santillán-González, A. (2021). _Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica_ (Tesis de Maestría). Universidad Autónoma Metropolitana, México. [http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf](http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf)

[Ir al inicio](#thesis-project)

## Licencia

Thesis Project se distribuye bajo la licencia
[GNU General Public License, versión 3 o posterior](https://www.gnu.org/licenses/gpl-3.0.html).

El código puede utilizarse, estudiarse, modificarse y redistribuirse,
siempre que las versiones distribuidas cumplan las condiciones de la GPLv3.

SPDX-License-Identifier: GPL-3.0-or-later

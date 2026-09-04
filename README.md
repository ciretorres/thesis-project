# thesis-project

refactorización javascript

<!-- ![](https://img.shields.io/badge/status-in%20release-purple) -->

![](https://img.shields.io/badge/status-in%20progress-yellow)
![](https://img.shields.io/badge/npm%20v2.0.0-alpha.0-orange)
![](https://img.shields.io/badge/three-v0.185.1-blue)
![](https://img.shields.io/badge/vite-v8.2.2-green)

Es una interfaz-interactiva lúdica que visualiza el fenómeno en astronomía del módulo de distancia.

Utiliza [three.js](https://threejs.org/) y [vite](https://vite.dev/) para presentarlo en el navegador
<a href="https://ciretorres.github.io/thesis-project/" target="_blank" rel="noopener noreferrer">
aquí
</a>.

```json
{
  "dependencies": {
    "three": "^0.185.1"
  },
  "devDependencies": {
    "vite": "^8.2.0",
    "vitest": "^4.1.10"
  }
}
```

<img src="./public/capturas/Screen Shot 2026-08-31 at 19.11.46.webp" width="800">

## Contacto

- Eric Torres (erictorres.velasco@gmail.com)

---

## Índice

- [Instalar y ejecutar la intefaz-interactiva en local](#instalación)
- [Implementación](./src/docs/implementacion.md)
  - Escena, Cámara, Renderer, Controles, Luces.
  - [Estrellas](./src/docs/implementacion.md)
  - [Retícula](./src/docs/implementacion.md#reticula) (Declinación, Ascensión Recta, [Etiquetas](./src/docs/implementacion.md#etiquetas))
- [Análisis de datos astronómicos en notebooks](./src/notebooks/README.md)
- [Three.js](#threejs)
- [Mantemiento versión anterior](#por-qué-se-dejó-de-mantener-el-proyecto-anterior-de-processing)
- [Referencias](#referencias)

## Instalación

1. Clona el repositorio con la terminal

```
git clone https://github.com/ciretorres/thesis-project.git
```

2. Entra a la carpeta del proyecto

```
cd thesis-project
```

3. Instala las dependencias del paquete

```
npm install
```

```
bun install
```

### Levantar en local

4. Compila y levanta el proyecto en un servidor local

```
bun run dev
```

## Estructura de archivos

```md
thesis-project/
└── src/
│   ├── assets/
│   ├── componentes/
│   ├── notebooks/
│   ├── scripts/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── public/
├── .gitignore
├── package.json
├── README.md
└── vite.config.js
```

[Ir al inicio](#thesis-project)

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

- La [versión anterior (v1.0.0)](https://github.com/ciretorres/thesis-project/tree/v1.0.0) se puede consultar, descargar y levantar en local desde el repositorio el proyecto.
- Acá un video con el [prototipo](https://www.dropbox.com/scl/fi/tqdl9k975vtg9jlballuf/video_1.mov?rlkey=g9o2tn7nhgfyv4llj2qc31snp&e=2&dl=0).
- Los archivos de la aplicación ejecutable pesan 520.5MB para **macos-aarch64**, 277.9MB **macos-x86_64** , 277MB **windows-amd64** y 277.4MB **linux-amd64**. Pero los logré subir a [https://ciretorres.itch.io/prototype-v1](https://ciretorres.itch.io/prototype-v1).

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

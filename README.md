# thesis-project

![](https://img.shields.io/badge/status-in%20progress-yellow)

Refactorización js

- [proto](proposals/proto/README.md)
- [threevite](proposals/threevite/README.md)
- [threevscode](proposals/threevscode/README.md)
- [p5vite](proposals/p5vite/README.md) 👎🏿
- [p5vue](proposals/p5vue/README.md) 👎🏿
- [Prototype_v2](proposals/Prototype_v2/README.md) 👎🏿

## Propuestas

```md
thesis-project/
├── .vscode
├── Prototype_v1
├── docs
├── proposals/
| ├── p5vite
| ├── p5vue
| ├── proto
| ├── Prototype_v2
| ├── threevite
| └── thressvscode
├── .gitignore
├── README.md
└── package.json/
```

[Ir al inicio](#thesis-project)

## Propuesta ideal

Tendría que contener lo siguiente:

Utilizar un manejador de paquetes seguro para poder instalar las librerías por dependencias desde un archivo `package.json`, en lugar de utilizar un cdn o subir las librerías al repositorio.

Actualizar y recargar el puerto del servidor local instantáneamente del entorno de ejecución al realizar cambios en los script e interfaz.

Compilar y minificar el código de despliegue para la versión de distribución con el builder.

Realizar pruebas de componentes y unitarias.

Realizar una imagen en docker para ejecutarse.

Realizar linteo, formateo y sintaxis de código.

- que permita colocar el `canvas` dentro del la etiqueta `main`.
- ajustar y reescalar el ancho del canvas al ancho de la pantalla.
- ordenar en folders la jerarquía de los archivos js, css, etc. Ejemplo:

  ```
  src/
  ├── assets/
  |   ├── base.css
  |   └──main.css
  ├── sketches/
  |   └── index.js
  ├── index.html
  └── main.js
  ```

## Referencias

Torres-Velasco, E. O., Laureano-Cruces, A. L., Santillán-González, A. (2021). _Visualización a través del razonamiento cualitativo: un fenómeno de astrofísica_ (Tesis de Maestría). Universidad Autónoma Metropolitana, México. Recuperada de: http://kali.azc.uam.mx/clc/02_publicaciones/tesis_dirigidas/Tesis_Final_ETV.pdf

## Contacto

- Eric Torres (erictorres.velasco@gmail.com)

---

Otros enlaces

[35 incredible dataviz tools](https://www.creativebloq.com/design-tools/data-visualization-712402)

[babylonjs](https://babylonjs.com/)

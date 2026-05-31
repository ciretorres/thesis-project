# thesis-project

![](https://img.shields.io/badge/status-in%20progress-yellow)

Refactorización js

## Propuestas

- [proto](proposals/proto/README.md)
- [threevite](proposals/threevite/README.md)
- [threevscode](proposals/threevscode/README.md)

Descartadas

- [p5vite](proposals/p5vite/README.md)
- [p5vue](proposals/p5vue/README.md)
- [Prototype_v2](proposals/Prototype_v2/README.md)
- [processingvite](proposals/processingvite/README.md)
- [processingvscode](proposals/processingvscode/README.md)

```md
thesis-project/
├── docs/
├── proposals/
| ├── p5vite
| ├── p5vue
| ├── proto
| ├── Prototype_v2
| ├── threevite
| └── thressvscode
|
├── Prototype_v1/
├── README.md
└── package.json
```

[Ir al inicio](#thesis-project)

## Requerimientos

Tendría que tener como mínimo lo siguiente:

- Instalar librerías mediante un manejador de paquetes para utilizarse como dependencias de un archivo `package.json`. En lugar de utilizar un cdn o subir las librerías al repositorio la aplicación.

- Actualizar y recargar el entorno de ejecución instantáneamente al realizar cambios en los script de la aplicación.

- Compilar y minificar en código de despliegue a través del builder para la versión de distribución de la aplicación.

- Realizar pruebas de componentes y unitarias.

- Realizar una imagen en docker para ejecutarse.

- Realizar linteo, formateo y sintaxis de código.

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

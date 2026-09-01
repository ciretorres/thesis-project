# grid

## Planteamiento y documentación del proyecto

Los modelos `mistral-small3.2:24b`, `granite4.1:30b` y `qwen3.6:27b` me ayudaron con ejemplos en código desde Ollama para el desarrollo y cálculo de una retícula geométrica en 3d mediante líneas de punto en el espacio esférico o superficie curva. Así como la consulta con a `GPT-5.6 Luna` desde duck.ai

## Conversión y convención de sistemas de coordenadas

Las coordenadas ecuatoriales son un sistema de referencia astronómico. En la astronomía estándar (ICRS/J2000) o en los sistemas ecuatoriales los ángulos de dirección de las coordenadas son:

- **Ascensión Recta (RA).** Es el ángulo del ecuador medido desde el equinoccio vernal (0,0) hasta el meridiano. Equivale a la coordenada de longitud angular en el plano Norte. Crece hacia el Este. Y va desde los 0° hasta los 360° así como de 0h hasta 24h.
- **Declinación (Dec).** Es la distancia angular desde el plano ecuatorial al Sur (-90°) y al Norte (90°). Equivale a la coordenada de latitud.

Para transformar las **coordenas ecuatoriales** (ra, dec) a **coordenas esféricas** (x, y, z), se utiliza la información sobre la RA para los meridianos que pasan por los ejes (0° a 360°) y la Dec paralelos al ecuador celeste (-90° a +90°).

En un sistema cartesiano estándar (x,y) la 'Y' siempre es arriba 'Y-Up.' En modelos celestes se usa 'Z-Up' como arriba para representar la dirección del polo Norte o el eje vertical celeste.

```bash
# Se normaliza el radio de la esfera mediante `R = radius`

# ecuador celeste con el plano XZ
x = radius * cos(phi = φ) * cos(theta = θ)
y = radius * sin(phi = φ)
z = radius * cos(phi = φ) * sin(theta = θ)

# ecuador celeste con el plano XY
x = radius * cos(phi = φ) * cos(theta = θ)
y = radius * cos(phi = φ) * sin(theta = θ)
z = radius * sin(phi = φ)

```

```js
// ejemplo de función para convertir valores
function raDecToVec3(ra, dec, radius) {
  return new THREE.Vector3(
    radius * Math.cos(dec) * Math.cos(ra),
    radius * Math.cos(dec) * Math.sin(ra),
    radius * Math.sin(dec),
  );
}
```

### Se define:

- Sistema de coordenadas 'Z-up' para la fórmula matemática de conversión.
- Rango para RA (0 a 2π) y Dec (-π/2 a π/2).
- Construcción geométrica y eficiente mediante segmentos de líneas, sprites, css2dobject, entre otros.

<!-- [Ir al inicio](#thesis-project) -->

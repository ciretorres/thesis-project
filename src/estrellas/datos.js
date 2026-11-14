import { ESTRELLAS_MANUALES } from "./manuales.js";

/** Ruta predeterminada del catálogo de estrellas en public/data/. */
const RUTA_ESTRELLAS = "./data/vizier_I_239_hip_main_10pc.json";

/** Campos que deben estar presentes en el schema del archivo JSON. */
const CAMPOS_REQUERIDOS = [
  "HIP",
  "RAhms",
  "DEdms",
  "Vmag",
  "Plx",
  "ABSmag",
  "Pc",
  "Ly",
  "X",
  "Y",
  "Z",
];

/**
 * Carga el catálogo de estrellas, valida su estructura y sus datos, y añade
 * las estrellas manuales que no estén ya incluidas.
 *
 * @param {string} [ruta=RUTA_ESTRELLAS] Ruta del archivo JSON que se cargará.
 * @returns {Promise<Array<Object>>} Estrellas con datos válidos y sin duplicados por HIP.
 * @throws {Error} Si falla la solicitud, el JSON no es válido o faltan datos requeridos.
 */
export async function cargarEstrellas(ruta = RUTA_ESTRELLAS) {
  let respuesta;

  try {
    respuesta = await fetch(ruta);
  } catch {
    throw new Error(`No se pudo contactar al servidor para cargar ${ruta}`);
  }

  if (!respuesta.ok) {
    throw new Error(
      `No se pudo cargar el catálogo de estrellas (${respuesta.status})`,
    );
  }

  let json;

  try {
    json = await respuesta.json();
  } catch {
    throw new Error(`${ruta} no contiene JSON válido`);
  }

  if (!json || typeof json.schema !== "object" || !Array.isArray(json.data)) {
    throw new Error(
      `${ruta} con formato inválido: se esperaba { schema, data }`,
    );
  }

  const campos = Array.isArray(json.schema.fields)
    ? json.schema.fields.map((campo) => campo.name)
    : [];
  const faltantes = CAMPOS_REQUERIDOS.filter((c) => !campos.includes(c));

  if (faltantes.length > 0) {
    throw new Error(
      `Faltan campos requeridos en el schema: ${faltantes.join(", ")}`,
    );
  }

  const estrellas = json.data.flatMap((fila) => {
    const estrella = {
      hip: Number(fila.HIP),
      vmag: Number(fila.Vmag),
      absmag: Number(fila.ABSmag),
      plx: Number(fila.Plx),
      distancia: Number(fila.Pc),
      ly: Number(fila.Ly),
      rahms: String(fila.RAhms ?? ""),
      dedms: String(fila.DEdms ?? ""),
      x: parseFloat(fila.X),
      y: parseFloat(fila.Y),
      z: parseFloat(fila.Z),
    };

    const valoresNumericos = [
      estrella.hip,
      estrella.vmag,
      estrella.absmag,
      estrella.plx,
      estrella.distancia,
      estrella.ly,
      estrella.x,
      estrella.y,
      estrella.z,
    ];

    const valida =
      valoresNumericos.every(Number.isFinite) &&
      estrella.rahms !== "" &&
      estrella.dedms !== "";

    return valida ? [estrella] : [];
  });

  if (estrellas.length === 0) {
    throw new Error(
      `${ruta} no contiene ninguna estrella con coordenadas válidas`,
    );
  }

  // Añade las estrellas manuales que no estén en el catálogo, sin duplicar HIP.
  // Los campos requeridos se validan únicamente para el schema del archivo JSON.
  const hips = new Set(estrellas.map((estrella) => estrella.hip));
  const manuales = ESTRELLAS_MANUALES.filter((manual) => !hips.has(manual.hip));

  return [...estrellas, ...manuales];
}

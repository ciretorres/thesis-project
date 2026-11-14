/** Nombres de estrellas indexados por número HIP. */
export const dict_hip_completo = {
  // # HIP 1 ~ 10000
  439: "CD -37° 15492",
  667: "α Andromedae (Alpheratz o Sirrah)",
  3419: "β Ceti (Deneb Kaitos o Diphda)",
  3829: "Estrella de Van Maanen",
  5336: "μ Cassiopeiae",
  5447: "β Andromedae (Mirach)",
  7588: "α Eridani (Achernar)",
  9884: "α Arietis (Hamal)",
  // # HIP 10001 ~ 20000
  10826: "ο Ceti (Mira)",
  11767: "α Ursae Minoris (Polaris)",
  15863: "α Persei (Mirfak)",
  19849: "ο² Eridani",
  // # HIP 20001 ~ 30000
  21421: "α Tauri (Aldebarán)",
  24186: "Estrella de Kapteyn",
  24436: "β Orionis (Rigel)",
  24608: "α Aurigae (Capella)",
  25336: "γ Orionis (Bellatrix)",
  25428: "β Tauri (Elnath)",
  25930: "δ Orionis (Mintaka)",
  26311: "ε Orionis (Alnilam)",
  26727: "ζ Orionis (Alnitak)",
  27366: "κ Orionis (Saiph)",
  27989: "α Orionis (Betelgeuse)",
  28360: "β Aurigae (Menkalinan)",
  // # HIP 30001 ~ 40000
  30324: "β Canis Majoris (Mirzam o Murzim)",
  30438: "α Carinae (Canopo)",
  31681: "γ Geminorum (Alhena)",
  32349: "α Canis Majoris (Sirio)",
  33579: "ε Canis Majoris (Adhara)",
  34444: "δ Canis Majoris (Wezen)",
  36208: "Estrella de Luyten",
  36850: "α Geminorum (Cástor)",
  37279: "α Canis Minoris (Procyon)",
  37826: "β Geminorum (Pólux)",
  39953: "γ Velorum (Suhail o Regor)",
  // # HIP 40001 ~ 50000
  41037: "ε Carinae (Avior)",
  42913: "δ Velorum",
  45238: "β Carinae (Miaplacidus)",
  46390: "α Hydrae (Alphard)",
  49669: "α Leonis (Regulus)",
  // # HIP 50001 ~ 60000
  50583: "γ Leonis (Algieba)",
  54035: "Lalande 21185",
  54061: "α Ursae Majoris (Dubhe)",
  54211: "Gliese 412",
  54872: "δ Leonis (Duhr o Zosma)",
  54879: "θ Leonis (Chertan)",
  56997: "61 Ursae Majoris",
  57362: "β Leonis (Denébola)",
  57757: "β Virginis (Zavijava)",
  58001: "γ Ursae Majoris (Phecda)",
  59196: "δ Centauri",
  // # HIP 60001 ~ 70000
  60351: "12 Comae Berenices",
  60718: "α Crucis (Acrux)",
  61084: "γ Crucis (Gacrux)",
  62434: "β Crucis (Becrux o Mimosa)",
  62956: "ε Ursae Majoris (Alioth)",
  63608: "ε Virginis (Vindemiatrix)",
  65474: "α Virginis (Espiga)",
  65835: "R Hydrae",
  66249: "ζ Virginis (Heze)",
  67301: "η Ursae Majoris (Alkaid o Benetnasch)",
  68702: "β Centauri (Hadar o Agena)",
  68933: "θ Centauri (Menkent)",
  69673: "α Bootis (Arturo)",
  // # HIP 70001 ~ 80000
  70890: "α Centauri C (Próxima Centauri)",
  71681: "α Centauri B (Toliman)",
  71683: "α Centauri A (Rigil Kentaurus)",
  71860: "α Lupi (Kakkab o Men)",
  72607: "β Ursae Minoris (Kochab)",
  75097: "γ Ursae Minoris (Pherkad)",
  // # HIP 80001 ~ 90000
  80763: "α Scorpii (Antares)",
  82273: "α Trianguli Australis (Atria)",
  82396: "ε Scorpii (Wei)",
  85927: "λ Scorpii (Shaula)",
  86032: "α Ophiuchi (Rasalhague o Ras Alhague)",
  86228: "θ Scorpii (Sargas o Girtab)",
  87937: "Estrella de Barnard",
  // # HIP 90001 ~ 100000
  90185: "ε Sagittarii (Kaus Australis)",
  90496: "λ Sagittarii (Kaus Borealis)",
  91262: "α Lyrae (Vega)",
  92403: "Ross 154",
  92855: "σ Sagittarii (Nunki)",
  97278: "γ Aquilae (Tarazed)",
  97649: "α Aquilae (Altair)",
  // # HIP 100001 ~ 110000
  100751: "α Pavonis (Peacock)",
  102098: "α Cygni (Deneb, Arided o Aridif)",
  104217: "61 Cygni B",
  105090: "Lacaille 8760",
  105881: "ζ Capricorni (Marakk)",
  108870: "ε Indi",
  109268: "α Gruis (Alnair)",
  109358: "β Canum Venaticorum (Asterion o Chara)",
  // # HIP 110001 ~ 120000
  112122: "β Gruis (Gruid)",
  113368: "α Piscis Austrini (Fomalhaut)",
  114046: "Lacaille 9352",
};

// Vocales acentuadas y con diéresis → vocal base.
const MAPA_VOCAL = {
  à: "a",
  á: "a",
  â: "a",
  ã: "a",
  ä: "a",
  å: "a",
  è: "e",
  é: "e",
  ê: "e",
  ë: "e",
  ì: "i",
  í: "i",
  î: "i",
  ï: "i",
  ò: "o",
  ó: "o",
  ô: "o",
  õ: "o",
  ö: "o",
  ù: "u",
  ú: "u",
  û: "u",
  ü: "u",
};

/**
 * Normaliza texto para búsquedas: recompone Unicode, pasa a minúsculas,
 * recorta espacios y elimina los diacríticos de las vocales indicadas.
 * Conserva ñ, ç y las letras griegas.
 *
 * @param {string} texto Texto que se normalizará.
 * @returns {string} Texto normalizado.
 */
export function normalizarTexto(texto) {
  return String(texto)
    .normalize("NFC")
    .toLowerCase()
    .trim()
    .replace(/[àáâãäåèéêëìíîïòóôõöùúûü]/g, (c) => MAPA_VOCAL[c]);
}

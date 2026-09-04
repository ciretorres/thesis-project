async function fetchData() {
  let data = [];
  // const url = "../notebooks/data_clean/vizier_I_239_hip_main_10pc.json";
  const url = `${import.meta.env.BASE_URL}data/vizier_I_239_hip_main_10pc.json`;
  // const url = `${import.meta.env.BASE_URL}notebooks/data_clean/vizier_I_239_hip_main_10pc.json`;
  // const url = `${import.meta.env.BASE_URL}public/notebooks/data_clean/vizier_I_239_hip_main_10pc.json`;

  // console.log(url);
  // const response = await fetch(url);
  // const text = await response.text();
  // console.log("Status:", response.status);
  // console.log("Content-Type:", response.headers.get("content-type"));
  // console.log("Respuesta:", text.slice(0, 200));

  try {
    const response = await fetch(url);

    // la promesa resuelta es la respuesta HTTP (no el cuerpo)
    if (!response.ok) {
      // response.ok es true si el estado está entre 200 y 399
      // throw new Error("Network response was not ok", response.status);
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // parsea el cuerpo de la respuesta como JSON
    const json = await response.json();

    // asigna data
    data = json.data;
    // console.log(data);

    return data;
  } catch (error) {
    // console.error(`Error: ${error.message}`);
    console.error("Error al cargar el JSON:", error);
    return [];
  }
}
export default fetchData;

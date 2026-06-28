async function fetchData() {
  let data = [];
  const url =
    "../../../assets/notebooks/data_clean/vizier_I_239_hip_main_10pc.json";

  try {
    const response = await fetch(url);

    // la promesa resuelta es la respuesta HTTP (no el cuerpo)
    if (!response.ok) {
      // response.ok es true si el estado está entre 200 y 399
      throw new Error("Network response was not ok", response.status);
    }

    // parsea el cuerpo de la respuesta como JSON
    const json = await response.json();

    // asigna data
    data = json.data;
    // console.log(data);

    return data;
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
}
export default fetchData;

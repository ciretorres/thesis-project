import { Raycaster, Vector2 } from "three";

const selectStar = (camera, group) => {
  let selectedObject = null;

  const raycaster = new Raycaster();
  const pointer = new Vector2();

  // Raycaster para detección de mouse hover
  const onPointerMove = (event) => {
    if (selectedObject) {
      selectedObject.material.color.set("#fff");
      selectedObject = null;
    }

    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el raycaster
    raycaster.setFromCamera(pointer, camera);

    // Intersecta con los objetos en la escena
    const intersects = raycaster.intersectObject(group, true);

    if (intersects.length > 0) {
      const res = intersects.filter(function (res) {
        return res && res.object;
      })[0];
      //
      if (res && res.object) {
        // Obtener información del objeto seleccionado
        selectedObject = res.object;
        selectedObject.material.color.set("#f00");
      }
    }
  };
  document.addEventListener("pointermove", onPointerMove);

  // Detección de clics en sprites
  const onMouseClick = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
    //   const mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    //   const mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    // Actualizamos las coordenadas del mouse en el espacio de la cámara
    //   camera.updateMatrixWorld(); // make sure the camera's matrix is updated
    //   const vector = new Vector3(mouseX, mouseY, 0.5).unproject(camera);

    // Actualiza el raycaster
    raycaster.setFromCamera(pointer, camera);
    //   raycaster.setFromCamera(vector.sub(camera.position), camera);

    // Intersecta con los objetos en la escena
    const intersects = raycaster.intersectObject(group, true);

    if (intersects.length > 0) {
      // console.log("Sprite seleccionado:", intersects[0].object.userData); // Suponiendo que hay información adicional en userData
      // Ejemplo: Cambiar la distancia del sprite seleccionado a 10 unidades desde el centro
      // changeDistance(intersects[0].object, 10);

      const res = intersects.filter(function (res) {
        return res && res.object;
      })[0];

      if (res && res.object) {
        // Obtener información del objeto seleccionado
        selectedObject = res.object;
        // selectedObject.material.color.set("#f00");
        console.log("Objeto seleccionado:", selectedObject);
        console.log("Id:", selectedObject.id);
        console.log("Posición actual:", selectedObject.position);
        // Modificar la distancia del objeto (ejemplo: alejarlo)
        // selectedObject.position.z += 1; // Aumenta la distancia en el eje Z
      }
    }
  };
  document.addEventListener("click", onMouseClick);
};

export default selectStar;

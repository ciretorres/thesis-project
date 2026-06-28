import { Raycaster, Vector2 } from "three";

const selectStar = (camera, group) => {
  const raycaster = new Raycaster();
  const pointer = new Vector2();

  let selectedObject = null;
  let hoveredObject = null;

  // Función para resetear el color de un objeto
  const resetColor = (object) => {
    object.material.color.set(0xffffff); // Blanco
  };

  // Función para cambiar el color a rojo (hover)
  const setHoverColor = (object) => {
    if (object !== selectedObject) {
      // No cambia si ya está seleccionado
      object.material.color.set(0xff0000); // Rojo
    }
  };

  // Función para cambiar el color a verde (selección)
  const setSelectedColor = (object) => {
    object.material.color.set(0x00ff00); // Verde
  };

  // Raycaster para detección de mouse hover
  const onPointerMove = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el raycaster
    raycaster.setFromCamera(pointer, camera);

    // Intersecta con los objetos en la escena
    const intersects = raycaster.intersectObject(group, true);

    if (intersects.length > 0) {
      // Obtener información del objeto seleccionado
      const res = intersects.filter(function (res) {
        return res && res.object;
      })[0];

      // Si el objeto hovered cambia, resetear el color del anterior hovered
      if (
        hoveredObject &&
        hoveredObject !== res.object &&
        hoveredObject !== selectedObject
      ) {
        resetColor(hoveredObject);
      }

      setHoverColor(res.object);
      hoveredObject = res.object;
    } else {
      // No hay hover en ningún objeto
      if (hoveredObject && hoveredObject !== selectedObject) {
        resetColor(hoveredObject);
        hoveredObject = null;
      }
    }
  };
  document.addEventListener("pointermove", onPointerMove);

  // Detección de clics en sprites
  const onMouseClick = (event) => {
    pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // Actualiza el raycaster
    raycaster.setFromCamera(pointer, camera);

    // Intersecta con los objetos en la escena
    const intersects = raycaster.intersectObject(group, true);

    if (intersects.length > 0) {
      // Obtener información del objeto seleccionado
      const clickedObject = intersects[0].object;

      // Si se hace click en un objeto ya seleccionado, lo deseleccionamos
      if (clickedObject === selectedObject) {
        resetColor(clickedObject);
        selectedObject = null;
      } else {
        // Resetear el color del objeto previamente seleccionado
        if (selectedObject) {
          resetColor(selectedObject);
        }

        setSelectedColor(clickedObject);
        selectedObject = clickedObject;

        console.log("selectedObject: ", selectedObject);
        console.log({
          HIP: selectedObject.HIP,
          RAhms: selectedObject.RAhms,
          DEdms: selectedObject.DEdms,
          Vmag: selectedObject.Vmag,
          ABSmag: selectedObject.ABSmag.toFixed(2),
          Pc: selectedObject.Pc.toFixed(2),
        });
      }
    } else {
      // Click fuera de cualquier objeto, deseleccionar
      if (selectedObject) {
        resetColor(selectedObject);
        selectedObject = null;
      }
    }
  };
  document.addEventListener("click", onMouseClick);

  // Limpiar eventos al destruir el componente o cuando ya no sea necesario
  return () => {
    document.removeEventListener("pointermove", onPointerMove);
    document.removeEventListener("click", onMouseClick);
  };
};

export default selectStar;

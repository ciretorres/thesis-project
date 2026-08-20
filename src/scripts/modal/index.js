let toogledModal = false;

export const toogleModal = () => {
  const dialogid = document.querySelector("#dialogid");

  if (toogledModal) {
    dialogid.style.display = "none";
    toogledModal = false;
  } else {
    dialogid.style.display = "block";
    toogledModal = true;
  }
};

// // módulo del diálogo modal
// const dialog = document.querySelector("#dialogid");
// // const showButton = document.querySelector("#dialogid + button");
// const closeButton = document.querySelector("#dialogid button");

// // "Show the dialog" button opens the dialog modally
// // showButton.addEventListener("click", () => {
// //   dialog.showModal();
// // });
// // abrir diálogo para editar estilo
// // dialog.show();

// // "Close" button closes the dialog
// closeButton.addEventListener("click", () => {
//   // dialog.close();
// });

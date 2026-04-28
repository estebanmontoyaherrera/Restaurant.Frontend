import Swal, { SweetAlertIcon } from "sweetalert2";


export function swalSmart({
  title,
  text,
  iconHtml,
  type,
  html,
  showCancelButton,
  showConfirmButton,
  cancelButtonText,
  confirmButtonText,
  timer,
  timerProgressBar,
  footer,
  actionsAtEndTimer,
}: {
  title?: string;
  iconHtml?: string;
  text?: string;
  type: SweetAlertIcon;
  html?: string;
  showCancelButton: boolean;
  showConfirmButton?: boolean;
  cancelButtonText?: string;
  confirmButtonText?: string;
  timer?: number;
  timerProgressBar?: boolean;
  footer?: string;
  actionsAtEndTimer?: any;
}) {
  if (title == undefined) {
    switch (type) {
      case "success":
        title = "¡Procesado con éxito!";
        break;

      case "error":
        title = "¡Ha ocurrido un error!";
        break;

      case "warning":
        title = "¡Atención!";
        break;

      case "info":
        title = "Información";
        break;

      case "question":
        title = "Confirmar";
        break;
    }
  }

  if (iconHtml == undefined) {
    switch (type) {
      case "success":
        iconHtml =
          '<img src="https://icons.veryicon.com/png/o/miscellaneous/batch-editor/success-38.png">';
        break;

      case "error":
        iconHtml =
          '<img src="https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-error-icon.png">';
        break;

      case "warning":
        iconHtml =
          '<img src="https://cdn-icons-png.flaticon.com/512/6897/6897039.png">';
        break;

      case "info":
        iconHtml =
          '<img src="https://cdn-icons-png.flaticon.com/512/6897/6897039.png">';
        break;

      case "question":
        iconHtml =
          '<img src="https://cdn3d.iconscout.com/3d/premium/thumb/question-mark-5590951-4652954.png">';
        break;
    }
  }

  let swalSamrtConfig = Swal.mixin({
    customClass: {
      popup: "rounded-xl",
      title: "text-am-main-blue text-xl",
      htmlContainer: "text-base",
      confirmButton:
        "px-5 h-10 m-1 bg-am-main-blue rounded-xl text-white inline-block font-medium hover:bg-am-main-blue-light",
      denyButton:
        "px-5 h-10 m-1 bg-am-red rounded-xl text-white inline-block font-medium hover:bg-am-red-light",
      cancelButton:
        "px-5 h-10 m-1 bg-grays-light text-white rounded-xl inline-block font-medium hover:bg-gray",
      input: "",
      timerProgressBar: "bg-am-main-blue-light rounded-b-xl",
    },
    buttonsStyling: false,
  });

  let swalSmart = swalSamrtConfig.fire({
    title: title,
    text: text,
    iconHtml: iconHtml,
    icon: type,
    html: html,
    showConfirmButton:
      showConfirmButton !== undefined ? showConfirmButton : true,
    showCancelButton: showCancelButton,
    allowOutsideClick: false,
    allowEscapeKey: false,
    timer: timer,
    timerProgressBar: timerProgressBar,
    cancelButtonText: cancelButtonText ? cancelButtonText : "Cancelar",
    confirmButtonText: confirmButtonText ? confirmButtonText : "Aceptar",
    footer: footer,
    willClose: actionsAtEndTimer
      ? () => {
        actionsAtEndTimer();
      }
      : () => { },
  });

  return swalSmart;
}

export const swalSamrtConfig = Swal.mixin({
  customClass: {
    popup: "rounded-xl",
    title: "text-am-main-blue text-xl",
    htmlContainer: "text-base",
    confirmButton:
      "px-5 h-10 m-1 bg-am-main-blue rounded-xl text-white inline-block font-medium hover:bg-am-main-blue-light",
    denyButton:
      "px-5 h-10 m-1 bg-am-red rounded-xl text-white inline-block font-medium hover:bg-am-red-light",
    cancelButton:
      "px-5 h-10 m-1 bg-grays-light text-white rounded-xl inline-block font-medium hover:bg-gray",
    input: "",
    timerProgressBar: "bg-am-main-blue-light rounded-b-xl",
  },
  cancelButtonText: "Cancelar",
  confirmButtonText: "Aceptar",
  buttonsStyling: false,
});
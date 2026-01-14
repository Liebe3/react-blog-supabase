import Swal from "sweetalert2";

//  Success notification
export const ShowSucess = (message: string) => {
  Swal.fire({
    icon: "success",
    text: message,
  });
};

//  Error notification
export const ShowError = (message: string) => {
  Swal.fire({
    icon: "error",
    text: message,
  });
};

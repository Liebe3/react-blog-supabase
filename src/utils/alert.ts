import Swal from "sweetalert2";
import type { AppDispatch } from "../store";

// Success notification
export const ShowSucess = (message: string) => {
  Swal.fire({
    icon: "success",
    text: message,
  });
};


 // Error notification
export const ShowError = (message: string) => {
  Swal.fire({
    icon: "error",
    text: message,
  });
};
export const ConfirmDelete = async (
  dispatch: AppDispatch,
  thunk: (id: string) => any,
  id: string,
  successMessage = "Item deleted successfully",
  setLoading?: (value: boolean) => void,
) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "This action cannot be undone.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#ef4444",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      if (setLoading) setLoading(true); // start loading
      await dispatch(thunk(id)).unwrap();
      ShowSucess(successMessage);
    } catch (error) {
      ShowError((error as string) || "Failed to delete");
    } finally {
      if (setLoading) setLoading(false); // stop loading
    }
  }
};

export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

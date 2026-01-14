import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { logoutThunk } from "../../../thunks/authThunks";
import { ShowError, ShowSucess } from "../../../utils/alert";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const result = await dispatch(logoutThunk());

      if (logoutThunk.fulfilled.match(result)) {
        ShowSucess("Logged out successfuly");
        navigate("/auth/login", { replace: true });
      } else {
        ShowError("Logout failed");
      }
    } catch (error) {
      console.error(error);
      ShowError("An error occured during logout");
    }
  };
  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
};

export default LogoutButton;

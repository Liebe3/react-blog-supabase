import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../store/hooks";
import { logoutThunk } from "../../../thunks/authThunks";

const LogoutButton = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await dispatch(logoutThunk());
    } catch (error) {
      console.error(error);
    } finally {
      navigate("/auth/login");
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

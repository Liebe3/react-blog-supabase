// App.tsx
import { BrowserRouter as Router } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { checkSessionThunk } from "./thunks/authThunks";
import Loading from "./pages/auth/components/Loading";
import BlogRoutes from "./pages/routes/BlogRoutes";

const App = () => {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkSessionThunk());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <Router>
      <BlogRoutes /> 
    </Router>
  );
};

export default App;

import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={"/auth/register"} element={<RegisterPage />} />
        <Route path={"/auth/login"} element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forum from "./pages/Forum";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";

function AppRoutes() {
  const { isAuthenticated, isLoading} = useAuth0();
  const navigate = useNavigate();

  useEffect( () => {
    if (!isLoading && isAuthenticated && window.location.pathname === "/"){
      navigate("/forum");
    }
  }, [isAuthenticated, isLoading, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forum" element={<Forum />} />
    </Routes>
  );

}

function App() {
  return (
    <Router>
      <AppRoutes/>
    </Router>
  );
}

export default App;

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from "react";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forum from "./pages/Forum";
import Post from "./pages/Post";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import LookProfile from "./pages/LookProfile";


function AppRoutes() {
  const { isLoading, isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirige a /forum después del callback de Auth0
    const params = new URLSearchParams(window.location.search);
    if (params.has('code') && params.has('state') && !isLoading && isAuthenticated) {
      navigate("/forum");
    }
  }, [isLoading, isAuthenticated, navigate]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forum" element={<Forum />} />
      <Route path="/post/:postId" element={<Post />} />
      <Route path="/create-post/" element={<CreatePost />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/look-profile/:username" element={<LookProfile />} />


    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;

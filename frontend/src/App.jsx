import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Forum from "./pages/Forum";
import Post from "./pages/Post"
import CreatePost from "./pages/CreatePost";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />           {/* Pantalla inicial */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forum" element={<Forum />} />    {/* Forum accessible després de login */}
        <Route path="/post/:postId" element={<Post />} />
        <Route path="/create-post/" element={<CreatePost />} />
      </Routes>
    </Router>
  );
}

export default App;

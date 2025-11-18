import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  // Carregar dades
  useEffect(() => {
    const savedName = localStorage.getItem("username");
    const savedBio = localStorage.getItem("bio");
    const savedAvatar = localStorage.getItem("avatar");
    const savedDate = localStorage.getItem("createdAt");

    if (savedName) setName(savedName);
    if (savedBio) setBio(savedBio);
    if (savedAvatar) setAvatar(savedAvatar);

    if (savedDate) {
      setCreatedAt(savedDate);
    } else {
      const now = new Date().toLocaleDateString();
      localStorage.setItem("createdAt", now);
      setCreatedAt(now);
    }
  }, []);

  // Guardar
  const handleSave = () => {
    if (!name.trim()) return;

    localStorage.setItem("username", name);
    localStorage.setItem("bio", bio);
    localStorage.setItem("avatar", avatar);

    navigate("/forum");
  };

  // Reset
  const handleReset = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("bio");
    localStorage.removeItem("avatar");
    navigate("/profile");
    window.location.reload();
  };

  // Pujar imatge de perfil
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f3f4f6"
    },
    card: {
      backgroundColor: "#fff",
      padding: 30,
      borderRadius: 12,
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      minWidth: 380,
      textAlign: "center"
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: 15,
      border: "3px solid #ff4500"
    },
    input: {
      width: "100%",
      padding: 10,
      marginTop: 10,
      borderRadius: 6,
      border: "1px solid #d1d5db"
    },
    textarea: {
      width: "100%",
      padding: 10,
      height: 80,
      resize: "none",
      marginTop: 10,
      borderRadius: 6,
      border: "1px solid #d1d5db"
    },
    button: {
      marginTop: 20,
      width: "100%",
      padding: "10px 20px",
      backgroundColor: "#ff4500",
      color: "white",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600
    },
    resetBtn: {
      marginTop: 10,
      backgroundColor: "#ddd",
      color: "#333"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2>Your Profile</h2>

        {/* Avatar */}
        <img
          src={avatar || "https://via.placeholder.com/110"}
          alt="avatar"
          style={styles.avatar}
        />
        <input 
          type="file" 
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginTop: 10 }}
        />

        {/* Name */}
        <label style={{ display: "block", marginTop: 20 }}>Name</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        {/* Bio */}
        <label style={{ display: "block", marginTop: 20 }}>Bio</label>
        <textarea
          style={styles.textarea}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell something about you..."
        />

        {/* Created date */}
        <p style={{ marginTop: 20, color: "#6b7280", fontSize: 14 }}>
          Account created: <strong>{createdAt}</strong>
        </p>

        {/* Buttons */}
        <button style={styles.button} onClick={handleSave}>
          Save
        </button>

        <button style={{ ...styles.button, ...styles.resetBtn }} onClick={handleReset}>
          Reset profile
        </button>
      </div>
    </div>
  );
}

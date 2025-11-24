import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
      const token = localStorage.getItem("jwtToken");
      if (!token) navigate("/login");
    }, []);
    
  // Carregar dades
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        setName("anonymous");
        setBio("");
        setAvatar("");
        return;
      }

      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch profile");

        const data = await res.json();
        setName(data.username || "anonymous");
        setBio(data.bio || "");
        setAvatar(data.avatar || "");
        setCreatedAt(data.created_at || "");
      } catch (err) {
        console.error(err);
        setName("anonymous");
        setBio("");
        setAvatar("");
      }
    };

    fetchProfile();
  }, []);

  // Guardar
  const handleSave = async () => {
    if (!name.trim()) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await fetch(`${process.env.REACT_APP_API_URL}/users/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ username: name, bio, avatar }),
      });

      if (!res.ok) throw new Error("Failed to update profile");
      const data = await res.json();

      // Guardar nou token i dades
      localStorage.setItem("jwtToken", data.token);
      localStorage.setItem("username", name);
      localStorage.setItem("bio", bio);
      localStorage.setItem("avatar", avatar);
      navigate("/forum");
    } catch (err) {
      console.error(err);
      alert("Error updating profile");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("username");
    localStorage.removeItem("bio");
    localStorage.removeItem("avatar");
    navigate("/login");
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
      backgroundColor: "#f3f4f6",
    },
    card: {
      backgroundColor: "#fff",
      padding: 30,
      borderRadius: 12,
      boxShadow: "0 3px 10px rgba(0,0,0,0.1)",
      minWidth: 380,
      textAlign: "center",
    },
    avatar: {
      width: 110,
      height: 110,
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: 15,
      border: "3px solid #ff4500",
    },
    input: {
      width: "100%",
      padding: 10,
      marginTop: 10,
      borderRadius: 6,
      border: "1px solid #d1d5db",
    },
    textarea: {
      width: "100%",
      padding: 10,
      height: 80,
      resize: "none",
      marginTop: 10,
      borderRadius: 6,
      border: "1px solid #d1d5db",
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
      fontWeight: 600,
    },
    logoutBtn: {
      marginTop: 10,
      width: "100%",
      padding: "10px 20px",
      backgroundColor: "#ddd",
      color: "#333",
      border: "none",
      borderRadius: 8,
      cursor: "pointer",
      fontWeight: 600,
    },
  };

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate("/forum")}
        style={{
          position: "absolute",
          top: 20,
          left: 20,
          background: "transparent",
          border: "none",
          fontSize: 18,
          cursor: "pointer",
          color: "#ff4500",
          fontWeight: "bold",
        }}
      >
        ← Forum
      </button>

      <div style={styles.card}>
        <h2>Your Profile</h2>

        <img
          src={avatar || "https://cdn-icons-png.flaticon.com/512/847/847969.png"}
          alt="avatar"
          style={styles.avatar}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ marginTop: 10 }}
        />

        <label style={{ display: "block", marginTop: 20 }}>Name</label>
        <input
          style={styles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label style={{ display: "block", marginTop: 20 }}>Bio</label>
        <textarea
          style={styles.textarea}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell something about you..."
        />

        <p style={{ marginTop: 20, color: "#6b7280", fontSize: 14 }}>
          Account created: <strong>{createdAt}</strong>
        </p>

        <button style={styles.button} onClick={handleSave}>
          Save
        </button>

        <button style={styles.logoutBtn} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

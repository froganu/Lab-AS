import { useNavigate } from "react-router-dom";

export default function LookProfile() {
  const navigate = useNavigate();

  const username = localStorage.getItem("username") ?? "anonymous";
  const bio = localStorage.getItem("bio") ?? "This user hasn't written a bio yet.";
  const avatar = localStorage.getItem("avatar") ?? null; // URL o null

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
      borderRadius: 8,
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      minWidth: 320,
      textAlign: "center"
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: "50%",
      objectFit: "cover",
      marginBottom: 20,
      backgroundColor: "#d1d5db"
    },
    name: { fontSize: 24, fontWeight: 700, marginBottom: 10 },
    bio: { fontSize: 14, color: "#6b7280", marginBottom: 20 },
    button: {
      padding: "10px 20px",
      backgroundColor: "#ff4500",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 600
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {avatar && <img src={avatar} alt="Avatar" style={styles.avatar} />}
        <div style={styles.name}>{username}</div>
        <div style={styles.bio}>{bio}</div>
        <button style={styles.button} onClick={() => navigate("/forum")}>
          Back to Forum
        </button>
      </div>
    </div>
  );
}

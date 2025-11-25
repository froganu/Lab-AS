import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function LookProfile() {
  const { username: profileUsername } = useParams();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${profileUsername}`);
        if (!res.ok) throw new Error("Usuari no trobat");
        const data = await res.json();
        setUsername(data.username);
        setBio(data.bio || "This user hasn't written a bio yet.");
        setAvatar(data.avatar);
      } catch (err) {
        console.error(err);
        setUsername("anonymous");
        setBio("This user hasn't written a bio yet.");
      }
    };

    const fetchUserPosts = async () => {
      try {
        setLoadingPosts(true);
        const res = await fetch(`${process.env.REACT_APP_API_URL}/users/${profileUsername}/posts`);
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingPosts(false);
      }
    };

    if (profileUsername) {
      fetchProfile();
      fetchUserPosts();
    }
  }, [profileUsername]);

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#f3f4f6",
      padding: 16
    },
    card: {
      backgroundColor: "#fff",
      padding: 30,
      borderRadius: 8,
      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
      maxWidth: 600,
      width: "100%"
    },
    profileSection: {
      textAlign: "center",
      marginBottom: 30,
      paddingBottom: 20,
      borderBottom: "1px solid #e5e7eb"
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
    postsSection: {
      marginBottom: 20
    },
    postsTitle: {
      fontSize: 18,
      fontWeight: 600,
      marginBottom: 15
    },
    postItem: {
      padding: 15,
      marginBottom: 10,
      backgroundColor: "#f9fafb",
      borderRadius: 6,
      cursor: "pointer",
      transition: "background-color 0.2s"
    },
    postTitle: {
      fontSize: 16,
      fontWeight: 600,
      marginBottom: 5,
      color: "#111827"
    },
    postDate: {
      fontSize: 12,
      color: "#9ca3af"
    },
    noPostsText: {
      fontSize: 14,
      color: "#6b7280",
      fontStyle: "italic",
      textAlign: "center",
      padding: 20
    },
    button: {
      padding: "10px 20px",
      backgroundColor: "#ff4500",
      color: "white",
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      fontWeight: 600,
      width: "100%"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.profileSection}>
          {avatar && <img src={avatar} alt="Avatar" style={styles.avatar} />}
          <div style={styles.name}>{username}</div>
          <div style={styles.bio}>{bio}</div>
        </div>

        <div style={styles.postsSection}>
          <div style={styles.postsTitle}>Posts ({posts.length})</div>
          {loadingPosts ? (
            <div style={styles.noPostsText}>Loading posts...</div>
          ) : posts.length === 0 ? (
            <div style={styles.noPostsText}>No posts yet</div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                style={styles.postItem}
                onClick={() => navigate(`/post/${post.id}`)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f3f4f6"}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#f9fafb"}
              >
                <div style={styles.postTitle}>{post.title}</div>
                <div style={styles.postDate}>
                  {new Date(post.created_at).toLocaleDateString()}
                </div>
              </div>
            ))
          )}
        </div>

        <button style={styles.button} onClick={() => navigate("/forum")}>
          Back to Forum
        </button>
      </div>
    </div>
  );
}

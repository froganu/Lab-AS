import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const formatRelativeTime = (dateString) => {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  }
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  return created.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

export default function Forum() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [userData, setUserData] = useState(null);
  const [editingPostId, setEditingPostId] = useState(null);
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const [editedTitle, setEditedTitle] = useState("");

  useEffect(() => {
    const url = `${process.env.REACT_APP_API_URL}/users/data`;
    const token = localStorage.getItem("jwtToken");
    fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`, // ajusta el método de autenticación según tu lógica
      },
    })
      .then((res) => res.json())
      .then((data) => setUserData(data))
      .catch((err) => {
        console.error(err);
        setUserData(null);
      });
  }, []);

  // Fetch posts
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) navigate("/login");
    const url = `${process.env.REACT_APP_API_URL}/posts/`;

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownOpenId !== null) {
        const dropdownElement = document.getElementById(`dropdown-${dropdownOpenId}`);
        if (dropdownElement && !dropdownElement.contains(event.target)) {
          setDropdownOpenId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpenId]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("You must be logged in");

    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      setPosts(posts.filter((p) => p.id !== postId));
    } else {
      alert("Failed to delete post");
    }
  };

  const handleSaveTitle = async (postId) => {
    if (!editedTitle.trim()) return alert("[translate:Title no puede estar vacío]");

    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("[translate:Debes iniciar sesión]");

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: editedTitle }),
      });

      if (response.ok) {
        setPosts((prevPosts) =>
          prevPosts.map((p) => (p.id === postId ? { ...p, title: editedTitle } : p))
        );
        setEditingPostId(null);
        setDropdownOpenId(null);
      } else {
        alert("[translate:Error al actualizar título]");
      }
    } catch {
      alert("[translate:Error al conectar con el servidor]");
    }
  };

  const styles = {
    topbar: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 16px",
      borderBottom: "1px solid #e5e7eb",
      backgroundColor: "#ffffff",
      position: "sticky",
      top: 0,
    },
    brand: { textDecoration: "none", color: "#111827", fontWeight: 700 },
    search: { flex: 1 },
    searchInput: {
      width: "100%",
      padding: "8px 12px",
      border: "1px solid #d1d5db",
      borderRadius: 999,
      outline: "none",
      font: "inherit",
    },
    actions: { display: "flex", gap: 8 },
    btn: {
      height: 34,
      padding: "0 12px",
      border: "1px solid #d1d5db",
      backgroundColor: "#fff",
      borderRadius: 999,
      cursor: "pointer",
      font: "inherit",
    },
    primary: { backgroundColor: "#ff4500", borderColor: "#ff4500", color: "#fff" },

    listWrap: { padding: 0 },
    list: { listStyle: "none", margin: 0, padding: 0, display: "block" },

    card: {
      width: "90%",
      maxWidth: 720,
      margin: "0 auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      backgroundColor: "#fff",
      padding: 16,
      boxSizing: "border-box",
      transition: "background-color 0.2s ease, box-shadow 0.2s ease",
      cursor: "pointer",
    },

    cardHovered: {
      backgroundColor: "#f9fafb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    },

    separator: { height: 1, backgroundColor: "#e5e7eb", margin: "0", width: "100%" },

    headerRow: {
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },

    img: {
      width: "100%",
      height: "auto",
      maxHeight: 600,
      objectFit: "cover",
      borderRadius: 6,
      display: "block",
      margin: "12px 0",
    },

    title: { margin: "8px 0", fontSize: 18, color: "#111827", fontWeight: 600 },
    meta: {
      fontSize: 12,
      color: "#6b7280",
      margin: "4px 0",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    postLink: { textDecoration: "none", color: "inherit", width: "100%" },
  };

  return (
    <>
      <header style={styles.topbar}>
        <a style={styles.brand} href="/">
          MyForum
        </a>
        <form style={styles.search} role="search">
          <input
            type="search"
            placeholder="Search"
            aria-label="Search"
            style={styles.searchInput}
          />
        </form>
        <nav style={styles.actions}>
          <button type="button" style={styles.btn} onClick={() => navigate("/profile")}>
            Profile
          </button>
          <button
            type="button"
            style={{ ...styles.btn, ...styles.primary }}
            onClick={() => navigate("/create-post")}
          >
            Post
          </button>
        </nav>
      </header>

      <section style={styles.listWrap}>
        <ul style={styles.list}>
          {posts.map((p, idx) => (
            <React.Fragment key={p.id}>
              <li
                style={{
                  ...styles.card,
                  ...(hoveredPost === p.id ? styles.cardHovered : {}),
                }}
                onMouseEnter={() => setHoveredPost(p.id)}
                onMouseLeave={() => setHoveredPost(null)}
                onClick={() => {
                  if (!editingPostId) navigate(`/post/${p.id}`);
                }}
              >
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {p.avatar && (
                      <img
                        src={p.avatar}
                        alt="Avatar"
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                    <div>
                      <a
                        href={`/look-profile/${p.username}`}
                        style={{ fontWeight: 600, color: "#111827", textDecoration: "none" }}
                      >
                        {p.username ?? "anonymous"}
                      </a>
                    </div>
                  </div>

                  {(userData?.role === "admin" || userData?.id === p.user_id) && (
                    <div
                      id={`dropdown-${p.id}`}
                      style={{ position: "relative" }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDropdownOpenId(dropdownOpenId === p.id ? null : p.id);
                        }}
                        title="[translate:Opciones]"
                        aria-label="[translate:Opciones del post]"
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          marginLeft: 8,
                          fontSize: 24,
                          lineHeight: 1,
                          padding: 0,
                        }}
                      >
                        &#8942;
                      </button>

                      {dropdownOpenId === p.id && (
                        <div
                          style={{
                            position: "absolute",
                            top: "100%",
                            right: 0,
                            backgroundColor: "white",
                            border: "1px solid #d1d5db",
                            borderRadius: 4,
                            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            zIndex: 10,
                            minWidth: 120,
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              textAlign: "left",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              font: "inherit",
                            }}
                            onClick={() => {
                              setDropdownOpenId(null);
                              setEditingPostId(p.id);
                              setEditedTitle(p.title);
                            }}
                          >
                            Editar
                          </button>
                          <button
                            style={{
                              width: "100%",
                              padding: "8px 12px",
                              textAlign: "left",
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              color: "red",
                              font: "inherit",
                            }}
                            onClick={() => {
                              setDropdownOpenId(null);
                              handleDelete(p.id);
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingPostId === p.id ? (
                  <div>
                    <input
                      type="text"
                      value={editedTitle}
                      onChange={(e) => setEditedTitle(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        fontSize: 18,
                        fontWeight: 600,
                        margin: "8px 0",
                      }}
                      autoFocus
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div style={{ display: "flex", justifyContent: "center", gap: 8 }}>
                      <button
                        onClick={() => handleSaveTitle(p.id)}
                        style={{ ...styles.btn, ...styles.primary, padding: "6px 12px" }}
                      >
                       Guardar
                      </button>
                      <button
                        onClick={() => setEditingPostId(null)}
                        style={{ ...styles.btn, padding: "6px 12px" }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p style={styles.title}>{p.title}</p>
                )}

                <img src={p.image_url} alt={p.title} style={styles.img} />

                <p style={styles.meta}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ verticalAlign: "middle", marginRight: 4 }}
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {p.commentCount ?? 0}
                </p>
              </li>

              {idx < posts.length - 1 && <div style={styles.separator} />}
            </React.Fragment>
          ))}
        </ul>
      </section>
    </>
  );
}

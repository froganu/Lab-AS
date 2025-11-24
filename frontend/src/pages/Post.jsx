import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);

  // Para edición de comentarios:
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editedCommentContent, setEditedCommentContent] = useState("");
  const [dropdownOpenId, setDropdownOpenId] = useState(null);
  const dropdownRefs = useRef({}); // refs para cada dropdown de comentario

  // Cierra menús desplegables si clicas fuera
  useEffect(() => {
    function handleClickOutside(event) {
      for(const key in dropdownRefs.current) {
        if (
          dropdownRefs.current[key] &&
          !dropdownRefs.current[key].contains(event.target)
        ) {
          setDropdownOpenId(null);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this comment?"
    );
    if (!confirmDelete) return;

    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("You must be logged in");

    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      setComments(comments.filter((c) => c.id !== commentId));
      if (editingCommentId === commentId) setEditingCommentId(null);
    } else {
      alert("Failed to delete comment");
    }
  };


  const getToken = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("You must be logged in");
      throw new Error("No token");
    }
    return token;
  };


  const handleEditSave = async (commentId) => {
    if (!editedCommentContent.trim())
      return alert("Comment content cannot be empty");

    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("You must be logged in");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments/${commentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ content: editedCommentContent }),
        }
      );

      if (response.ok) {
        setComments((prevComments) =>
          prevComments.map((c) =>
            c.id === commentId ? { ...c, content: editedCommentContent } : c
          )
        );
        setEditingCommentId(null);
        setDropdownOpenId(null);
      } else {
        const data = await response.json();
        alert(data.message || "Error updating comment");
      }
    } catch {
      alert("Error connecting to server");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("You must be logged in");

    fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data);
        setComments(data.comments);
      });
  }, [postId]);

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setIsAdmin(false);
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/auth/admin`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Response not ok");
        return res.json();
      })
      .then((data) => {
        setIsAdmin(!!data.isAdmin);
      })
      .catch(() => {
        setIsAdmin(false);
      });
  }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!newComment.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem("jwtToken");
    if (!token) return alert("You must be logged in");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/comments/${postId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_id: 1, // TODO: Replace with actual authenticated user ID
            content: newComment,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to post comment");
      }

      const newCommentObj = {
        id: data.commentId,
        user_id: 1,
        username: localStorage.getItem("username") ?? "anonymous",
        content: newComment,
        created_at: new Date().toISOString(),
      };

      setComments([newCommentObj, ...comments]);
      setNewComment("");
      setIsSubmitting(false);
    } catch (err) {
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  if (!post) return <div>Loading...</div>;

  const styles = {
    commentForm: {
      marginTop: 24,
      padding: 16,
      backgroundColor: "#f9fafb",
      borderRadius: 8,
      border: "1px solid #e5e7eb",
    },
    textarea: {
      width: "100%",
      padding: "10px 12px",
      fontSize: 14,
      border: "1px solid #d1d5db",
      borderRadius: 6,
      outline: "none",
      fontFamily: "inherit",
      minHeight: 80,
      resize: "vertical",
      boxSizing: "border-box",
    },
    buttonGroup: {
      display: "flex",
      justifyContent: "flex-end",
      gap: 8,
      marginTop: 8,
    },
    button: {
      padding: "8px 16px",
      fontSize: 14,
      fontWeight: 500,
      border: "none",
      borderRadius: 6,
      cursor: "pointer",
      transition: "background-color 0.2s",
    },
    submitButton: {
      backgroundColor: "#ff4500",
      color: "#fff",
    },
    cancelButton: {
      backgroundColor: "#fff",
      color: "#374151",
      border: "1px solid #d1d5db",
    },
    error: {
      padding: 8,
      backgroundColor: "#fee2e2",
      color: "#991b1b",
      borderRadius: 6,
      fontSize: 12,
      marginBottom: 8,
    },
    commentsHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 32,
      marginBottom: 16,
    },
    commentsList: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    commentItem: {
      padding: 12,
      borderBottom: "1px solid #e5e7eb",
    },
    dropdownBtn: {
      background: "none",
      border: "none",
      cursor: "pointer",
      marginLeft: 8,
      fontSize: 24,
      lineHeight: 1,
      padding: 0,
    },
    dropdownMenu: {
      position: "absolute",
      top: "100%",
      right: 0,
      backgroundColor: "white",
      border: "1px solid #d1d5db",
      borderRadius: 4,
      boxShadow: "0 2px 6px rgba(0, 0, 0, 0.15)",
      zIndex: 10,
      minWidth: 120,
    },
  };

  return (
    <>
      <Link
        to="/forum"
        style={{
          position: "fixed",
          top: 16,
          left: 16,
          textDecoration: "none",
          color: "#ff4500",
          fontSize: 16,
          fontWeight: 500,
          zIndex: 1000,
        }}
      >
        ← Back to forum
      </Link>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: 16, paddingTop: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          {localStorage.getItem("avatar") && (
            <img
              src={localStorage.getItem("avatar")}
              alt="Avatar"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
            />
          )}
          <div>
            <Link
              to={`/look-profile/${post.username}`}
              style={{ fontWeight: 600, color: "#111827", textDecoration: "none" }}
            >
              {post.username ?? "anonymous"}
            </Link>
            <div style={{ fontSize: 12, color: "#6b7280" }}>{localStorage.getItem("bio") ?? ""}</div>
          </div>
        </div>

        <h1>{post.title}</h1>

        {post.image_url && (
          <img src={post.image_url} alt={post.title} style={{ width: "100%", borderRadius: 6 }} />
        )}

        {post.description && (
          <p style={{ marginTop: 16, color: "#374151" }}>{post.description}</p>
        )}

        {/* Comment form */}
        <div style={styles.commentForm}>
          <h3 style={{ margin: "0 0 12px 0", fontSize: 16, fontWeight: 600 }}>
            Add a comment
          </h3>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleCommentSubmit}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="What are your thoughts?"
              style={styles.textarea}
              disabled={isSubmitting}
            />
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                style={{ ...styles.button, ...styles.submitButton }}
                disabled={isSubmitting || !newComment.trim()}
              >
                {isSubmitting ? "Posting..." : "Comment"}
              </button>
            </div>
          </form>
        </div>

        {/* Comments section */}
        <div style={styles.commentsHeader}>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>
            Comments ({comments.length})
          </h2>
        </div>

        <ul style={styles.commentsList}>
          {comments.length === 0 ? (
            <li style={{ padding: 12, textAlign: "center", color: "#6b7280" }}>
              No comments yet. Be the first to comment!
            </li>
          ) : (
            comments.map((c) => (
              <li
                key={c.id}
                style={{ ...styles.commentItem, position: "relative" }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <p style={{ margin: 0, fontSize: 12, color: "#6b7280" }}>
                    {c.username ?? "anonymous"}
                  </p>

                  {isAdmin && (
                    <div
                      ref={(el) => (dropdownRefs.current[c.id] = el)}
                      onClick={(e) => e.stopPropagation()}
                      style={{ position: "relative" }}
                    >
                      <button
                        onClick={() =>
                          setDropdownOpenId(dropdownOpenId === c.id ? null : c.id)
                        }
                        title="Opciones"
                        style={styles.dropdownBtn}
                        aria-label="Opciones del comentario"
                      >
                        &#8942;
                      </button>

                      {dropdownOpenId === c.id && (
                        <div style={styles.dropdownMenu}>
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
                              setEditingCommentId(c.id);
                              setDropdownOpenId(null);
                              setEditedCommentContent(c.content);
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
                              handleDelete(c.id);
                            }}
                          >
                            Eliminar
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {editingCommentId === c.id ? (
                  <>
                    <textarea
                      value={editedCommentContent}
                      onChange={(e) => setEditedCommentContent(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "8px 12px",
                        fontSize: 14,
                        fontFamily: "inherit",
                        resize: "vertical",
                        minHeight: 70,
                        marginTop: 8,
                        borderRadius: 6,
                        border: "1px solid #d1d5db",
                        outline: "none",
                        boxSizing: "border-box",
                      }}
                      autoFocus
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "flex-end",
                        gap: 8,
                        marginTop: 4,
                      }}
                    >
                      <button
                        onClick={() => handleEditSave(c.id)}
                        style={{
                          ...styles.button,
                          ...styles.submitButton,
                          padding: "6px 12px",
                        }}
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingCommentId(null)}
                        style={{
                          ...styles.button,
                          ...styles.cancelButton,
                          padding: "6px 12px",
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </>
                ) : (
                  <p style={{ marginTop: 8 }}>{c.content}</p>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
}

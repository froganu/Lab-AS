import { useEffect, useState } from "react";
import { useParams, Link } from 'react-router-dom';

export default function Post() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

   const handleDelete = async (commentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this comment?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) return alert('You must be logged in');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      setComments(comments.filter(c => c.id !== commentId));
    } else {
      alert('Failed to delete comment');
    }
  };

  

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) return alert('You must be logged in');

    fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setPost(data);
        setComments(data.comments);
      });
  }, [postId]);

  useEffect(() => {
      const token = localStorage.getItem('jwtToken');
      if (!token) {
        console.log('No token found');
        setIsAdmin(false);
        return;
      }
  
      fetch(`${process.env.REACT_APP_API_URL}/auth/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Response not ok');
          return res.json();
        })
        .then(data => {
          console.log('isAdmin response:', data);
          setIsAdmin(!!data.isAdmin);
        })
        .catch(error => {
          console.error('Error fetching isAdmin:', error);
          setIsAdmin(false);
        });
    }, []);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newComment.trim()) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);

    const token = localStorage.getItem('jwtToken');
    if (!token) return alert('You must be logged in');

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/${postId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          user_id: 1, // TODO: Replace with actual authenticated user ID
          content: newComment
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post comment');
      }

      // Add new comment to the list (optimistic update)
      const newCommentObj = {
        id: data.commentId,
        user_id: 1,
        username: localStorage.getItem("username") ?? "anonymous",
        content: newComment,
        created_at: new Date().toISOString()
      };

      setComments([newCommentObj, ...comments]); // Add to top
      setNewComment(''); // Clear input
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
      backgroundColor: '#f9fafb',
      borderRadius: 8,
      border: '1px solid #e5e7eb'
    },
    textarea: {
      width: '100%',
      padding: '10px 12px',
      fontSize: 14,
      border: '1px solid #d1d5db',
      borderRadius: 6,
      outline: 'none',
      fontFamily: 'inherit',
      minHeight: 80,
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    buttonGroup: {
      display: 'flex',
      justifyContent: 'flex-end',
      gap: 8,
      marginTop: 8
    },
    button: {
      padding: '8px 16px',
      fontSize: 14,
      fontWeight: 500,
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    submitButton: {
      backgroundColor: '#ff4500',
      color: '#fff'
    },
    cancelButton: {
      backgroundColor: '#fff',
      color: '#374151',
      border: '1px solid #d1d5db'
    },
    error: {
      padding: 8,
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      borderRadius: 6,
      fontSize: 12,
      marginBottom: 8
    },
    commentsHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 32,
      marginBottom: 16
    },
    commentsList: {
      listStyle: 'none',
      padding: 0,
      margin: 0
    },
    commentItem: {
      padding: 12,
      borderBottom: '1px solid #e5e7eb'
    }
  };

  return (
    <>
      <Link 
        to="/forum" 
        style={{ 
          position: 'fixed',
          top: 16,
          left: 16,
          textDecoration: 'none', 
          color: '#ff4500',
          fontSize: 16,
          fontWeight: 500,
          zIndex: 1000
        }}
      >
        ← Back to forum
      </Link>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: 16, paddingTop: 48 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          {localStorage.getItem("avatar") && (
            <img
              src={localStorage.getItem("avatar")}
              alt="Avatar"
              style={{ width: 32, height: 32, borderRadius: "50%", objectFit: "cover" }}
            />
          )}
          <div>
            <Link to="/look-profile" style={{ fontWeight: 600, color: "#111827", textDecoration: "none" }}>
              {post.username ?? "anonymous"}
            </Link>
            <div style={{ fontSize: 12, color: "#6b7280" }}>
              {localStorage.getItem("bio") ?? ""}
            </div>
          </div>
        </div>

        <h1>{post.title}</h1>
        
        {post.image_url && <img src={post.image_url} alt={post.title} style={{ width: '100%', borderRadius: 6 }} />}

        {post.description && <p style={{ marginTop: 16, color: '#374151' }}>{post.description}</p>}

        {/* Comment form */}
        <div style={styles.commentForm}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: 16, fontWeight: 600 }}>Add a comment</h3>
          
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
                {isSubmitting ? 'Posting...' : 'Comment'}
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
            <li style={{ padding: 12, textAlign: 'center', color: '#6b7280' }}>
              No comments yet. Be the first to comment!
            </li>
          ) : (
            comments.map(c => (
              <li key={c.id} style={styles.commentItem}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ margin: 0, fontSize: 12, color: '#6b7280' }}>
                    {c.username ?? "anonymous"}
                  </p>
                  {isAdmin && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        handleDelete(c.id);
                      }}
                      title="Delete comment"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        marginLeft: 8,
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="red"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-trash-2"
                        viewBox="0 0 24 24"
                      >
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-2 14H7L5 6" />
                        <path d="M10 11v6M14 11v6" />
                        <path d="M9 6V4h6v2" />
                      </svg>
                    </button>
                  )}
                </div>
                <p style={{ margin: '4px 0 0 0' }}>{c.content}</p>
              </li>

            ))
          )}
        </ul>
      </div>
    </>
  );
}

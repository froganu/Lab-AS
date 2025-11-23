import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';


const formatRelativeTime = (dateString) => {
  const now = new Date();
  const created = new Date(dateString);
  const diffMs = now - created;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);

  // Below 1 minute: show seconds
  if (diffSecs < 60) {
    return `${diffSecs}s ago`;
  }
  // Below 1 hour: show minutes
  if (diffMins < 60) {
    return `${diffMins}m ago`;
  }
  // Below 24 hours: show hours
  if (diffHours < 24) {
    return `${diffHours}h ago`;
  }
  // 24 hours or more: show date
  return created.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};


export default function Forum() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [hoveredPost, setHoveredPost] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("anonymous");

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (!confirmDelete) return;

    const token = localStorage.getItem('jwtToken');
    if (!token) return alert('You must be logged in');

    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts/${postId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      setPosts(posts.filter(p => p.id !== postId));
    } else {
      alert('Failed to delete post');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    const url = `${process.env.REACT_APP_API_URL}/posts/`;

    fetch(url, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

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

  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      setUsername("anonymous");
      return;
    }

    fetch(`${process.env.REACT_APP_API_URL}/token/username`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch username");
        return res.json();
      })
      .then(data => {
        setUsername(data.username || "anonymous");
      })
      .catch(() => {
        setUsername("anonymous");
      });
  }, []);



  const styles = {
    topbar: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#ffffff', position: 'sticky', top: 0 },
    brand: { textDecoration: 'none', color: '#111827', fontWeight: 700 },
    search: { flex: 1 },
    searchInput: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 999, outline: 'none', font: 'inherit' },
    actions: { display: 'flex', gap: 8 },
    btn: { height: 34, padding: '0 12px', border: '1px solid #d1d5db', backgroundColor: '#fff', borderRadius: 999, cursor: 'pointer', font: 'inherit' },
    primary: { backgroundColor: '#ff4500', borderColor: '#ff4500', color: '#fff' },

    listWrap: { padding: 0 },
    list: { listStyle: 'none', margin: 0, padding: 0, display: 'block' },

    card: {
      width: '90%',
      maxWidth: 720,
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',  // centers all content horizontally
      textAlign: 'center',   // centers text
      backgroundColor: '#fff',
      padding: 16,
      boxSizing: 'border-box',
      transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
      cursor: 'pointer'
    },
    
    cardHovered: {
      backgroundColor: '#f9fafb',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
    },

    separator: { height: 1, backgroundColor: '#e5e7eb', margin: '0', width: '100%' },
    
    headerRow: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'  // center the username/time
    },

    img: {
      width: '100%',
      height: 'auto',
      maxHeight: 600,      // increased from 480 for bigger display
      objectFit: 'cover',
      borderRadius: 6,
      display: 'block',
      margin: '12px 0'
    },

    title: { margin: '8px 0', fontSize: 18, color: '#111827', fontWeight: 600 },
    meta: { fontSize: 12, color: '#6b7280', margin: '4px 0', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    postLink: { textDecoration: 'none', color: 'inherit', width: '100%' }
  };


  return (
    <>
      <header style={styles.topbar}>
        <a style={styles.brand} href="/">MyForum</a>
        <form style={styles.search} role="search">
          <input type="search" placeholder="Search" aria-label="Search" style={styles.searchInput} />
        </form>
        <nav style={styles.actions}>
          <button
          type="button"
          style={styles.btn}
          onClick={() => navigate("/profile")}
          >
            Profile
          </button>
          <button 
            type="button" 
            style={{ ...styles.btn, ...styles.primary }}
            onClick={() => navigate('/create-post')}
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
                  ...(hoveredPost === p.id ? styles.cardHovered : {})
                }}
                onMouseEnter={() => setHoveredPost(p.id)}
                onMouseLeave={() => setHoveredPost(null)}
                onClick={() => navigate(`/post/${p.id}`)}
              >
                {/* header row with username on the left */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {localStorage.getItem('avatar') && (
                      <img
                        src={localStorage.getItem('avatar')}
                        alt="Avatar"
                        style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <a 
                        href="/look-profile" 
                        style={{ fontWeight: 600, color: '#111827', textDecoration: 'none' }}
                      >
                        {p.username ?? "anonymous"}
                      </a>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {localStorage.getItem('bio') ?? ''}
                      </div>
                    </div>
                  </div>
                  {isAdmin && (
                  <button
                    onClick={e => {
                      e.stopPropagation(); // prevent li onClick
                      handleDelete(p.id);
                    }}
                    title="Delete post"
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

                <p style={styles.title}>{p.title}</p>
                <img src={p.image_url} alt={p.title} style={styles.img} />

                {/* comment count */}
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
                    style={{ verticalAlign: 'middle', marginRight: 4 }}
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {p.commentCount ?? 0}
                </p>
              </li>
              
              {/* separator between posts (not after last) */}
              {idx < posts.length - 1 && (
                <div style={styles.separator} />
              )}
            </React.Fragment>
          ))}
        </ul>
      </section>
    </>
  );
}

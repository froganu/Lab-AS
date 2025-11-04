import { useEffect, useState } from "react";

export default function Forum() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    // Option A: distinct path
    // const url = `${process.env.REACT_APP_API_URL}/posts/with-comments`;

    // Option B: query flag (pick the one you implemented on the server)
    const url = `${process.env.REACT_APP_API_URL}/posts/comments`;

    fetch(url)
      .then(res => res.json())
      .then(data => setPosts(data));
  }, []);

  const styles = {
    topbar: { display: 'flex', alignItems: 'center', gap: 12, padding: '10px 16px', borderBottom: '1px solid #e5e7eb', background: '#ffffff', position: 'sticky', top: 0 },
    brand: { textDecoration: 'none', color: '#111827', fontWeight: 700 },
    search: { flex: 1 },
    searchInput: { width: '100%', padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: 999, outline: 'none', font: 'inherit' },
    actions: { display: 'flex', gap: 8 },
    btn: { height: 34, padding: '0 12px', border: '1px solid #d1d5db', background: '#fff', borderRadius: 999, cursor: 'pointer', font: 'inherit' },
    primary: { background: '#ff4500', borderColor: '#ff4500', color: '#fff' },
    listWrap: { padding: '16px 0' },
    list: { display: 'grid', gridTemplateColumns: '1fr', gap: 16, padding: 16, maxWidth: 680, margin: '0 auto' },
    card: { display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: 12 },
    img: { width: '100%', height: 260, objectFit: 'cover', borderRadius: 6 },
    title: { margin: 0, fontSize: 16, color: '#111827' },
    meta: { fontSize: 12, color: '#6b7280', margin: 0 },
    commentBox: { width: '100%', textAlign: 'left', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 6, padding: 8 }
  };

  return (
    <>
      <header style={styles.topbar}>
        <a style={styles.brand} href="/">MyForum</a>
        <form style={styles.search} role="search">
          <input type="search" placeholder="Search" aria-label="Search" style={styles.searchInput} />
        </form>
        <nav style={styles.actions}>
          <button type="button" style={styles.btn}>Profile</button>
          <button type="button" style={{ ...styles.btn, ...styles.primary }}>Post</button>
        </nav>
      </header>

      <section style={styles.listWrap}>
        <ul style={styles.list}>
          {posts.map(p => (
            <li key={p.id} style={styles.card}>
              <img src={p.image_url} alt={p.title} style={styles.img} />
              <p style={styles.title}>{p.title}</p>

              {/* comment count */}
              <p style={styles.meta}>
                {typeof p.commentCount === 'number' ? `${p.commentCount} comments` : '0 comments'}
              </p>

              {/* single preview comment */}
              {p.commentPreview && (
                <div style={styles.commentBox}>
                  <p style={{ margin: 0 }}>{p.commentPreview.content}</p>
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

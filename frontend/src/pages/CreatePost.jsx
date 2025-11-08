import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: 1, // TODO: Get from auth context/session
    title: '',
    description: '',
    image_url: '',
    tags: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.image_url) {
      setError('Image URL is required');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error creating post');
      }

      // Success - redirect to the new post
      navigate(`/post/${data.postId}`);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: 720,
      margin: '0 auto',
      padding: 16
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 24
    },
    title: {
      margin: 0,
      fontSize: 24,
      fontWeight: 600,
      color: '#111827'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    },
    label: {
      fontSize: 14,
      fontWeight: 500,
      color: '#374151'
    },
    required: {
      color: '#ff4500'
    },
    input: {
      padding: '10px 12px',
      fontSize: 14,
      border: '1px solid #d1d5db',
      borderRadius: 8,
      outline: 'none',
      fontFamily: 'inherit'
    },
    textarea: {
      padding: '10px 12px',
      fontSize: 14,
      border: '1px solid #d1d5db',
      borderRadius: 8,
      outline: 'none',
      fontFamily: 'inherit',
      minHeight: 100,
      resize: 'vertical'
    },
    error: {
      padding: 12,
      backgroundColor: '#fee2e2',
      color: '#991b1b',
      borderRadius: 8,
      fontSize: 14
    },
    buttonGroup: {
      display: 'flex',
      gap: 12,
      marginTop: 8
    },
    button: {
      padding: '10px 20px',
      fontSize: 14,
      fontWeight: 500,
      border: 'none',
      borderRadius: 8,
      cursor: 'pointer',
      transition: 'background-color 0.2s'
    },
    submitButton: {
      backgroundColor: '#ff4500',
      color: '#fff',
      flex: 1
    },
    cancelButton: {
      backgroundColor: '#f3f4f6',
      color: '#374151'
    },
    link: {
      textDecoration: 'none',
      color: '#ff4500'
    },
    helpText: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 4
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Post</h1>
        <Link to="/forum" style={styles.link}>Cancel</Link>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Title <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter post title"
            style={styles.input}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>
            Image URL <span style={styles.required}>*</span>
          </label>
          <input
            type="url"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
            style={styles.input}
            required
            disabled={loading}
          />
          <p style={styles.helpText}>
            Try: https://picsum.photos/800/600 for a random image
          </p>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add a description (optional)"
            style={styles.textarea}
            disabled={loading}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., tech, news, discussion"
            style={styles.input}
            disabled={loading}
          />
          <p style={styles.helpText}>
            Separate multiple tags with commas
          </p>
        </div>

        <div style={styles.buttonGroup}>
          <button
            type="submit"
            style={{ ...styles.button, ...styles.submitButton }}
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Post'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/forum')}
            style={{ ...styles.button, ...styles.cancelButton }}
            disabled={loading}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

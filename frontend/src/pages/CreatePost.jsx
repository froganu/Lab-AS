import { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function CreatePost() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    tags: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
      const token = localStorage.getItem("jwtToken");
      if (!token) navigate("/login");
    }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Convert image file to Base64
  const handleImageSelect = (file) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }

    // Validate file size (e.g., max 2MB for Base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size must be less than 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result; // e.g., "data:image/png;base64,iVBOR..."
      
      setFormData(prev => ({
        ...prev,
        image_url: base64String
      }));
      setImagePreview(base64String);
      setError('');
    };
    reader.onerror = () => {
      setError('Failed to read image file');
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    handleImageSelect(file);
  };

  const clearImage = () => {
    setFormData(prev => ({
      ...prev,
      image_url: ''
    }));
    setImagePreview('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');

  // Validation
  if (!formData.image_url) {
    setError('Please upload an image');
    return;
  }

  if (!formData.title.trim()) {
    setError('Title is required');
    return;
  }

  setLoading(true);

  try {
    // Agafem el token del localStorage
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('You must be logged in');
      setLoading(false);
      return;
    }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` // <-- afegim token aquí
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error creating post');
    }

    navigate(`/post/${data.postId}`);
  } catch (err) {
    setError(err.message);
    setLoading(false);
  }
};


  const styles = {
    container: { maxWidth: 720, margin: '0 auto', padding: 16 },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    title: { margin: 0, fontSize: 24, fontWeight: 600, color: '#111827' },
    form: { display: 'flex', flexDirection: 'column', gap: 16 },
    formGroup: { display: 'flex', flexDirection: 'column', gap: 8 },
    label: { fontSize: 14, fontWeight: 500, color: '#374151' },
    required: { color: '#ff4500' },
    input: { padding: '10px 12px', fontSize: 14, border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', fontFamily: 'inherit' },
    textarea: { padding: '10px 12px', fontSize: 14, border: '1px solid #d1d5db', borderRadius: 8, outline: 'none', fontFamily: 'inherit', minHeight: 100, resize: 'vertical' },
    
    // File input styles
    fileInput: { display: 'none' },
    dropZone: {
      border: '2px dashed #d1d5db',
      borderRadius: 8,
      padding: 32,
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s',
      backgroundColor: '#f9fafb'
    },
    dropZoneActive: {
      borderColor: '#ff4500',
      backgroundColor: '#fff5f5'
    },
    dropZoneText: {
      fontSize: 14,
      color: '#6b7280',
      margin: '8px 0'
    },
    imagePreview: {
      width: '100%',
      maxHeight: 400,
      objectFit: 'cover',
      borderRadius: 8,
      marginTop: 12
    },
    clearButton: {
      padding: '6px 12px',
      fontSize: 12,
      backgroundColor: '#f3f4f6',
      color: '#374151',
      border: 'none',
      borderRadius: 6,
      cursor: 'pointer',
      marginTop: 8
    },
    
    error: { padding: 12, backgroundColor: '#fee2e2', color: '#991b1b', borderRadius: 8, fontSize: 14 },
    buttonGroup: { display: 'flex', gap: 12, marginTop: 8 },
    button: { padding: '10px 20px', fontSize: 14, fontWeight: 500, border: 'none', borderRadius: 8, cursor: 'pointer', transition: 'background-color 0.2s' },
    submitButton: { backgroundColor: '#ff4500', color: '#fff', flex: 1 },
    cancelButton: { backgroundColor: '#f3f4f6', color: '#374151' },
    link: { textDecoration: 'none', color: '#ff4500' },
    helpText: { fontSize: 12, color: '#6b7280', marginTop: 4 }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Create New Post</h1>
        <Link to="/forum" style={styles.link}>Cancel</Link>
      </div>

      {error && <div style={styles.error}>{error}</div>}

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

        {/* Image upload section */}
        <div style={styles.formGroup}>
          <label style={styles.label}>
            Image <span style={styles.required}>*</span>
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            style={styles.fileInput}
          />
          
          {!imagePreview ? (
            <div
              style={styles.dropZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" style={{ margin: '0 auto' }}>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
              </svg>
              <p style={styles.dropZoneText}>
                <strong>Click to upload</strong>
              </p>
              <p style={{ ...styles.dropZoneText, margin: 0 }}>
                PNG, JPG, GIF up to 2MB
              </p>
            </div>
          ) : (
            <div>
              <img src={imagePreview} alt="Preview" style={styles.imagePreview} />
              <button 
                type="button" 
                onClick={clearImage} 
                style={styles.clearButton}
                disabled={loading}
              >
                Remove image
              </button>
            </div>
          )}
          
          <p style={styles.helpText}>
            Images are converted to Base64 and stored in the database
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
          <p style={styles.helpText}>Separate multiple tags with commas</p>
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

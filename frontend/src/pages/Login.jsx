import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
        setMessage("Login correcte! Redirigint a Forum...");
        setTimeout(() => navigate("/forum"), 1000);
      } else {
        setSuccess(false);
        setMessage(data.message || "Error al iniciar sessió");
      }
    } catch (err) {
      console.error(err);
      setSuccess(false);
      setMessage("Error del servidor");
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#DAE0E6',
      padding: '20px'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 4,
      padding: '40px 32px',
      maxWidth: 400,
      width: '100%',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    logo: {
      textAlign: 'center',
      marginBottom: 32
    },
    logoIcon: {
      width: 40,
      height: 40,
      margin: '0 auto 16px',
      backgroundColor: '#FF4500',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 24,
      fontWeight: 'bold'
    },
    title: {
      margin: 0,
      fontSize: 18,
      fontWeight: 500,
      color: '#1c1c1c',
      textAlign: 'center'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    },
    label: {
      fontSize: 12,
      fontWeight: 500,
      color: '#1c1c1c',
      textTransform: 'uppercase',
      letterSpacing: 0.5
    },
    input: {
      padding: '12px 16px',
      fontSize: 14,
      border: '1px solid #EDEFF1',
      borderRadius: 4,
      outline: 'none',
      backgroundColor: '#F6F7F8',
      transition: 'all 0.2s',
      fontFamily: 'inherit'
    },
    inputFocus: {
      border: '1px solid #0079D3',
      backgroundColor: '#ffffff'
    },
    button: {
      padding: '12px 16px',
      fontSize: 14,
      fontWeight: 700,
      color: '#ffffff',
      backgroundColor: '#FF4500',
      border: 'none',
      borderRadius: 9999,
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      marginTop: 8,
      textTransform: 'uppercase',
      letterSpacing: 0.5
    },
    buttonHover: {
      backgroundColor: '#FF5722'
    },
    message: {
      padding: '12px 16px',
      borderRadius: 4,
      fontSize: 14,
      textAlign: 'center',
      marginTop: 16
    },
    successMessage: {
      backgroundColor: '#E8F5E9',
      color: '#2E7D32',
      border: '1px solid #81C784'
    },
    errorMessage: {
      backgroundColor: '#FFEBEE',
      color: '#C62828',
      border: '1px solid #EF5350'
    },
    footer: {
      textAlign: 'center',
      marginTop: 24,
      fontSize: 13,
      color: '#7c7c7c'
    },
    link: {
      color: '#0079D3',
      textDecoration: 'none',
      fontWeight: 500
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '24px 0',
      color: '#7c7c7c',
      fontSize: 12,
      textTransform: 'uppercase'
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: '#EDEFF1'
    },
    dividerText: {
      padding: '0 16px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>r/</div>
          <h2 style={styles.title}>Log In</h2>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.border = '1px solid #0079D3';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #EDEFF1';
                e.target.style.backgroundColor = '#F6F7F8';
              }}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              style={styles.input}
              onFocus={(e) => {
                e.target.style.border = '1px solid #0079D3';
                e.target.style.backgroundColor = '#ffffff';
              }}
              onBlur={(e) => {
                e.target.style.border = '1px solid #EDEFF1';
                e.target.style.backgroundColor = '#F6F7F8';
              }}
              required
            />
          </div>

          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => e.target.style.backgroundColor = '#FF5722'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#FF4500'}
          >
            Log In
          </button>
        </form>

        {message && (
          <div style={{
            ...styles.message,
            ...(success ? styles.successMessage : styles.errorMessage)
          }}>
            {message}
          </div>
        )}

        <div style={styles.divider}>
          <div style={styles.dividerLine} />
          <span style={styles.dividerText}>or</span>
          <div style={styles.dividerLine} />
        </div>

        <div style={styles.footer}>
          New to MyForum?{' '}
          <a href="/register" style={styles.link}>Sign Up</a>
        </div>
      </div>
    </div>
  );
}

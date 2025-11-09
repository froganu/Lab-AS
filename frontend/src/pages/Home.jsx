import { Link } from "react-router-dom";

export default function Home() {
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#DAE0E6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    },
    content: {
      maxWidth: 1200,
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      gap: 60,
      flexWrap: 'wrap',
      justifyContent: 'center'
    },
    hero: {
      flex: 1,
      minWidth: 300,
      maxWidth: 500
    },
    logoSection: {
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      marginBottom: 24
    },
    logo: {
      width: 60,
      height: 60,
      backgroundColor: '#FF4500',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: 32,
      fontWeight: 'bold',
      flexShrink: 0
    },
    brandName: {
      fontSize: 32,
      fontWeight: 700,
      color: '#1c1c1c',
      margin: 0
    },
    tagline: {
      fontSize: 48,
      fontWeight: 700,
      color: '#1c1c1c',
      margin: '0 0 16px 0',
      lineHeight: 1.2
    },
    description: {
      fontSize: 18,
      color: '#7c7c7c',
      margin: '0 0 32px 0',
      lineHeight: 1.6
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: 4,
      padding: 40,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      minWidth: 300,
      maxWidth: 400,
      width: '100%'
    },
    cardTitle: {
      fontSize: 20,
      fontWeight: 600,
      color: '#1c1c1c',
      margin: '0 0 24px 0',
      textAlign: 'center'
    },
    buttonGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    },
    button: {
      padding: '14px 24px',
      fontSize: 14,
      fontWeight: 700,
      border: 'none',
      borderRadius: 9999,
      cursor: 'pointer',
      transition: 'all 0.2s',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      textDecoration: 'none',
      display: 'block',
      textAlign: 'center'
    },
    primaryButton: {
      backgroundColor: '#FF4500',
      color: '#ffffff'
    },
    secondaryButton: {
      backgroundColor: 'transparent',
      color: '#0079D3',
      border: '2px solid #0079D3'
    },
    features: {
      marginTop: 32,
      paddingTop: 32,
      borderTop: '1px solid #EDEFF1'
    },
    featureList: {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    },
    featureItem: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      fontSize: 14,
      color: '#7c7c7c'
    },
    featureIcon: {
      width: 20,
      height: 20,
      borderRadius: '50%',
      backgroundColor: '#E8F5E9',
      color: '#2E7D32',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 12,
      fontWeight: 'bold',
      flexShrink: 0
    },
    footer: {
      position: 'absolute',
      bottom: 20,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontSize: 12,
      color: '#7c7c7c'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.content}>
        {/* Hero Section */}
        <div style={styles.hero}>
          <div style={styles.logoSection}>
            <div style={styles.logo}>r/</div>
            <h1 style={styles.brandName}>MyForum</h1>
          </div>
          
          <h2 style={styles.tagline}>
            Your Community Awaits
          </h2>
          
          <p style={styles.description}>
            Join thousands of users sharing ideas, asking questions, and building connections. 
            Dive into discussions that matter to you.
          </p>
        </div>

        {/* Auth Card */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Get Started</h3>
          
          <div style={styles.buttonGroup}>
            <Link to="/register" style={{ textDecoration: 'none' }}>
              <button 
                style={{ ...styles.button, ...styles.primaryButton }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#FF5722'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#FF4500'}
              >
                Sign Up
              </button>
            </Link>
            
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button 
                style={{ ...styles.button, ...styles.secondaryButton }}
                onMouseOver={(e) => {
                  e.target.style.backgroundColor = '#0079D3';
                  e.target.style.color = '#ffffff';
                }}
                onMouseOut={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#0079D3';
                }}
              >
                Log In
              </button>
            </Link>
          </div>

          {/* Features */}
          <div style={styles.features}>
            <ul style={styles.featureList}>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                Share your thoughts and stories
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                Connect with like-minded people
              </li>
              <li style={styles.featureItem}>
                <span style={styles.featureIcon}>✓</span>
                Discover trending topics
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={styles.footer}>
        <p style={{ margin: 0 }}>
          © 2025 MyForum. All rights reserved.
        </p>
      </div>
    </div>
  );
}

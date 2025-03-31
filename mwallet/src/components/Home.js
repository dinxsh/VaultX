import React from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '0 24px',
      background: 'linear-gradient(180deg, #1a1a1a 0%, #0a0a0a 100%)',
    },
    title: {
      fontSize: '48px',
      fontWeight: 'bold',
      background: 'linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      marginBottom: '16px',
    },
    subtitle: {
      fontSize: '18px',
      color: '#9CA3AF',
      marginBottom: '48px',
      textAlign: 'center',
      maxWidth: '400px',
      lineHeight: '1.5',
    },
    button: {
      width: '100%',
      maxWidth: '320px',
      height: '48px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      marginBottom: '16px',
    },
    primaryButton: {
      background: 'linear-gradient(90deg, #7C3AED 0%, #3B82F6 100%)',
      border: 'none',
    },
    secondaryButton: {
      background: 'transparent',
      border: '1px solid #3B82F6',
      color: '#3B82F6',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>VaultX</h1>
      <p style={styles.subtitle}>
        Secure, Self Custodial & Decentralized Wallet
      </p>
      <Button
        onClick={() => navigate("/yourwallet")}
        style={{...styles.button, ...styles.primaryButton}}
      >
        Create
      </Button>
      <Button
        onClick={() => navigate("/recover")}
        style={{...styles.button, ...styles.secondaryButton}}
      >
        Sign In
      </Button>
    </div>
  );
}

export default Home;

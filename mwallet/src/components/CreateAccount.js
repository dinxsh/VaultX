import React from "react";
import { Button, Card, message } from "antd";
import { ExclamationCircleOutlined, CopyOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ethers } from "ethers";

function CreateAccount({setWallet, setSeedPhrase}) {
  const [newSeedPhrase, setNewSeedPhrase] = useState(null);
  const navigate = useNavigate();

  const styles = {
    content: {
      width: '100%',
      maxWidth: '480px',
      padding: '24px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    },
    warning: {
      background: 'rgba(255, 171, 0, 0.1)',
      borderRadius: '12px',
      padding: '16px',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px'
    },
    warningIcon: {
      color: '#FFAB00',
      fontSize: '20px',
      marginTop: '2px'
    },
    warningText: {
      color: '#fff',
      fontSize: '14px',
      lineHeight: '1.5',
      flex: 1
    },
    button: {
      height: '48px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '500',
      width: '100%'
    },
    primaryButton: {
      background: '#5865F2',
      border: 'none',
      '&:hover': {
        background: '#4752C4'
      }
    },
    seedPhraseCard: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '16px'
    },
    seedPhrase: {
      color: '#fff',
      fontSize: '16px',
      lineHeight: '1.6',
      wordSpacing: '4px',
      marginBottom: '16px'
    },
    copyButton: {
      width: '100%',
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: '#fff',
      height: '40px',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      '&:hover': {
        background: 'rgba(255, 255, 255, 0.15)'
      }
    },
    backLink: {
      color: 'rgba(255, 255, 255, 0.5)',
      fontSize: '14px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'color 0.2s',
      '&:hover': {
        color: 'rgba(255, 255, 255, 0.8)'
      }
    }
  };

  function generateWallet() {
    const mnemonic = ethers.Wallet.createRandom().mnemonic.phrase;
    setNewSeedPhrase(mnemonic);
  }

  function setWalletAndMnemonic() {
    setSeedPhrase(newSeedPhrase);
    setWallet(ethers.Wallet.fromPhrase(newSeedPhrase).address);
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(newSeedPhrase);
    message.success('Seed phrase copied to clipboard');
  };

  return (
    <div style={styles.content}>
      <div style={styles.warning}>
        <ExclamationCircleOutlined style={styles.warningIcon} />
        <div style={styles.warningText}>
          Save your seed phrase securely - it's the only way to recover your wallet. Never share it with anyone.
        </div>
      </div>

      <Button
        type="primary"
        onClick={generateWallet}
        style={{...styles.button, ...styles.primaryButton}}
      >
        Generate Seed Phrase
      </Button>

      {newSeedPhrase && (
        <Card style={styles.seedPhraseCard}>
          <div style={styles.seedPhrase}>
            {newSeedPhrase}
          </div>
          <button 
            onClick={copyToClipboard}
            style={styles.copyButton}
          >
            <CopyOutlined /> Copy to Clipboard
          </button>
        </Card>
      )}

      <Button
        type="primary"
        onClick={setWalletAndMnemonic}
        style={{...styles.button, ...styles.primaryButton}}
        disabled={!newSeedPhrase}
      >
        Access Wallet
      </Button>

      <div 
        onClick={() => navigate("/")}
        style={styles.backLink}
      >
        Back to Home
      </div>
    </div>
  );
}

export default CreateAccount;

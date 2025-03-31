import "./App.css";
import { useState } from "react";
import logo from "./ethereumLogo.svg";
import { Select } from "antd";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateAccount from "./components/CreateAccount";
import RecoverAccount from "./components/RecoverAccount";
import WalletView from "./components/WalletView";

function App() {
  const [wallet, setWallet] = useState(null);
  const [seedPhrase, setSeedPhrase] = useState(null);
  const [selectedChain, setSelectedChain] = useState("0x1");

  const styles = {
    appContainer: {
      background: '#0A0B0D',
      minHeight: '100vh',
      width: '100%',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    },
    header: {
      background: 'rgba(10, 11, 13, 0.9)',
      backdropFilter: 'blur(20px)',
      padding: '8px 12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      height: '40px'
    },
    logo: {
      height: '20px',
      width: 'auto'
    },
    content: {
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '40px',
      padding: '0',
      width: '100%',
      maxWidth: '380px',
      margin: '0 auto',
      background: 'linear-gradient(180deg, rgba(10, 11, 13, 0.9) 0%, rgba(10, 11, 13, 1) 100%)',
      position: 'relative'
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.header}>
        <img src={logo} style={styles.logo} alt="logo" />
        <Select
          onChange={(val) => setSelectedChain(val)}
          value={selectedChain}
          options={[
            {
              label: "Ethereum",
              value: "0x1",
            },
            {
              label: "Mumbai Testnet", 
              value: "0x13881",
            },
            {
              label: "Sepolia Testnet",
              value: "0xaa36a7", 
            },
          ]}
          style={{
            width: 'fit-content',
            minWidth: '140px',
            background: '#222222',
            border: '1px solid #333333',
            borderRadius: '8px',
            color: '#fff',
            marginRight: '12px'
          }}
          dropdownStyle={{
            background: '#222222',
            border: '1px solid #333333',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
          }}
          optionLabelProp="label"
          menuItemSelectedIcon={null}
          dropdownClassName="phantom-dropdown"
          className="phantom-select"
        />
      </header>
      <main style={styles.content}>
        {wallet && seedPhrase ? (
          <Routes>
            <Route
              path="/yourwallet"
              element={
                <WalletView
                  wallet={wallet}
                  setWallet={setWallet}
                  seedPhrase={seedPhrase}
                  setSeedPhrase={setSeedPhrase}
                  selectedChain={selectedChain}
                />
              }
            />
          </Routes>
        ) : (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/recover"
              element={
                <RecoverAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                />
              }
            />
            <Route
              path="/yourwallet"
              element={
                <CreateAccount
                  setSeedPhrase={setSeedPhrase}
                  setWallet={setWallet}
                />
              }
            />
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;

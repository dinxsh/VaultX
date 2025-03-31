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
      background: 'rgba(10, 11, 13, 0.9)',
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      display: 'flex',
      flexDirection: 'column'
    },
    header: {
      background: 'rgba(10, 11, 13, 0.9)',
      backdropFilter: 'blur(20px)',
      padding: '16px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 255, 255, 0.04)'
    },
    logo: {
      height: '32px',
      width: 'auto'
    },
    chainSelect: {
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      color: '#fff',
      padding: '4px 12px',
      minWidth: '140px'
    },
    content: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0',
      background: 'linear-gradient(180deg, rgba(10, 11, 13, 0.9) 0%, rgba(10, 11, 13, 1) 100%)'
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
            width: '160px',
          }}
          dropdownStyle={{
            background: '#1A1B1F',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px'
          }}
          className="chain-select"
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

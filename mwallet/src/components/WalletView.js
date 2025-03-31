import React, { useEffect, useState, useCallback } from "react";
import {
  Tooltip,
  List,
  Avatar,
  Spin,
  Tabs,
  Button,
} from "antd";
import { LogoutOutlined, SettingOutlined  } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logo from "../noImg.png";
import { makeApiRequest, API_BASE_URL } from "../utils/api";
import { CHAINS_CONFIG } from "../chains";
import "../styles/WalletView.css";
const { ethers } = require("ethers");

// Custom styles
const styles = {
  container: {
    background: 'linear-gradient(169.73deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0) 100%)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: '20px',
    color: '#fff',
    minHeight: '600px',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: '-50%',
      left: '-50%',
      width: '200%',
      height: '200%',
      background: 'radial-gradient(circle, rgba(0, 255, 157, 0.1) 0%, rgba(0, 255, 157, 0) 70%)',
      zIndex: '-1',
      pointerEvents: 'none',
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    padding: '0 4px',
  },
  accountBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '8px 16px',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: 'rgba(255, 255, 255, 0.1)',
    }
  },
  accountIcon: {
    background: 'linear-gradient(135deg, #00ff9d 0%, #00f0ff 100%)',
    borderRadius: '50%',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '600',
  },
  balanceSection: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  balanceAmount: {
    color: '#00ff9d',
    fontSize: '36px',
    fontWeight: '600',
    marginBottom: '8px',
  },
  balanceChange: {
    color: '#00ff9d',
    fontSize: '16px',
    fontWeight: '500',
  },
  accountInfo: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '15px',
    marginBottom: '20px',
  },
  balance: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: '10px 0',
  },
  positiveChange: {
    color: '#00ff9d',
    fontSize: '14px',
    marginLeft: '8px',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
  },
  actionButton: {
    flex: 1,
    background: '#7A73FF',
    border: 'none',
    borderRadius: '12px',
    padding: '12px',
    color: '#fff',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    '&:hover': {
      background: '#6561FF',
    },
  },
  tokenList: {
    background: 'transparent',
  },
  tokenItem: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    marginBottom: '8px',
    padding: '12px',
    border: 'none',
  },
  nftGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
    gap: '15px',
    padding: '15px',
  },
  nftCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    overflow: 'hidden',
    transition: 'transform 0.3s ease',
    '&:hover': {
      transform: 'translateY(-5px)',
    },
  },
};

function WalletView({
  wallet,
  setWallet,
  seedPhrase,
  setSeedPhrase,
  selectedChain,
}) {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState([
    {
      token_address: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      name: "Ethereum",
      symbol: "ETH",
      logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
      balance: "0.01",
      decimals: "18", 
      price_change_24h: -0.29,
      usd_price: 18.58
    },
    {
      token_address: "0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0",
      name: "Polygon",
      symbol: "MATIC",
      logo: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png",
      balance: "0.00",
      decimals: "18",
      price_change_24h: 0,
      usd_price: 0.00
    },
    {
      token_address: "0x53E0bca35eC356BD5ddDFebbD1Fc0fD03FaBad39", 
      name: "Solana",
      symbol: "SOL",
      logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png",
      balance: "0.00",
      decimals: "18",
      price_change_24h: 0,
      usd_price: 0.00
    }
  ]);
  const [nfts, setNfts] = useState([
    {
      id: "1",
      name: "Bored Ape #7238",
      collection: "Bored Ape Yacht Club",
      image: "https://i.seadn.io/gcs/files/c49d2493f2ef4a40a5306dfa753a9b7c.png",
      floor_price: "18.5 ETH"
    },
    {
      id: "2", 
      name: "Azuki #4623",
      collection: "Azuki",
      image: "https://i.seadn.io/gcs/files/c3bca0c70e12f4a7fad6b0a5ef104af9.png",
      floor_price: "12.2 ETH"
    },
    {
      id: "3",
      name: "Doodle #8748",
      collection: "Doodles",
      image: "https://i.seadn.io/gcs/files/f1273e4d0d141ed4f0c6242a32ad9a32.png",
      floor_price: "3.8 ETH"
    }
  ]);
  const [balance, setBalance] = useState(0);
  const [tokenTransfers, setTokenTransfers] = useState([
    {
      token_symbol: "ETH",
      transaction_type: "Sent",
      usd_value: "180.50",
      block_timestamp: "2024-01-15T10:30:00",
      from_address: "0x1234567890abcdef1234567890abcdef1ayq41637",
      token_logo: "https://assets.coingecko.com/coins/images/279/large/ethereum.png"
    },
    {
      token_symbol: "MATIC",
      transaction_type: "Received", 
      usd_value: "50.20",
      block_timestamp: "2024-01-14T15:45:00",
      from_address: "0xabcdef1234567890abcdef1234567890abawdf12",
      token_logo: "https://assets.coingecko.com/coins/images/4713/large/matic-token-icon.png"
    },
    {
      token_symbol: "SOL",
      transaction_type: "Sent",
      usd_value: "95.30",
      block_timestamp: "2024-01-13T09:15:00", 
      from_address: "0x7890abcdef1234567890abcdef1234567281baew",
      token_logo: "https://assets.coingecko.com/coins/images/4128/large/solana.png"
    }
  ]);
  const [nftTransfers, setNftTransfers] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [amountToSend, setAmountToSend] = useState("");
  const [sendToAddress, setSendToAddress] = useState("");
  const [processing, setProcessing] = useState(false);
  const [hash, setHash] = useState(null);

  const items = [
    {
      key: "1",
      label: `Assets`,
      children: (
        <div style={{ padding: '10px' }}>
          <div style={styles.accountInfo}>
            <div style={styles.actionButtons}>
              <Button type="primary" style={styles.actionButton}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span>Deposit</span>
                </div>
              </Button>
              <Button type="primary" style={styles.actionButton}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span>Buy</span>
                </div>
              </Button>
              <Button type="primary" style={styles.actionButton}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span>Send</span>
                </div>
              </Button>
            </div>
          </div>
          
          {tokens && tokens.length > 0 ? (
            <List
              className="tokenList"
              itemLayout="horizontal"
              dataSource={tokens}
              renderItem={(item) => (
                <List.Item style={{
                  background: 'rgba(22, 24, 29, 0.9)',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  padding: '12px 16px',
                  border: 'none',
                  cursor: 'pointer',
                  '&:hover': {
                    background: 'rgba(22, 24, 29, 1)',
                  }
                }}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.logo || logo} size={36} />}
                    title={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ color: '#fff', fontSize: '16px', fontWeight: '500' }}>
                            {item.symbol}
                          </span>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '14px' }}>
                            {Number(item.balance).toFixed(2)} {item.symbol}
                          </span>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ color: '#fff', fontSize: '16px', fontWeight: '500' }}>
                            ${item.usd_price.toFixed(2)}
                          </div>
                          <div style={{ 
                            color: item.price_change_24h > 0 ? '#00ff9d' : item.price_change_24h < 0 ? '#ff4d4f' : '#808080',
                            fontSize: '14px'
                          }}>
                            {item.price_change_24h > 0 ? '+' : ''}{item.price_change_24h.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: 'rgba(255, 255, 255, 0.6)' }}>
              No tokens found
            </div>
          )}
        </div>
      ),
    },
    {
      key: "2",
      label: `NFTs`,
      children: (
        <div style={styles.nftGrid}>
          {nfts && nfts.length > 0 ? (
            nfts.map((nft, index) => (
              <div key={index} style={styles.nftCard}>
                <img
                  src={nft.image}
                  alt={nft.name}
                  style={{ width: "100%", height: "auto", borderRadius: "12px 12px 0 0" }}
                  loading="lazy"
                />
                <div style={{ padding: '12px' }}>
                  <div style={{ color: '#fff', fontSize: '14px', fontWeight: 'bold' }}>
                    {nft.name}
                  </div>
                  <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px', marginTop: '4px' }}>
                    {nft.collection}
                  </div>
                  <div style={{ 
                    color: '#7A73FF', 
                    fontSize: '12px', 
                    marginTop: '8px',
                    background: 'rgba(122, 115, 255, 0.1)',
                    padding: '4px 8px',
                    borderRadius: '8px',
                    display: 'inline-block'
                  }}>
                    Floor: {nft.floor_price}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: "center", padding: "20px", color: 'rgba(255, 255, 255, 0.6)' }}>
              No NFTs found
            </div>
          )}
        </div>
      ),
    },
    {
      key: "3",
      label: `Activity`,
      children: (
        <div style={{ padding: '10px' }}>
          <List
            dataSource={[...tokenTransfers, ...nftTransfers].sort((a, b) => 
              new Date(b.block_timestamp) - new Date(a.block_timestamp)
            )}
            renderItem={(transfer) => (
              <List.Item style={styles.tokenItem}>
                <List.Item.Meta
                  avatar={
                    <Avatar 
                      src={transfer.token_logo || transfer.image_url}
                      style={{ 
                        background: !transfer.token_logo && !transfer.image_url ? 
                          'rgba(122, 115, 255, 0.2)' : 'transparent',
                        color: '#7A73FF' 
                      }}
                    >
                      {!transfer.token_logo && !transfer.image_url && 
                        (transfer.token_symbol ? transfer.token_symbol[0] : 'N')}
                    </Avatar>
                  }
                  title={
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ color: '#fff' }}>
                        {transfer.token_symbol ? 
                          `${transfer.token_symbol} ${transfer.transaction_type}` : 
                          `${transfer.collection_name} ${transfer.transaction_type}`
                        }
                      </span>
                      <span style={{ 
                        color: transfer.transaction_type === 'Received' ? '#00ff9d' : '#ff4d4f',
                        fontSize: '14px'
                      }}>
                        {transfer.usd_value ? `$${transfer.usd_value}` : ''}
                      </span>
                    </div>
                  }
                  description={
                    <div style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                      {new Date(transfer.block_timestamp).toLocaleString()} • {transfer.from_address.slice(0, 6)}...{transfer.from_address.slice(-4)}
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      ),
    },
  ];

  const getAccountTokens = useCallback(async () => {
    setFetching(true);
    try {
      console.log("Fetching account tokens...");
      const response = await makeApiRequest(`${API_BASE_URL}/getTokens`, {
        params: {
          userAddress: wallet,
          chain: selectedChain,
        },
      });
      console.log("Received response:", response);

      if (response.tokens) setTokens(response.tokens);
      if (response.nfts) setNfts(response.nfts);
      if (response.balance) setBalance(Number(response.balance));
      if (response.tokenTransfers) setTokenTransfers(response.tokenTransfers);
      if (response.nftTransfers) setNftTransfers(response.nftTransfers);
    } catch (error) {
      console.error('Error fetching tokens:', error);
    } finally {
      setFetching(false);
    }
  }, [wallet, selectedChain]);

  async function sendTransaction(to, amount) {
    if (!to || !amount) {
      alert("Please enter both address and amount");
      return;
    }

    const chain = CHAINS_CONFIG[selectedChain];
    const provider = new ethers.providers.JsonRpcProvider(chain.rpcUrl);
    const privateKey = ethers.Wallet.fromPhrase(seedPhrase).privateKey;
    const wallet = new ethers.Wallet(privateKey, provider);

    const tx = {
      to: to,
      value: ethers.utils.parseEther(amount.toString()),
    };

    setProcessing(true);
    try {
      const transaction = await wallet.sendTransaction(tx);
      setHash(transaction.hash);
      const receipt = await transaction.wait();

      setHash(null);
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");

      if (receipt.status === 1) {
        getAccountTokens();
      } else {
        console.log("Transaction failed");
      }
    } catch (err) {
      console.error("Transaction error:", err);
      setHash(null);
      setProcessing(false);
      setAmountToSend("");
      setSendToAddress("");
    }
  }

  function logout() {
    setSeedPhrase(null);
    setWallet(null);
    setNfts([]);
    setTokens([]);
    setBalance(0);
    navigate("/");
  }

  useEffect(() => {
    if (wallet) {
      getAccountTokens();
    }
  }, [getAccountTokens, selectedChain, wallet]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.accountBadge}>
          <div style={styles.accountIcon}>
            A1
          </div>
          <div>
            <div style={{ fontWeight: '500' }}>Account 1</div>
            <div style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '12px' }}>
              {wallet.slice(0, 4)}...{wallet.slice(-4)}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '20px' }}>
          <SettingOutlined style={{ fontSize: '20px', cursor: 'pointer', opacity: 0.8 }} />
          <LogoutOutlined style={{ fontSize: '20px', cursor: 'pointer', opacity: 0.8 }} onClick={logout} />
        </div>
      </div>

      {fetching ? (
        <div style={{ textAlign: "center", padding: "20px" }}>
          <Spin />
        </div>
      ) : (
        <>
          <div style={styles.balanceSection}>
            <div style={styles.balanceAmount}>$10.0</div>
            <div style={styles.balanceChange}>+120%</div>
          </div>
          <Tabs 
            defaultActiveKey="1" 
            items={items} 
            className="walletView"
            style={{
              color: '#fff',
              '& .ant-tabs-tab': {
                color: 'rgba(255, 255, 255, 0.6) !important',
              },
              '& .ant-tabs-tab-active': {
                color: '#fff !important',
              },
              '& .ant-tabs-ink-bar': {
                background: '#00ff9d !important',
              },
            }}
          />
        </>
      )}
    </div>
  );
}

export default WalletView;

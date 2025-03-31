# VaultX 

a **browser extension wallet** that simplifies blockchain connectivity for React applications. It supports multiple evm based blockchain networks, provides a **developer-friendly API**, and ensures **secure key management** for seamless transaction signing.

<div align="center">
  <img src="https://github.com/user-attachments/assets/752e24b9-379c-42c6-99c6-5ee8b8be94af"></img>
</div>

## 🚀 Features
- **Standardized Wallet API** - Easily connect to React apps
- **Multi-Chain Support** - Works with Ethereum, Solana, and more
- **Secure Key Management** - Uses Web Crypto API & IndexedDB
- **Minimal Configuration** - Simple integration for developers
- **Intuitive UI** - Clean interface for wallet & transaction management
- **Cross-Browser Compatibility** - Works on Chrome, Firefox, and Edge

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS
- **Blockchain:** Ethers.js (Ethereum)
- **Security:** Web Crypto API, IndexedDB
- **Extension APIs:** Chrome, Firefox, Edge (Manifest V3)

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/VaultX.git
cd VaultX

# Install dependencies
npm install

# Build the extension
npm run build
```

## 🔧 Setup & Development
1. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer Mode**
   - Click **Load Unpacked** and select the `dist/` folder
2. Run the React demo app:
```bash
npm run dev
```

## 📜 Usage
- Connect VaultX to your React app with:
```javascript
const wallet = new VaultX();
await wallet.connect();
const balance = await wallet.getBalance();
```
- Sign transactions securely:
```javascript
const tx = await wallet.signTransaction(txData);
await wallet.sendTransaction(tx);
```

## 🔒 Security Best Practices
- **Keys never leave the extension**
- **Encrypted storage using Web Crypto API**
- **Strict permissions model** following Manifest V3

## 📌 Roadmap
- [ ] Support additional EVM blockchains (e.g., Polkadot, Avalanche)
- [ ] Mobile browser extension support
- [ ] Enhanced transaction history tracking

## 🤝 Contributing
1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

## 📄 License
MIT License - Feel free to use and modify!

---
Made with ❤️ by Team /dev/null for HackNUthon 6.0

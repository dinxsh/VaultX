### VaultX 

fast & secure crypto wallet chrome extension

  <img src="https://cdn.discordapp.com/attachments/1357095797082161323/1357872849745875055/image.png?ex=67f1c923&is=67f077a3&hm=e05e10fc98d6f0de811fbc8ded4d2c1db0bc3074e2139c0e4df6257cf1bcb917&"></img>

### Features
- Easily connects to React apps
- Works with Ethereum, Solana, and more
- Uses Web Crypto API, & IndexedDB

### Tech
- **Frontend:** React, Tailwind CSS
- **Blockchain:** Ethers.js (Ethereum)
- **Security:** Web Crypto API, IndexedDB
- **Extension APIs:** Chrome, Firefox, Edge (Manifest V3)

### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/VaultX.git
cd VaultX

# Install dependencies
npm install

# Build the extension
npm run build
```

### Setup
1. Load the extension in Chrome:
   - Open `chrome://extensions/`
   - Enable **Developer Mode**
   - Click **Load Unpacked** and select the `dist/` folder
2. Run the React demo app:
```bash
npm run dev
```

### Usage
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

### Security
- **Keys never leave the extension**
- **Encrypted storage using Web Crypto API**
- **Strict permissions model** following Manifest V3

### Roadmap
- [ ] Support additional EVM blockchains (e.g., Polkadot, Avalanche)
- [ ] Mobile browser extension support
- [ ] Enhanced transaction history tracking

### Contributing
1. Fork the repo
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a Pull Request

### License
MIT License - Feel free to use and modify!

---
Made with ❤️ by Team /dev/null for HackNUthon 6.0

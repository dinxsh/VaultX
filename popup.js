import { ethers } from 'ethers';
import { Connection, PublicKey, Keypair } from '@solana/web3.js';
import { HDNode, mnemonicToSeed } from '@ethersproject/hdnode';
import { wordlists } from '@ethersproject/wordlists';
import * as bip39 from 'bip39';
import logger from './utils/logger.js';
import { SolanaWallet } from './utils/solana';

class MultiChainWallet {
    constructor() {
        this.currentNetwork = 'ethereum';
        this.wallet = null;
        this.provider = null;
        this.solanaWallet = new SolanaWallet();
        this.notifications = [];
        this.debugLogs = [];
        this.initializeEventListeners();
        this.initializeNotificationSystem();
        this.loadDebugLogs();
    }

    initializeNotificationSystem() {
        this.notificationContainer = document.getElementById('notificationContainer');
        this.debugPanel = document.getElementById('debugPanel');
        this.debugContent = document.getElementById('debugContent');

        // Listen for notifications from other parts of the extension
        chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
            if (message.type === 'UI_NOTIFICATION') {
                this.showNotification(message.notificationType, message.message);
            }
        });
    }

    showNotification(type, message, duration = 5000) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="close-btn">&times;</button>
        `;

        notification.querySelector('.close-btn').addEventListener('click', () => {
            notification.remove();
        });

        this.notificationContainer.appendChild(notification);

        // Auto-remove after duration
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, duration);

        // Add to debug panel
        this.addDebugLog(type, message);
    }

    addDebugLog(type, message, data = null) {
        const timestamp = new Date().toLocaleTimeString();
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        
        // Safely stringify data if it exists
        let dataString = '';
        if (data) {
            try {
                dataString = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
            } catch (error) {
                dataString = '<pre>Error stringifying data</pre>';
            }
        }

        logEntry.innerHTML = `
            <span class="timestamp">${timestamp}</span>
            <span class="level ${type}">${type.toUpperCase()}</span>
            <span class="message">${message}</span>
            ${dataString}
        `;

        this.debugContent.insertBefore(logEntry, this.debugContent.firstChild);
        this.debugLogs.unshift({ type, message, data, timestamp });
        this.saveDebugLogs();
    }

    loadDebugLogs() {
        chrome.storage.local.get(['debugLogs'], (result) => {
            if (result.debugLogs) {
                this.debugLogs = result.debugLogs;
                this.debugLogs.forEach(log => {
                    this.addDebugLog(log.type, log.message, log.data);
                });
            }
        });
    }

    saveDebugLogs() {
        // Keep only last 100 logs
        const logs = this.debugLogs.slice(0, 100);
        chrome.storage.local.set({ debugLogs: logs });
    }

    async initializeEventListeners() {
        try {
            document.getElementById('networkSelect').addEventListener('change', (e) => {
                logger.debug('Network changed', { from: this.currentNetwork, to: e.target.value });
                this.currentNetwork = e.target.value;
                this.updateNetwork();
            });

            document.getElementById('importBtn').addEventListener('click', () => {
                logger.debug('Import wallet button clicked');
                this.importWallet();
            });

            document.getElementById('disconnectBtn').addEventListener('click', () => {
                logger.debug('Disconnect button clicked');
                this.disconnectWallet();
            });

            document.getElementById('sendBtn').addEventListener('click', () => {
                logger.debug('Send button clicked');
                this.showSendModal();
            });

            document.getElementById('receiveBtn').addEventListener('click', () => {
                logger.debug('Receive button clicked');
                this.showReceiveModal();
            });

            logger.info('Event listeners initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize event listeners', error);
        }
    }

    async importWallet() {
        try {
            const seedPhrase = document.getElementById('seedPhrase').value.trim();
            logger.debug('Attempting to import wallet', { network: this.currentNetwork });

            if (!this.validateSeedPhrase(seedPhrase)) {
                logger.warn('Invalid seed phrase provided');
                this.showNotification('error', 'Invalid seed phrase. Please enter a valid 16-word seed phrase.');
                return;
            }

            await this.initializeWallet(seedPhrase);
            this.updateUI();
            logger.info('Wallet imported successfully');
            this.showNotification('info', 'Wallet imported successfully');
        } catch (error) {
            logger.error('Failed to import wallet', error);
            this.showNotification('error', 'Failed to import wallet. Please try again.');
        }
    }

    validateSeedPhrase(phrase) {
        const words = phrase.split(' ');
        return words.length === 16 && words.every(word => wordlists.english.includes(word));
    }

    async initializeWallet(seedPhrase) {
        const mnemonic = seedPhrase;
        const seed = await mnemonicToSeed(mnemonic);
        
        switch (this.currentNetwork) {
            case 'ethereum':
                this.provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR-PROJECT-ID');
                this.wallet = HDNode.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");
                break;
            case 'polygon':
                this.provider = new ethers.providers.JsonRpcProvider('https://polygon-rpc.com');
                this.wallet = HDNode.fromSeed(seed).derivePath("m/44'/60'/0'/0/0");
                break;
            case 'solana':
                await this.solanaWallet.initializeWallet(seedPhrase);
                this.wallet = this.solanaWallet;
                break;
        }
    }

    async updateNetwork() {
        try {
            if (this.wallet) {
                logger.debug('Updating network', { network: this.currentNetwork });
                await this.initializeWallet(this.wallet.mnemonic.phrase);
                this.updateUI();
                logger.info('Network updated successfully');
            }
        } catch (error) {
            logger.error('Failed to update network', error);
            this.showNotification('error', 'Failed to update network. Please try again.');
        }
    }

    async updateUI() {
        try {
            const walletInfo = document.getElementById('walletInfo');
            const authSection = document.getElementById('authSection');
            
            if (this.wallet) {
                logger.debug('Updating UI for connected wallet');
                walletInfo.classList.remove('hidden');
                authSection.classList.add('hidden');
                
                const address = this.getWalletAddress();
                const balance = await this.getWalletBalance();
                
                document.getElementById('walletAddress').textContent = this.shortenAddress(address);
                document.getElementById('walletBalance').textContent = balance;
                
                await this.loadTransactions();
                logger.info('UI updated successfully');
            } else {
                logger.debug('Updating UI for disconnected state');
                walletInfo.classList.add('hidden');
                authSection.classList.remove('hidden');
            }
        } catch (error) {
            logger.error('Failed to update UI', error);
            this.showNotification('error', 'Failed to update UI. Please refresh the extension.');
        }
    }

    getWalletAddress() {
        switch (this.currentNetwork) {
            case 'ethereum':
            case 'polygon':
                return this.wallet.address;
            case 'solana':
                return this.wallet.publicKey.toString();
        }
    }

    async getWalletBalance() {
        try {
            switch (this.currentNetwork) {
                case 'ethereum':
                case 'polygon':
                    const balance = await this.provider.getBalance(this.wallet.address);
                    return ethers.utils.formatEther(balance);
                case 'solana':
                    return await this.solanaWallet.getBalance();
            }
        } catch (error) {
            console.error('Error getting balance:', error);
            return '0';
        }
    }

    async loadTransactions() {
        try {
            const activityList = document.getElementById('activityList');
            activityList.innerHTML = '';

            let transactions = [];
            switch (this.currentNetwork) {
                case 'ethereum':
                case 'polygon':
                    transactions = await this.getEVMTransactions();
                    break;
                case 'solana':
                    transactions = await this.solanaWallet.getTransactionHistory();
                    break;
            }

            transactions.forEach(tx => {
                const txElement = this.createTransactionElement(tx);
                activityList.appendChild(txElement);
            });
        } catch (error) {
            logger.error('Failed to load transactions', error);
            this.showNotification('error', 'Failed to load transactions');
        }
    }

    async getEVMTransactions() {
        // Implement transaction fetching for Ethereum and Polygon
        // You'll need to use Etherscan/PolygonScan APIs
        return [];
    }

    async sendTransaction(recipientAddress, amount) {
        try {
            switch (this.currentNetwork) {
                case 'ethereum':
                case 'polygon':
                    // Existing EVM transaction code
                    break;
                case 'solana':
                    const signature = await this.solanaWallet.sendTransaction(recipientAddress, amount);
                    this.showNotification('success', `Transaction sent! Signature: ${signature}`);
                    await this.loadTransactions();
                    break;
            }
        } catch (error) {
            logger.error('Failed to send transaction', error);
            this.showNotification('error', 'Failed to send transaction');
        }
    }

    createTransactionElement(tx) {
        const element = document.createElement('div');
        element.className = `transaction-item ${tx.type}`;
        
        const timestamp = new Date(tx.timestamp * 1000).toLocaleString();
        const amount = this.currentNetwork === 'solana' ? 
            `${tx.amount} SOL` : 
            `${ethers.utils.formatEther(tx.amount)} ETH`;

        element.innerHTML = `
            <div class="transaction-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    ${tx.type === 'send' ? 
                        '<path d="M12 5v14M5 12h14"></path>' : 
                        '<path d="M12 19l-7-7 7-7M5 12h14"></path>'}
                </svg>
            </div>
            <div class="transaction-details">
                <div class="transaction-type">${tx.type === 'send' ? 'Sent' : 'Received'}</div>
                <div class="transaction-amount">${amount}</div>
                <div class="transaction-timestamp">${timestamp}</div>
            </div>
            <div class="transaction-status ${tx.status}">${tx.status}</div>
        `;

        return element;
    }

    shortenAddress(address) {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    }

    disconnectWallet() {
        this.wallet = null;
        this.provider = null;
        this.solanaWallet = null;
        this.updateUI();
    }

    showSendModal() {
        // Implement send transaction modal
    }

    showReceiveModal() {
        // Implement receive address modal
    }
}

// Initialize the wallet when the popup is loaded
document.addEventListener('DOMContentLoaded', () => {
    const wallet = new MultiChainWallet();
}); 
import { Connection, PublicKey, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import Logger from './logger';

export class SolanaWallet {
    constructor() {
        this.connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');
        this.wallet = null;
    }

    async initializeWallet(seedPhrase) {
        try {
            const seed = await this.generateSeedFromPhrase(seedPhrase);
            this.wallet = Keypair.fromSeed(seed.slice(0, 32));
            Logger.info('Solana wallet initialized successfully');
            return true;
        } catch (error) {
            Logger.error('Failed to initialize Solana wallet', error);
            return false;
        }
    }

    async generateSeedFromPhrase(seedPhrase) {
        // Implementation for generating seed from phrase
        // This should be implemented securely
        return Buffer.from(seedPhrase);
    }

    async sendTransaction(recipientAddress, amount) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not initialized');
            }

            const recipientPubkey = new PublicKey(recipientAddress);
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: this.wallet.publicKey,
                    toPubkey: recipientPubkey,
                    lamports: amount * LAMPORTS_PER_SOL,
                })
            );

            // Get the latest blockhash
            const { blockhash } = await this.connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = this.wallet.publicKey;

            // Sign and send the transaction
            const signature = await this.connection.sendTransaction(
                transaction,
                [this.wallet],
                { skipPreflight: true }
            );

            // Wait for confirmation
            const confirmation = await this.connection.confirmTransaction(signature);
            
            if (confirmation.value.err) {
                throw new Error('Transaction failed');
            }

            Logger.info('Transaction sent successfully', { signature });
            return signature;
        } catch (error) {
            Logger.error('Failed to send transaction', error);
            throw error;
        }
    }

    async getTransactionHistory(limit = 10) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not initialized');
            }

            const signatures = await this.connection.getSignaturesForAddress(
                this.wallet.publicKey,
                { limit }
            );

            const transactions = await Promise.all(
                signatures.map(async (sig) => {
                    const tx = await this.connection.getTransaction(sig.signature);
                    return {
                        signature: sig.signature,
                        timestamp: sig.blockTime,
                        status: sig.confirmationStatus,
                        amount: this.calculateTransactionAmount(tx),
                        type: this.determineTransactionType(tx),
                    };
                })
            );

            return transactions;
        } catch (error) {
            Logger.error('Failed to get transaction history', error);
            throw error;
        }
    }

    calculateTransactionAmount(transaction) {
        if (!transaction) return 0;
        
        const preBalances = transaction.meta.preBalances;
        const postBalances = transaction.meta.postBalances;
        
        if (preBalances.length === 0 || postBalances.length === 0) return 0;
        
        const balanceChange = (preBalances[0] - postBalances[0]) / LAMPORTS_PER_SOL;
        return Math.abs(balanceChange);
    }

    determineTransactionType(transaction) {
        if (!transaction) return 'unknown';
        
        const isIncoming = transaction.meta.postBalances[0] > transaction.meta.preBalances[0];
        return isIncoming ? 'receive' : 'send';
    }

    async getBalance() {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not initialized');
            }

            const balance = await this.connection.getBalance(this.wallet.publicKey);
            return balance / LAMPORTS_PER_SOL;
        } catch (error) {
            Logger.error('Failed to get balance', error);
            throw error;
        }
    }

    getPublicKey() {
        return this.wallet ? this.wallet.publicKey.toString() : null;
    }

    async subscribeToAccountChanges(callback) {
        try {
            if (!this.wallet) {
                throw new Error('Wallet not initialized');
            }

            const subscriptionId = this.connection.onAccountChange(
                this.wallet.publicKey,
                (accountInfo) => {
                    const balance = accountInfo.lamports / LAMPORTS_PER_SOL;
                    callback(balance);
                }
            );

            return subscriptionId;
        } catch (error) {
            Logger.error('Failed to subscribe to account changes', error);
            throw error;
        }
    }
} 
module.exports = SolanaConnection; 
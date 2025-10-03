import Connex from '@vechain/connex';
import contractABI from '../abi/OnChainAid.json';

interface DonationParams {
  category: string;
  message: string;
  amount: string;
}

class VeChainService {
  private connex: Connex | null = null;
  private contractAddress: string;

  constructor() {
    this.contractAddress = contractABI.contractAddress;
  }

  async initialize(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && (window as any).vechain) {
        this.connex = new Connex({
          node: 'https://testnet.vechain.org/',
          network: 'test'
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize VeChain:', error);
      return false;
    }
  }

  isVeWorldInstalled(): boolean {
    return typeof window !== 'undefined' && !!(window as any).vechain;
  }

  async connectWallet(): Promise<{ success: boolean; address?: string; error?: string }> {
    try {
      if (!this.isVeWorldInstalled()) {
        return {
          success: false,
          error: 'VeWorld wallet is not installed. Please install it from https://www.veworld.net/'
        };
      }

      await this.initialize();

      if (!this.connex) {
        return {
          success: false,
          error: 'Failed to connect to VeChain network'
        };
      }

      const status = this.connex.thor.status;
      const accounts = await this.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Connect to OnChainAid'
        }
      }).request();

      if (accounts && accounts.annex && accounts.annex.signer) {
        return {
          success: true,
          address: accounts.annex.signer
        };
      }

      return {
        success: false,
        error: 'Failed to get wallet address'
      };
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      return {
        success: false,
        error: error.message || 'Failed to connect wallet'
      };
    }
  }

  async makeDonation(params: DonationParams): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      if (!this.connex) {
        await this.initialize();
      }

      if (!this.connex) {
        return {
          success: false,
          error: 'VeChain connection not initialized'
        };
      }

      if (this.contractAddress === 'DEPLOY_CONTRACT_FIRST') {
        return {
          success: false,
          error: 'Smart contract not deployed yet. Please deploy the contract first and update the address in src/abi/OnChainAid.json'
        };
      }

      const amountInWei = this.connex.thor.account(this.contractAddress).method({
        inputs: [
          { name: '_category', type: 'string' },
          { name: '_message', type: 'string' }
        ],
        name: 'donate',
        outputs: [],
        payable: true,
        stateMutability: 'payable',
        type: 'function'
      });

      const valueInWei = BigInt(parseFloat(params.amount) * 1e18).toString();

      const clause = amountInWei.asClause(params.category, params.message);
      clause.value = valueInWei;

      const signingService = this.connex.vendor.sign('tx', [clause]);
      signingService.signer(await this.getCurrentAddress() || undefined);
      signingService.comment('Donate to OnChainAid');

      const result = await signingService.request();

      if (result && result.txid) {
        return {
          success: true,
          txId: result.txid
        };
      }

      return {
        success: false,
        error: 'Transaction was rejected or failed'
      };
    } catch (error: any) {
      console.error('Donation error:', error);
      return {
        success: false,
        error: error.message || 'Failed to process donation'
      };
    }
  }

  async getCurrentAddress(): Promise<string | null> {
    try {
      if (!this.connex) {
        await this.initialize();
      }

      if (!this.connex) {
        return null;
      }

      const accounts = await this.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Get current address'
        }
      }).request();

      if (accounts && accounts.annex && accounts.annex.signer) {
        return accounts.annex.signer;
      }

      return null;
    } catch (error) {
      console.error('Error getting current address:', error);
      return null;
    }
  }

  async getDonationCount(): Promise<number> {
    try {
      if (!this.connex) {
        await this.initialize();
      }

      if (!this.connex || this.contractAddress === 'DEPLOY_CONTRACT_FIRST') {
        return 0;
      }

      const contract = this.connex.thor.account(this.contractAddress);
      const method = contract.method({
        inputs: [],
        name: 'donationCount',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      });

      const result = await method.call();
      return parseInt(result.decoded[0]);
    } catch (error) {
      console.error('Error getting donation count:', error);
      return 0;
    }
  }

  async getTotalDonated(): Promise<string> {
    try {
      if (!this.connex) {
        await this.initialize();
      }

      if (!this.connex || this.contractAddress === 'DEPLOY_CONTRACT_FIRST') {
        return '0';
      }

      const contract = this.connex.thor.account(this.contractAddress);
      const method = contract.method({
        inputs: [],
        name: 'totalDonated',
        outputs: [{ name: '', type: 'uint256' }],
        stateMutability: 'view',
        type: 'function'
      });

      const result = await method.call();
      const totalInWei = BigInt(result.decoded[0]);
      const totalInVET = Number(totalInWei) / 1e18;
      return totalInVET.toFixed(2);
    } catch (error) {
      console.error('Error getting total donated:', error);
      return '0';
    }
  }

  getExplorerUrl(txId: string): string {
    return `https://explore-testnet.vechain.org/transactions/${txId}`;
  }
}

export const veChainService = new VeChainService();
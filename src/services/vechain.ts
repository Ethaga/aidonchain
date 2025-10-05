import Connex from '@vechain/connex';

interface DonationParams {
  category: string;
  message: string;
  amount: string; // amount in VET as string
}

interface DonationRecord {
  address: string;
  amountVET: number;
  rewardB3TR: number;
  category: string;
  message: string;
  txId: string;
  timestamp: number;
}

class VeChainService {
  private connex: Connex | null = null;
  private contractAddress: string;
  private readonly explorerBase = 'https://explore-testnet.vechain.org';

  // Reward configuration
  private readonly rewardRate = 5; // percent
  private readonly minDonation = 1; // VET

  // B3TR token address (informational)
  public readonly rewardTokenAddress = '0xdcCAaBd81B38e0dEEf4c202bC7F1261A4D9192C6';

  constructor() {
    // Set the donation contract address provided by the user
    this.contractAddress = '0x4E17357053dA4b473e2daa2c65C2c949545724b8';
  }

  async initialize(): Promise<boolean> {
    try {
      if (typeof window !== 'undefined' && (window as any).vechain) {
        this.connex = new Connex({
          node: 'https://sync-testnet.vechain.org',
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

      const accounts = await this.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: { type: 'text', content: 'Connect to AIDonchain' }
      }).request();

      if (accounts && accounts.annex && accounts.annex.signer) {
        return { success: true, address: accounts.annex.signer };
      }

      return { success: false, error: 'Failed to get wallet address' };
    } catch (error: any) {
      console.error('Wallet connection error:', error);
      return { success: false, error: error?.message || 'Failed to connect wallet' };
    }
  }

  private saveDonationRecord(record: DonationRecord) {
    try {
      const key = 'aidonchain_donations_v1';
      const existing = localStorage.getItem(key);
      const arr: DonationRecord[] = existing ? JSON.parse(existing) : [];
      arr.push(record);
      localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
      console.error('Failed to save donation record locally:', e);
    }
  }

  getDonationsFromStorage(): DonationRecord[] {
    try {
      const key = 'aidonchain_donations_v1';
      const existing = localStorage.getItem(key);
      return existing ? JSON.parse(existing) : [];
    } catch (e) {
      console.error('Failed to read donation records from storage:', e);
      return [];
    }
  }

  getLeaderboard(limit = 10) {
    const donations = this.getDonationsFromStorage();
    const totals: Record<string, { address: string; totalDonated: number; totalRewards: number }> = {};

    for (const d of donations) {
      if (!totals[d.address]) totals[d.address] = { address: d.address, totalDonated: 0, totalRewards: 0 };
      totals[d.address].totalDonated += d.amountVET;
      totals[d.address].totalRewards += d.rewardB3TR;
    }

    const list = Object.values(totals).sort((a, b) => b.totalRewards - a.totalRewards);
    return list.slice(0, limit);
  }

  async makeDonation(params: DonationParams): Promise<{ success: boolean; txId?: string; error?: string }> {
    try {
      if (!this.connex) {
        await this.initialize();
      }

      if (!this.connex) {
        return { success: false, error: 'VeChain connection not initialized' };
      }

      if (this.contractAddress === 'DEPLOY_CONTRACT_FIRST') {
        return { success: false, error: 'Smart contract not deployed yet. Update address in src/services/vechain.ts' };
      }

      const amountFloat = parseFloat(params.amount);
      if (isNaN(amountFloat) || amountFloat <= 0) {
        return { success: false, error: 'Invalid donation amount' };
      }

      if (amountFloat < this.minDonation) {
        return { success: false, error: `Minimum donation is ${this.minDonation} VET` };
      }

      // Build the contract method call for donate(category, message) payable
      const contract = this.connex.thor.account(this.contractAddress);
      const method = contract.method({
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

      // Prepare clause with the method
      const clause = method.asClause(params.category, params.message);

      // Value in Wei (VET uses 18 decimals)
      const valueInWei = BigInt(Math.round(amountFloat * 1e18)).toString();
      clause.value = valueInWei;

      const signingService = this.connex.vendor.sign('tx', [clause]);

      const currentAddr = await this.getCurrentAddress();
      if (currentAddr) signingService.signer(currentAddr);
      signingService.comment('Donate to AIDonchain');

      const result = await signingService.request();

      if (result && result.txid) {
        // Compute reward (percentage of donated value)
        const reward = (amountFloat * this.rewardRate) / 100;

        // Save donation record locally for history/leaderboard
        const record: DonationRecord = {
          address: currentAddr || 'unknown',
          amountVET: amountFloat,
          rewardB3TR: reward,
          category: params.category,
          message: params.message,
          txId: result.txid,
          timestamp: Date.now()
        };

        try {
          this.saveDonationRecord(record);
        } catch (e) {
          console.warn('Could not persist donation record:', e);
        }

        return { success: true, txId: result.txid };
      }

      return { success: false, error: 'Transaction was rejected or failed' };
    } catch (error: any) {
      console.error('Donation error:', error);
      return { success: false, error: error?.message || 'Failed to process donation' };
    }
  }

  async getCurrentAddress(): Promise<string | null> {
    try {
      if (!this.connex) await this.initialize();
      if (!this.connex) return null;

      const accounts = await this.connex.vendor.sign('cert', {
        purpose: 'identification',
        payload: { type: 'text', content: 'Get current address' }
      }).request();

      if (accounts && accounts.annex && accounts.annex.signer) return accounts.annex.signer;
      return null;
    } catch (error) {
      console.error('Error getting current address:', error);
      return null;
    }
  }

  async getDonationCount(): Promise<number> {
    try {
      if (!this.connex) await this.initialize();
      if (!this.connex || this.contractAddress === 'DEPLOY_CONTRACT_FIRST') return 0;

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
      if (!this.connex) await this.initialize();
      if (!this.connex || this.contractAddress === 'DEPLOY_CONTRACT_FIRST') return '0';

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
    return `${this.explorerBase}/transactions/${txId}`;
  }
}

export const veChainService = new VeChainService();

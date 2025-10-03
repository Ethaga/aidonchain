# OnChainAid - VeWorld Wallet Integration Guide

## 1. Prerequisites

- **VeWorld Wallet**: Install dari [https://www.veworld.net/](https://www.veworld.net/)
- **Node.js**: Versi 16 atau lebih tinggi
- **Hardhat atau Remix IDE**: Untuk deploy smart contract

## 2. Deploy Smart Contract ke VeChainThor Testnet

### Option A: Menggunakan Remix IDE (Recommended untuk pemula)

1. Buka [Remix IDE](https://remix.ethereum.org/)
2. Buat file baru: `OnChainAid.sol`
3. Copy paste kode dari `contracts/OnChainAid.sol`
4. Compile contract (Solidity ^0.8.0)
5. Di tab Deploy:
   - Pilih Environment: "Injected Provider - VeWorld"
   - Pastikan VeWorld wallet terbuka
   - Connect ke VeChainThor Testnet
   - Klik "Deploy"
   - Konfirmasi transaksi di VeWorld
6. **PENTING**: Copy alamat contract yang ter-deploy

### Option B: Menggunakan Hardhat

```bash
# Install dependencies
npm install --save-dev hardhat @vechain/hardhat-vechain @vechain/hardhat-web3

# Initialize Hardhat
npx hardhat init

# Deploy script akan dibuat secara manual
```

## 3. Update Contract Address di Aplikasi

Setelah contract berhasil di-deploy:

1. Buka file: `src/abi/OnChainAid.json`
2. Update field `contractAddress`:
   ```json
   {
     "contractAddress": "0xYOUR_DEPLOYED_CONTRACT_ADDRESS",
     "abi": [...]
   }
   ```
3. Save file

## 4. Mendapatkan VET Testnet (untuk testing)

1. Buka VeWorld wallet
2. Switch ke Testnet
3. Copy address Anda
4. Request faucet dari:
   - [VeChain Faucet](https://faucet.vecha.in/)
   - [VeChain Energy Faucet](https://faucet.vechain.energy/)

## 5. Jalankan Aplikasi

```bash
# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

## 6. Testing Flow

1. **Buka aplikasi** di browser
2. **Install VeWorld** (jika belum)
3. **Klik "Connect VeWorld"** di header
4. **Konfirmasi** connection di VeWorld popup
5. **Navigate ke "Donate"** page
6. **Pilih kategori** dan **masukkan amount**
7. **Klik "Donate"** button
8. **VeWorld popup akan muncul** untuk konfirmasi transaksi
9. **Approve transaksi**
10. **Success notification** akan muncul dengan link ke explorer

## 7. Smart Contract Functions

### User Functions:
- `donate(category, message)`: Membuat donasi (payable)
- `getDonation(donationId)`: Get detail donasi
- `getDonationsByDonor(address)`: Get semua donasi dari donor

### Admin Functions (Only Owner):
- `verifyRecipient(address, name, category)`: Verifikasi penerima bantuan
- `distributeFunds(donationId, recipient)`: Distribusikan dana ke penerima
- `emergencyWithdraw()`: Emergency withdrawal

### View Functions:
- `donationCount()`: Total jumlah donasi
- `totalDonated()`: Total amount yang didonasikan
- `getBalance()`: Contract balance

## 8. Network Information

### VeChainThor Testnet:
- **RPC URL**: https://testnet.vechain.org/
- **Chain ID**: 0x27 (39)
- **Explorer**: https://explore-testnet.vechain.org/
- **Symbol**: VET

### VeChainThor Mainnet:
- **RPC URL**: https://mainnet.vechain.org/
- **Chain ID**: 0x4a (74)
- **Explorer**: https://explore.vechain.org/
- **Symbol**: VET

## 9. Troubleshooting

### "VeWorld wallet is not installed"
- Install VeWorld dari [https://www.veworld.net/](https://www.veworld.net/)
- Refresh halaman setelah instalasi

### "Transaction failed"
- Pastikan Anda memiliki cukup VET di testnet
- Request dari faucet jika saldo tidak cukup
- Pastikan contract address sudah di-update di `src/abi/OnChainAid.json`

### "Smart contract not deployed yet"
- Deploy contract terlebih dahulu ke VeChainThor Testnet
- Update contract address di `src/abi/OnChainAid.json`

### Build errors
```bash
# Clear cache dan rebuild
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 10. Security Notes

- **JANGAN** share private key Anda
- Contract owner memiliki privilege khusus (verify recipient, distribute funds)
- Semua transaksi di-record permanently di blockchain
- Test thoroughly di testnet sebelum deploy ke mainnet

## 11. Next Steps

Untuk production deployment:
1. Deploy contract ke VeChainThor Mainnet
2. Update contract address untuk mainnet
3. Test semua functionality
4. Setup proper admin controls
5. Consider multi-sig wallet untuk owner functions
6. Audit smart contract untuk security issues

## Resources

- [VeChain Documentation](https://docs.vechain.org/)
- [VeWorld Wallet](https://www.veworld.net/)
- [Connex Documentation](https://docs.vechain.org/connex/)
- [VeChain Explorer](https://explore.vechain.org/)
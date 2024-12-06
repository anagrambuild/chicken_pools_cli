import * as dotenv from 'dotenv';
import { ethers } from 'ethers';

import ChickenLauncherAbi from './abi/ChickenLauncher.json';

const LAUNCHER_CONTRACT_ADDRESS = '0x4db097b90530f111e88325e514c9a0d59392db9e';

dotenv.config();

(async () => {
  try {
    const walletAddress = process.env.PUBLIC_KEY;
    const privateKey = process.env.PRIVATE_KEY;
    const rpcUrl = process.env.RPC_URL;

    if (!walletAddress) {
      throw new Error('WALLET_ADDRESS must be provided, see env.example');
    }

    if (!privateKey) {
      throw new Error('PRIVATE_KEY must be provided, see env.example');
    }

    if (!rpcUrl) {
      throw new Error('RPC_URL must be provided, see env.example');
    }

    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const wallet = new ethers.Wallet(privateKey, provider);
    const contract = new ethers.Contract(LAUNCHER_CONTRACT_ADDRESS, ChickenLauncherAbi, wallet);

    const tokenName = 'HappyCats05';
    const tokenSymbol = 'HCA5';
    const initialMint = ethers.parseUnits('1000', 18);
    const initialOwner = walletAddress;
    const supplyCap = ethers.parseUnits('1000000', 18);

    const tx = contract.launch(tokenName, tokenSymbol, initialMint, initialOwner, supplyCap);
    console.log(`Transaction hash: ${tx}`);
  } catch (error) {
    console.error(error);
  }
})().catch((error) => {
  console.error(error);
});

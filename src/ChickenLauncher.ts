import { ethers } from 'ethers';

import ChickenLauncherAbi from './abi/ChickenLauncher.json';

const LAUNCHER_CONTRACT_ADDRESS = '0x4db097b90530f111e88325e514c9a0d59392db9e';

export class ChickenLauncher {
  rpcUrl: string;
  wallet: ethers.Wallet;
  provider: ethers.JsonRpcProvider;
  contract: ethers.Contract;

  constructor(rpcUrl: string, wallet: ethers.Wallet, provider: ethers.JsonRpcProvider) {
    this.rpcUrl = rpcUrl;
    this.wallet = wallet;
    this.provider = provider;
    this.contract = new ethers.Contract(LAUNCHER_CONTRACT_ADDRESS, ChickenLauncherAbi, wallet);
  }

  async launch(
    tokenName: string,
    tokenSymbol: string,
    initialMint: number,
    initialOwner: string,
    supplyCap: number,
  ): Promise<void> {
    const initialMintWei = ethers.parseUnits(initialMint.toString(), 18);
    const supplyCapWei = ethers.parseUnits(supplyCap.toString(), 18);
    const tx = await this.contract.launch(tokenName, tokenSymbol, initialMintWei, initialOwner, supplyCapWei);
    console.log(`Transaction hash: ${tx.hash}`);
  }
}

import { ethers } from 'ethers';

import ChickenPoolAbi from './abi/PlayChicken.json';

const CHICKEN_POOL_ADDRESS = '0x9ee040266605a8b0b65d859cfa6e2b7d5f34c163';
const CONFIRMS = 3;

export class ChickenPool {
  rpcUrl: string;
  wallet: ethers.Wallet;
  provider: ethers.JsonRpcProvider;
  contract: ethers.Contract;

  constructor(rpcUrl: string, wallet: ethers.Wallet, provider: ethers.JsonRpcProvider) {
    this.rpcUrl = rpcUrl;
    this.wallet = wallet;
    this.provider = provider;
    this.contract = new ethers.Contract(CHICKEN_POOL_ADDRESS, ChickenPoolAbi, wallet);
  }

  // function start(address _token, uint256 _buyIn, uint256 _slashingPercent) external whenNotPaused nonReentrant {
  async start(token: string, buyIn: number, slashingPercent: number): Promise<void> {
    const buyInInWei = ethers.parseEther(buyIn.toString());
    const tx = await this.contract.start(token, buyInInWei, slashingPercent);
    console.log(`Transaction hash: ${tx.hash}`);
  }

  async join(poolId: number, deposit: number): Promise<void> {
    const depositWei = ethers.parseEther(deposit.toString());
    const tx = await this.contract.join(poolId, depositWei);
    console.log(`Transaction hash: ${tx.hash}`);
  }

  async withdraw(poolId: number): Promise<void> {
    const tx = await this.contract.withdraw(poolId);
    console.log(`Transaction hash: ${tx.hash}`);
    const receipt = await tx.wait(CONFIRMS);
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
  }

  async claim(poolId: number): Promise<void> {
    const tx = await this.contract.claim(poolId);
    console.log(`Transaction hash: ${tx.hash}`);
    const receipt = await tx.wait(CONFIRMS);
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
  }

  async withdrawProtocolFee(poolId: number): Promise<void> {
    const tx = await this.contract.withdrawProtocolFee(poolId);
    console.log(`Transaction hash: ${tx.hash}`);
    const receipt = await tx.wait(CONFIRMS);
    console.log(`Transaction confirmed in block: ${receipt.blockNumber}`);
  }

  getAddress(): string {
    return CHICKEN_POOL_ADDRESS;
  }
}

import { ethers } from 'ethers';

import RewardPoolAbi from './abi/RewardChicken.json';

const REWARD_POOL_ADDRESS = '0x0c41734FD47D62F26B49f096210063df6307d618';

export class RewardPool {
    rpcUrl: string;
    wallet: ethers.Wallet;
    provider: ethers.JsonRpcProvider;
    contract: ethers.Contract;

    constructor(rpcUrl: string, wallet: ethers.Wallet, provider: ethers.JsonRpcProvider) {
        this.rpcUrl = rpcUrl;
        this.wallet = wallet;
        this.provider = provider;
        this.contract = new ethers.Contract(REWARD_POOL_ADDRESS, RewardPoolAbi, wallet);
    }

    // function start(address _token, uint256 _start, uint256 _end, uint256 _rewardAmount, uint256 _minimumDeposit)
    async start(token: string, start: number, end: number, rewardAmount: number, minimumDeposit: number): Promise<void> {
        const currentBlock = await this.provider.getBlockNumber();
        const rewardInWei = ethers.parseEther(rewardAmount.toString());
        const minimumDepositInWei = ethers.parseEther(minimumDeposit.toString());
        const startBlock = currentBlock + start;
        const endBlock = startBlock + end;
        console.log(`Start block: ${startBlock}`);
        console.log(`End block: ${endBlock}`);
        const tx = await this.contract.start(token, startBlock, endBlock, rewardInWei, minimumDepositInWei);
        const receipt = await this.provider.getTransactionReceipt(tx.hash);
        if (!receipt) {
            console.log('Transaction failed');
            return;
        }
        for (const log of receipt.logs) {
            try {
                const parsedLog = this.contract.interface.parseLog(log);
                console.log(parsedLog);
            } catch (error) {
                console.log(error);
            }
        }
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
    }

    async claim(poolId: number): Promise<void> {
        const tx = await this.contract.claim(poolId);
        console.log(`Transaction hash: ${tx.hash}`);
    }

    async withdrawProtocolFee(poolId: number): Promise<void> {
        const tx = await this.contract.withdrawProtocolFee(poolId);
        console.log(`Transaction hash: ${tx.hash}`);
    }

    getAddress(): string {
        return REWARD_POOL_ADDRESS;
    }

}
import { ethers } from 'ethers';

import ERC20Abi from './abi/ERC20.json';

// Happy Cats 0x161A73333250907C5Ce79c6D785C898Ffb2d6a85

export class TokenERC20 {
    rpcUrl: string;
    wallet: ethers.Wallet;
    provider: ethers.JsonRpcProvider;
    address: string;
    contract: ethers.Contract;

    constructor(rpcUrl: string, wallet: ethers.Wallet, provider: ethers.JsonRpcProvider, address: string) {
        this.rpcUrl = rpcUrl;
        this.wallet = wallet;
        this.provider = provider;
        this.address = address;
        this.contract = new ethers.Contract(address, ERC20Abi, wallet);
    }

    async name(): Promise<string> {
        const name = await this.contract.name();
        return name;
    }

    async balance(wallet: string): Promise<string> {
        const balance = await this.contract.balanceOf(wallet);
        const balanceEth = ethers.formatEther(balance);
        return balanceEth;
    }

    async approve(spender: string, amount: number): Promise<void> {
        const amountInWei = ethers.parseEther(amount.toString());
        const tx = await this.contract.approve(spender, amountInWei);
        console.log(`Transaction hash: ${tx.hash}`);
    }
}
import yargs from 'yargs/yargs';
import { hideBin } from 'yargs/helpers';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';

import { RewardPool } from './RewardPool';
import { ChickenPool } from './ChickenPool';
import { TokenERC20 } from './TokenERC20';
import { ChickenLauncher } from './ChickenLauncher';

dotenv.config();

function percentToBps(percent: number): number {
  return percent * 100;
}

async function print_token_balance(
  rpcUrl: string,
  wallet: ethers.Wallet,
  provider: ethers.JsonRpcProvider,
  token: string,
): Promise<void> {
  console.log(`Checking balance for token: ${token}`);
  const contract = new TokenERC20(rpcUrl, wallet, provider, token);
  const name = await contract.name();
  const balance = await contract.balance(wallet.address);
  console.log(`${name} balance: ${balance}`);
  return;
}

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

    // Command line interface with yargs
    // Command line interface with yargs
    yargs(hideBin(process.argv))
      // function start(address _token, uint256 _start, uint256 _end, uint256 _rewardAmount, uint256 _minimumDeposit)
      .command(
        'start <option>',
        'Join a pool by type',
        (yargs) => {
          return yargs
            .positional('option', {
              describe: 'Type of the pool (chicken or reward)',
              type: 'string',
              choices: ['chicken', 'reward'] as const,
              demandOption: true,
            })
            .option('token', {
              alias: 't',
              describe: 'Token for the pool',
              type: 'string',
              demandOption: true,
            })
            .option('start', {
              alias: 's',
              describe: 'Start time',
              type: 'number',
            })
            .option('end', {
              alias: 'e',
              describe: 'Start time',
              type: 'number',
            })
            .option('reward', {
              alias: 'r',
              describe: 'Reward amount',
              type: 'number',
            })
            .option('deposit', {
              alias: 'd',
              describe: 'Minimum deposit',
              type: 'number',
            })
            .option('buyin', {
              alias: 'b',
              describe: 'Buy in amount',
              type: 'number',
            })
            .option('slashing', {
              describe: 'Slashing percent',
              type: 'number',
            });
        },
        async (argv) => {
          const { option, token, start, end, reward, deposit, buyin, slashing } = argv;
          try {
            console.log(`Starting pool: ${option}, Token: ${token}`);
            if (option === 'reward') {
              if (!start || !end || !reward || !deposit) {
                throw new Error('Missing start, end, reward or deposit for reward pool');
              }

              const contract = new RewardPool(rpcUrl, wallet, provider);

              const rewardPoolAddress = contract.getAddress();
              const tokenContract = new TokenERC20(rpcUrl, wallet, provider, token);
              const rewardAndFee = reward + (reward * 1000) / 10000;
              console.log(`Approving ${rewardAndFee} tokens for ${rewardPoolAddress}`);
              await tokenContract.approve(rewardPoolAddress, rewardAndFee);
              await contract.start(token, start, end, reward, deposit);
            } else if (option === 'chicken') {
              if (!buyin || !slashing) {
                throw new Error('Missing buyin or slashing for chicken pool');
              }

              const slashingBps = percentToBps(slashing);
              const contract = new ChickenPool(rpcUrl, wallet, provider);
              await contract.start(token, buyin, slashingBps);
            } else {
              throw new Error('Invalid pool type');
            }
            await print_token_balance(rpcUrl, wallet, provider, token);
          } catch (error) {
            console.error('Error starting pool:', error);
          }
        },
      )
      .command(
        'join <option> <poolId> <deposit>',
        'Join a pool by option and pool ID',
        (yargs) => {
          return yargs
            .positional('option', {
              describe: 'Type of the pool (chicken or reward)',
              type: 'string',
              choices: ['chicken', 'reward'] as const,
              demandOption: true,
            })
            .positional('poolId', {
              describe: 'ID of the pool to join',
              type: 'number',
              demandOption: true,
            })
            .positional('deposit', {
              describe: 'Amount to deposit',
              type: 'number',
              demandOption: true,
            })
            .option('token', {
              alias: 't',
              describe: 'Token for the pool',
              type: 'string',
              demandOption: true,
            });
        },
        async (argv) => {
          const { option, poolId, deposit, token } = argv;
          try {
            console.log(`Joining pool: ${option}, ID: ${poolId}, Deposit: ${deposit}`);
            if (option === 'reward') {
              const contract = new RewardPool(rpcUrl, wallet, provider);
              const rewardPoolAddress = contract.getAddress();
              const tokenContract = new TokenERC20(rpcUrl, wallet, provider, token);
              console.log(`Approving ${deposit} tokens for ${rewardPoolAddress}`);
              await tokenContract.approve(rewardPoolAddress, deposit);
              await contract.join(poolId, deposit);
            } else if (option === 'chicken') {
              const contract = new ChickenPool(rpcUrl, wallet, provider);
              const chickenPoolAddress = contract.getAddress();
              const tokenContract = new TokenERC20(rpcUrl, wallet, provider, token);
              console.log(`Approving ${deposit} tokens for ${chickenPoolAddress}`);
              await tokenContract.approve(chickenPoolAddress, deposit);
              await contract.join(poolId, deposit);
            } else {
              throw new Error('Invalid pool type');
            }
            await print_token_balance(rpcUrl, wallet, provider, token);
          } catch (error) {
            console.error('Error joining pool:', error);
          }
        },
      )
      .command(
        'withdraw <option> <poolId>',
        'Withdraw from a pool by option and pool ID',
        (yargs) => {
          return yargs
            .positional('option', {
              describe: 'Type of the pool (chicken or reward)',
              type: 'string',
              choices: ['chicken', 'reward'] as const,
              demandOption: true,
            })
            .positional('poolId', {
              describe: 'ID of the pool to withdraw from',
              type: 'number',
              demandOption: true,
            })
            .option('token', {
              alias: 't',
              describe: 'Token for the pool',
              type: 'string',
              demandOption: true,
            });
        },
        async (argv) => {
          const { option, poolId, token } = argv;
          try {
            console.log(`Withdrawing from pool: ${option}, ID: ${poolId}`);
            if (option === 'reward') {
              const contract = new RewardPool(rpcUrl, wallet, provider);
              await contract.withdraw(poolId);
            } else if (option === 'chicken') {
              const contract = new ChickenPool(rpcUrl, wallet, provider);
              await contract.withdraw(poolId);
            } else {
              throw new Error('Invalid pool type');
            }
            await print_token_balance(rpcUrl, wallet, provider, token);
          } catch (error) {
            console.error('Error withdrawing from pool:', error);
          }
        },
      )
      .command(
        'claim <option> <poolId>',
        'Claim rewards from a pool by option and pool ID',
        (yargs) => {
          return yargs
            .positional('option', {
              describe: 'Type of the pool (chicken or reward)',
              type: 'string',
              choices: ['chicken', 'reward'] as const,
              demandOption: true,
            })
            .positional('poolId', {
              describe: 'ID of the pool to claim rewards from',
              type: 'number',
              demandOption: true,
            })
            .option('token', {
              alias: 't',
              describe: 'Token for the pool',
              type: 'string',
              demandOption: true,
            });
        },
        async (argv) => {
          const { option, poolId, token } = argv;
          try {
            if (option === 'reward') {
              const contract = new RewardPool(rpcUrl, wallet, provider);
              await contract.claim(poolId);
            } else if (option === 'chicken') {
              const contract = new ChickenPool(rpcUrl, wallet, provider);
              await contract.claim(poolId);
            } else {
              throw new Error('Invalid pool type');
            }
            await print_token_balance(rpcUrl, wallet, provider, token);
          } catch (error) {
            console.error('Error claiming rewards:', error);
          }
        },
      )
      .command(
        'withdrawProtocolFee <option> <poolId>',
        'Admin withdraw protocol fee from a pool by option and pool ID',
        (yargs) => {
          return yargs
            .positional('option', {
              describe: 'Type of the pool (chicken or reward)',
              type: 'string',
              choices: ['chicken', 'reward'] as const,
              demandOption: true,
            })
            .positional('poolId', {
              describe: 'ID of the pool to claim rewards from',
              type: 'number',
              demandOption: true,
            })
            .option('token', {
              alias: 't',
              describe: 'Token for the pool',
              type: 'string',
              demandOption: true,
            });
        },
        async (argv) => {
          const { option, poolId, token } = argv;
          try {
            if (option === 'reward') {
              const contract = new RewardPool(rpcUrl, wallet, provider);
              await contract.withdrawProtocolFee(poolId);
            } else if (option === 'chicken') {
              const contract = new ChickenPool(rpcUrl, wallet, provider);
              await contract.withdrawProtocolFee(poolId);
            } else {
              throw new Error('Invalid pool type');
            }
            await print_token_balance(rpcUrl, wallet, provider, token);
          } catch (error) {
            console.error('Error withdrawing rewards:', error);
          }
        },
      )
      .command(
        'balance',
        'Check the balance of a token',
        (yargs) => {
          return yargs.option('token', {
            alias: 't',
            describe: 'Token address',
            type: 'string',
            demandOption: true,
          });
        },
        async (argv) => {
          const { token } = argv;
          try {
            await print_token_balance(rpcUrl, wallet, provider, token);
          } catch (error) {
            console.error('Error checking token balance:', error);
          }
        },
      )
      .command(
        'launch <tokenName> <tokenSymbol> <initialMint> <initialOwner> <supplyCap>',
        'Launch a token',
        (yargs) => {
          return yargs
            .positional('tokenName', {
              describe: 'Name of the token',
              type: 'string',
              demandOption: true,
            })
            .positional('tokenSymbol', {
              describe: 'Symbol of the token',
              type: 'string',
              demandOption: true,
            })
            .positional('initialMint', {
              describe: 'Initial mint',
              type: 'number',
              demandOption: true,
            })
            .positional('initialOwner', {
              describe: 'Initial owner',
              type: 'string',
              demandOption: true,
            })
            .positional('supplyCap', {
              describe: 'Supply cap',
              type: 'number',
              demandOption: true,
            });
        },
        async (argv) => {
          const { tokenName, tokenSymbol, initialMint, initialOwner, supplyCap } = argv;
          try {
            const contract = new ChickenLauncher(rpcUrl, wallet, provider);
            await contract.launch(tokenName, tokenSymbol, initialMint, initialOwner, supplyCap);
          } catch (error) {
            console.error('Error launching token:', error);
          }
        },
      )
      .demandCommand(1, 'You need to specify at least one command')
      .strict()
      .help()
      .parse();
  } catch (error) {
    console.error(error);
    throw 'Process failed';
  }
})().catch((error) => {
  console.error(error);
});

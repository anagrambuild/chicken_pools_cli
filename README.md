# Chicken

## Overview

`breeze` is a command-line interface (CLI) tool for interacting with chicken pools on the Ethereum blockchain. It allows users to start, join, withdraw, claim rewards, and manage protocol fees for chicken and reward pools.

## Installation

To install the dependencies, run:

```sh
bun install --dev
```

## Usage

The CLI tool `breeze` provides several commands to interact with the chicken pools. Below are the available commands and their usage.

### Commands

#### Start a Pool

Start a new chicken or reward pool.

```sh
breeze start <option> --token <token> --start <start> --end <end> --reward <reward> --deposit <deposit> --buyin <buyin> --slashing <slashing>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

token

: Token address for the pool
- 

start

: Start time (in blocks)
- 

end

: End time (in blocks)
- 

reward

: Reward amount
- 

deposit

: Minimum deposit amount
- 

buyin

: Buy-in amount
- 

slashing

: Slashing percent

Example:

```sh
breeze start reward --token 0xTokenAddress --start 100 --end 200 --reward 10 --deposit 1
breeze start chicken --token 0xTokenAddress --buyin 5 --slashing 10
```

#### Join a Pool

Join an existing chicken or reward pool.

```sh
breeze join <option> <poolId> <deposit> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to join
- 

deposit

: Amount to deposit
- 

token

: Token address for the pool

Example:

```sh
breeze join reward 1 5 --token 0xTokenAddress
breeze join chicken 2 3 --token 0xTokenAddress
```

#### Withdraw from a Pool

Withdraw from an existing chicken or reward pool.

```sh
breeze withdraw <option> <poolId> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to withdraw from
- 

token

: Token address for the pool

Example:

```sh
breeze withdraw reward 1 --token 0xTokenAddress
breeze withdraw chicken 2 --token 0xTokenAddress
```

#### Claim Rewards

Claim rewards from an existing chicken or reward pool.

```sh
breeze claim <option> <poolId> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to claim rewards from
- 

token

: Token address for the pool

Example:

```sh
breeze claim reward 1 --token 0xTokenAddress
breeze claim chicken 2 --token 0xTokenAddress
```

#### Withdraw Protocol Fee

Admin withdraw protocol fee from an existing chicken or reward pool.

```sh
breeze withdrawProtocolFee <option> <poolId> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to withdraw protocol fee from
- 

token

: Token address for the pool

Example:

```sh
breeze withdrawProtocolFee reward 1 --token 0xTokenAddress
breeze withdrawProtocolFee chicken 2 --token 0xTokenAddress
```

#### Check Token Balance

Check the balance of a token.

```sh
breeze balance --token <token>
```

- 

token

: Token address

Example:

```sh
breeze balance --token 0xTokenAddress
```

#### Launch a Token

Launch a new token.

```sh
breeze launch <tokenName> <tokenSymbol> <initialMint> <initialOwner> <supplyCap>
```

- 

tokenName

: Name of the token
- 

tokenSymbol

: Symbol of the token
- 

initialMint

: Initial mint amount
- 

initialOwner

: Address of the initial owner
- 

supplyCap

: Supply cap

Example:

```sh
breeze launch MyToken MTK 1000000 0xOwnerAddress 1000000000
```

## Environment Variables

The following environment variables must be set in a `.env` file or in your environment:

- 

PRIVATE_KEY

: Private key of the wallet
- 

PUBLIC_KEY

: Public key of the wallet
- 

RPC_URL

: RPC URL of the Ethereum node

Example `.env` file:

```env
PRIVATE_KEY=your_private_key
PUBLIC_KEY=your_public_key
RPC_URL=https://mainnet.infura.io/v3/your_project_id
```

## License

This project is licensed under the ISC License.
```

This `README.md` provides a comprehensive guide to using the `breeze` CLI, including command descriptions and examples.
This `README.md` provides a comprehensive guide to using the `breeze` CLI, including command descriptions and examples.

jac18281828: @workspace Can you add installation instructions?

Workspace: Collecting workspace information

Sure, here are the installation instructions added to the 

README.md

:

```markdown
# breeze

## Overview

`breeze` is a command-line interface (CLI) tool for interacting with chicken pools on the Ethereum blockchain. It allows users to start, join, withdraw, claim rewards, and manage protocol fees for chicken and reward pools.

## Installation

To install the dependencies, run:

```sh
bun install --dev
```

## Usage

The CLI tool `breeze` provides several commands to interact with the chicken pools. Below are the available commands and their usage.

### Commands

#### Start a Pool

Start a new chicken or reward pool.

```sh
breeze start <option> --token <token> --start <start> --end <end> --reward <reward> --deposit <deposit> --buyin <buyin> --slashing <slashing>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

token

: Token address for the pool
- 

start

: Start time (in blocks)
- 

end

: End time (in blocks)
- 

reward

: Reward amount
- 

deposit

: Minimum deposit amount
- 

buyin

: Buy-in amount
- 

slashing

: Slashing percent

Example:

```sh
breeze start reward --token 0xTokenAddress --start 100 --end 200 --reward 10 --deposit 1
breeze start chicken --token 0xTokenAddress --buyin 5 --slashing 10
```

#### Join a Pool

Join an existing chicken or reward pool.

```sh
breeze join <option> <poolId> <deposit> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to join
- 

deposit

: Amount to deposit
- 

token

: Token address for the pool

Example:

```sh
breeze join reward 1 5 --token 0xTokenAddress
breeze join chicken 2 3 --token 0xTokenAddress
```

#### Withdraw from a Pool

Withdraw from an existing chicken or reward pool.

```sh
breeze withdraw <option> <poolId> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to withdraw from
- 

token

: Token address for the pool

Example:

```sh
breeze withdraw reward 1 --token 0xTokenAddress
breeze withdraw chicken 2 --token 0xTokenAddress
```

#### Claim Rewards

Claim rewards from an existing chicken or reward pool.

```sh
breeze claim <option> <poolId> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to claim rewards from
- 

token

: Token address for the pool

Example:

```sh
breeze claim reward 1 --token 0xTokenAddress
breeze claim chicken 2 --token 0xTokenAddress
```

#### Withdraw Protocol Fee

Admin withdraw protocol fee from an existing chicken or reward pool.

```sh
breeze withdrawProtocolFee <option> <poolId> --token <token>
```

- 

option

: Type of the pool (`chicken` or 

reward

)
- 

poolId

: ID of the pool to withdraw protocol fee from
- 

token

: Token address for the pool

Example:

```sh
breeze withdrawProtocolFee reward 1 --token 0xTokenAddress
breeze withdrawProtocolFee chicken 2 --token 0xTokenAddress
```

#### Check Token Balance

Check the balance of a token.

```sh
breeze balance --token <token>
```

- 

token

: Token address

Example:

```sh
breeze balance --token 0xTokenAddress
```

#### Launch a Token

Launch a new token.

```sh
breeze launch <tokenName> <tokenSymbol> <initialMint> <initialOwner> <supplyCap>
```

- 

tokenName

: Name of the token
- 

tokenSymbol

: Symbol of the token
- 

initialMint

: Initial mint amount
- 

initialOwner

: Address of the initial owner
- 

supplyCap

: Supply cap

Example:

```sh
breeze launch MyToken MTK 1000000 0xOwnerAddress 1000000000
```

## Environment Variables

The following environment variables must be set in a `.env` file or in your environment:

- 

PRIVATE_KEY

: Private key of the wallet
- 

PUBLIC_KEY

: Public key of the wallet
- 

RPC_URL

: RPC URL of the Ethereum node

Example `.env` file:

```env
PRIVATE_KEY=your_private_key
PUBLIC_KEY=your_public_key
RPC_URL=https://mainnet.infura.io/v3/your_project_id
```

## License

This project is licensed under the ISC License.
```
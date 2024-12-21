# Building a Full-Stack dApp on the Core Testnet

In this guide, we'll build a decentralized application (dApp) from scratch using React.js for the front-end and Ethers.js to interact with a smart contract deployed on the Core Testnet.

## What is a dApp?

A decentralized application (dApp) typically has:

- **A front-end (user interface)** that interacts with a blockchain through the user.
- **A smart contract (back-end)** that holds and manages data on the blockchain.

## Learning Goals

By the end of this tutorial, you'll have learned how to:

- Set up a MetaMask wallet to connect to the Core Testnet.
- Write, deploy, and test a simple smart contract using Hardhat.
- Create a front-end that interacts with your smart contract via Ethers.js.
- Read data from the smart contract.
- Write data to the smart contract.

## Prerequisites

Make sure you have the following software installed on your computer:

- **Git**: Version 2.44.0 or higher
- **Node.js**: Version 20.11.1 or higher
- **npm**: Version 10.2.4 or higher
- **MetaMask**: Chrome extension or another browser wallet

## Step 1: Setting Up the Development Environment

First, create a new directory for your project and navigate into it:

```bash
mkdir myfullstack-dapp
cd myfullstack-dapp
```

Now, let's initialize a Node.js project:

```bash
npm init --yes
```

## Step 2: Install Dependencies

We will need a few development tools:

- **Hardhat**: A framework for Ethereum development.
- **Chai**: Assertion library for testing.
- **Waffle**: A testing library for Ethereum smart contracts.

Run the following commands to install these:

```bash
npm install --save-dev hardhat
npm install --save-dev chai @nomiclabs/hardhat-waffle
```

## Step 3: Initialize Hardhat Project

Next, we'll initialize Hardhat:

```bash
npx hardhat
```

When prompted, choose the option "Create a javascript project" and select "No" when asked if you want to install additional dependencies.

This will generate a basic project structure:

```bash
myfullstack-dapp/
|-- .gitignore
|-- hardhat.config.js
|-- package-lock.json
|-- package.json
|-- README.md
|-- contracts/
|   |-- Lock.sol
|-- scripts/
|   |-- sample-script.js
|-- test/
|   |-- sample-test.js
```

## Step 4: Install MetaMask and Core Testnet

To interact with your dApp, you'll need **MetaMask**. Here's how you can set it up:

1. Install MetaMask as a browser extension from [MetaMask's website](https://metamask.io/).
2. Create a new wallet or use an existing one.
3. Connect MetaMask to the Core Testnet by adding it manually:

- **Network Name**: Core Testnet
- **RPC URL**: https://rpc.test.btcs.network
- **Chain ID**: 1115

For more details on configuring MetaMask with the Core Testnet, follow the [guide](https://metamask.io/).

## Step 5: Create a `secret.json` File

In the root folder of your project, create a `secret.json` file to store your MetaMask private key. This file will be used by Hardhat to deploy the smart contract.

The `secret.json` file should look like this:

```json
{
  "PrivateKey": "your-private-key-here"
}
```

**Important**: Never share this file publicly! Add it to `.gitignore` to avoid accidentally uploading it to GitHub.

## Step 6: Configure Hardhat for Core Testnet

Open the `hardhat.config.js` file and update it to include the Core Testnet settings:

```js
/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('@nomiclabs/hardhat-ethers');
require('@nomiclabs/hardhat-waffle');

const { PrivateKey } = require('./secret.json');

module.exports = {
  defaultNetwork: 'testnet',
  networks: {
    hardhat: {},
    testnet: {
      url: 'https://rpc.test.btcs.network',
      accounts: [PrivateKey],
      chainId: 1115,
    }
  },
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          evmVersion: 'paris',
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  paths: {
    sources: './contracts',
    cache: './cache',
    artifacts: './artifacts',
  },
  mocha: {
    timeout: 20000,
  },
};
```

## Step 7: Write Your Smart Contract

Now let's write the smart contract. Navigate to the `contracts` folder, delete the `Lock.sol` file, and create a new file named `Storage.sol`. Paste the following Solidity code into it:

```solidity
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

/**
 * @title Storage
 * @dev Store & retrieve value in a variable
 */
contract Storage {
    uint256 private number;

    /**
     * @dev Store value in variable
     * @param num value to store
     */
    function store(uint256 num) public {
        number = num;
    }

    /**
     * @dev Return value
     * @return value of 'number'
     */
    function retrieve() public view returns (uint256) {
        return number;
    }
}
```

### Explanation of the Contract:

- **Store Function**: `store(uint256 num)` allows users to store a new value in the `number` variable.
- **Retrieve Function**: `retrieve()` returns the current value stored in the `number` variable.

## Step 8: Compile the Smart Contract

Now, compile the contract:

```bash
npx hardhat compile
```

## Step 9: Deploy the Smart Contract

Create a new folder called `scripts` in the root of the project if unavailable, then create a new file in the `scripts` folder called `deploy.js`. This script will deploy your smart contract to the Core Testnet.

```js
const hre = require("hardhat");

async function main() {
  const Storage = await hre.ethers.getContractFactory("Storage");
  const storage = await Storage.deploy();

  await storage.deployed();
  console.log("Storage contract deployed to:", storage.address);

  console.log("Retrieve value:", await storage.retrieve());
  
  console.log("Store value 100 in the contract...");
  const tx = await storage.store(100);
  await tx.wait();

  console.log("Retrieve value after storing:", await storage.retrieve());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Run the deployment script:

```bash
npx hardhat run scripts/deploy.js --network testnet
```

You should see the contract deployed to the Core Testnet and the output showing the stored value.

## Step 10: Create the Frontend

Now let's build the frontend using React.

Clone the frontend template:

```bash
git clone https://github.com/harystyleseze/myfullstack-dapp-frontend.git
cd myfullstack-dapp-frontend
```

Install dependencies:

```bash
npm install
```

### Update the Contract Details in the Frontend

In `src/contracts`, create a new file `Storage.json` (this is the ABI generated by Hardhat when you deployed the contract). Copy the address of the deployed contract from the previous step and paste it in `src/components/App.tsx`.

```js
const contractAddress = '0x61C34f6C430DFD6Bcc14D5efCc18C7D799BEA5c6'; // Your deployed contract address
```

Start the frontend:

```bash
npm run dev
```

This will start the application, and you can open it in your browser at `http://localhost:5173`.

## Step 11: Interact with the dApp

1. **Connect MetaMask**: Make sure MetaMask is connected to the Core Testnet.
2. **Interact with the Smart Contract**:
    - Enter a number (e.g., 50) in the input field and click **Store** to store it in the smart contract.
    - This calls the `store` function, which changes the value of the `number` variable and stores it on the blockchain.
    - Confirm the transaction in MetaMask.
3. Once the transaction is confirmed, click **Read** to read the number from the blockchain.

## Conclusion

🎉 Congratulations! You've just built a full-stack dApp that interacts with a smart contract deployed on the Core Testnet. You've learned how to:

- Set up your development environment with Hardhat.
- Write and deploy a Solidity smart contract.
- Build a React.js front-end that communicates with the smart contract via Ethers.js.

You can now continue to enhance your dApp by adding new features or improving the user interface. Enjoy building on the blockchain! 🚀
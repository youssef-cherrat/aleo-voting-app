# 🧾 Aleo Voting React dApp 

## 🧠 Project Overview

This project is a **zero-knowledge voting decentralized application (dApp)** built using:

- **React** (frontend)
- **Leo** (smart contract language for Aleo)
- **Provable SDK + API** (backend infrastructure that connects the frontend to the Aleo blockchain)

It allows users to **create proposals**, **vote privately**, and **reveal tallies**, all using zero-knowledge cryptographic proofs. This ensures **vote privacy** and **verifiability**—votes are hidden but counted correctly.

---

## 🧱 Architecture Summary

| Layer         | Tool/Stack          | Purpose |
|---------------|---------------------|---------|
| Frontend      | React + Vite        | UI to interact with contract |
| Smart Contract| Leo (`voteuva4232025.aleo`) | Handles proposal/vote logic using ZKPs |
| Backend/API   | Provable + Aleo Testnet | Executes and stores contract logic securely |
| Wallet/Auth   | Aleo Private Keys   | Used to sign transactions from the UI |

---

## 🌐 Deployment Summary

- **Program Name**: `voteuva4232025.aleo`
- **Deployed on Aleo Testnet**
- **Account**: `aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs`
- **Transaction ID**: [`at1lrxxpu...`](https://testnet.explorer.provable.com/transaction/at1lrxxpu4cj9zvkxq8ngcd5jym5etk8usjsw20dwkwgvy5mqjrqyxq4vlkg2)

Deployment was done using the `leo deploy` command, which compiled and sent the contract to the Aleo testnet via Provable’s endpoint.

---

## 🚀 Getting Started with the Leo Wallet Adapter

To interact with this dApp, you'll need to install the **Leo Wallet Adapter**, which facilitates secure communication between your browser and the Aleo blockchain.

### 🔗 Download the Leo Wallet Adapter

You can download the Leo Wallet Adapter from the official Leo Wallet website: [https://www.leo.app/](https://www.leo.app/)

### 🛡️ Why Use the Leo Wallet Adapter?

The Leo Wallet Adapter is specifically designed for the Aleo blockchain, offering:

- **Seamless Integration**: Easily connect your wallet to Aleo dApps.
- **Enhanced Security**: Manage your Aleo keys securely.
- **User-Friendly Interface**: Intuitive design for both developers and users.

By using the Leo Wallet Adapter, you ensure a smooth and secure experience when interacting with Aleo-based applications.

---

## 🧪 How to Run & Test This dApp Locally (Frontend Integration)

### 1️⃣ Prerequisites

- **Node.js** and **npm**
- Optional: VS Code or browser of your choice

---

### 2️⃣ Clone & Install

```bash
git clone https://github.com/your-repo/aleo-voting-dapp.git
cd aleo-voting-dapp
npm install
```

---

### 3️⃣ Set Up Environment (Only Needed If You Intend to Deploy).

**Note**: This section is specifically for developers who wish to **deploy** their own Leo programs to the Aleo Testnet. If you're only interested in running the frontend locally without deploying, you can skip this section.

In /helloworld, the Aleo project has been set up using the Aleo CLI, if you intend to deploy an example .env.example file has been attached


#### 🛠️ Installing the Aleo CLI on Linux

To deploy your Leo program, you'll need to install the Aleo Command Line Interface (CLI) tools. Here's how you can set them up on a Linux system:

1. **Install Rust and Cargo**: Leo and Aleo CLI tools are built using Rust. ([Getting Started with Aleo's LEO Language: A Step-by-Step Guide to ...](https://medium.com/%40gameoverx/getting-started-with-aleos-leo-language-a-step-by-step-guide-to-installing-leo-cbea2d2bcddc?utm_source=chatgpt.com))

   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source $HOME/.cargo/env
   ```

2. **Install Git**: Ensure Git is installed to clone repositories. ([The Leo Command Line Interface | Welcome to the Leo Docs](https://docs.leo-lang.org/cli/overview?utm_source=chatgpt.com))

   ```bash
   sudo apt update
   sudo apt install git
   ```

3. **Clone and Install Leo**: Leo is Aleo's domain-specific language for writing zero-knowledge applications. ([Getting Started | Welcome to Aleo Documentation](https://developer.aleo.org/guides/introduction/getting_started?utm_source=chatgpt.com))

   ```bash
   git clone https://github.com/AleoHQ/leo.git
   cd leo
   cargo install --path .
   ```

4. **Verify Installation**: Confirm that Leo is installed correctly. ([Getting Started | Welcome to Aleo Documentation](https://developer.aleo.org/guides/introduction/getting_started?utm_source=chatgpt.com))

   ```bash
   leo --version
   ```

   You should see the installed version of Leo printed in the terminal.

#### 📄 Creating the `.env` File

At the root of your project directory, create a `.env` file with the following content:

```env
NETWORK=testnet
PRIVATE_KEY=user1PrivateKey
ENDPOINT=https://api.explorer.provable.com/v1
```


- **API_URL**: The endpoint for the Aleo Testnet via Provable.
- **NETWORK**: The Testnet Aleo network
- **PRIVATE_KEY**: Your Aleo account's private key, used for signing transactions to deploy
- ([Install Aleo Studio on Ubuntu using the Snap Store - Snapcraft](https://snapcraft.io/install/aleo-studio/ubuntu?utm_source=chatgpt.com), [The Leo Command Line Interface | Welcome to the Leo Docs](https://docs.leo-lang.org/cli/overview?utm_source=chatgpt.com))

> **Note**: This `.env` file is what leo deploy uses to to sign your contract to a specific network

#### 🚀 Deploying Your Leo Program

With the environment set up, you can now deploy your Leo program to the Aleo Testnet: ([sebsadface/aleo_workshop - GitHub](https://github.com/sebsadface/aleo_workshop?utm_source=chatgpt.com))

```bash
leo deploy
```
If you need further assistance or run into any issues during the setup, feel free to consult the [Aleo Developer Documentation](https://developer.aleo.org/) or reach out to the community on the [Leo Wallet Discord Server](https://discord.com/invite/54rdWVf9vz). Please note that the Aleo Discord and Leo Wallet servers are seperate, for Testnet Credits the Leo Wallet Discord is needed, and a more up to date invite link can be found under the faucet tab in the leo wallet extension. 

This command compiles your Leo program and sends it to the Aleo Testnet via the specified endpoint. Upon successful deployment, you'll receive a transaction ID, which you can use to verify the deployment status on the [Provable Explorer](https://testnet.explorer.provable.com/).


---

### 4️⃣ Fund Your Wallet with Testnet Credits

To interact with the Aleo testnet, you'll need testnet credits:

1. **Join the Aleo Discord Server**: [Leo Wallet Discord Server](https://discord.com/invite/54rdWVf9vz), the wallet adapter has an up to date link
2. **Navigate to the #faucet Channel**: Request testnet credits by following the instructions provided in the channel.

*Note*: Testnet credits are for testing purposes only and have no real-world value.

---

### 5️⃣ Run the App

```bash
npm run dev
```

This launches the app locally at:  
👉 [http://localhost:5173](http://localhost:5173)

---

### 6️⃣ Interact with the Smart Contract

From the frontend, you can now:

- **Submit proposals** — stored on-chain
- **Cast a vote (agree/disagree)** — uses zero-knowledge proofs
- **View public tallies** after voting concludes

Each action triggers:

1. A **ZK proof** generated via the Leo contract.
2. A **transaction sent** to the Aleo Testnet via the Provable API.
3. **Results shown** back in the UI after confirmations.

---

## 💡 Other Hints for Aleo Beginners

- **Understanding Aleo**: Aleo is a privacy-focused blockchain that uses zero-knowledge proofs to ensure transaction confidentiality.
- **Leo Language**: A Rust-inspired language designed for writing private applications on Aleo.
- **snarkOS**: The decentralized operating system that powers the Aleo network.
- **snarkVM**: The virtual machine that executes zero-knowledge proofs on Aleo.

For more information:

- [Aleo Developer Documentation](https://developer.aleo.org/)
- [Leo Language Guide](https://developer.aleo.org/leo/)

---

## 🎓 Educational Value

This dApp demonstrates:

- How **ZKPs** can power private, verifiable elections.
- Real-world deployment of Leo programs on a zk-powered testnet.
- Secure, cryptographically verified user interactions—all in a user-friendly React app.

---

## 🧩 Extensions & Curriculum Integration

### 🔧 Potential Extensions

- **Multi-Choice Voting**: Extend the contract to support multiple options per proposal.
- **Delegated Voting**: Implement vote delegation mechanisms.
- **Result Encryption**: Encrypt results until a predefined condition is met.

### 📚 Curriculum Integration

This project can serve as a practical assignment in courses covering:

- **Blockchain Development**
- **Cryptography**
- **Decentralized Applications**

Students can learn about:

- Writing smart contracts in Leo.
- Deploying to the Aleo testnet.
- Integrating frontend applications with blockchain backends.

---

## 🔗 Aleo Infrastructure Tools

- **snarkOS**: The decentralized operating system for zero-knowledge applications on Aleo. It handles networking, consensus, and state management. [Learn more](https://developer.aleo.org/concepts/network/zkcloud/snarkos/)
- **snarkVM**: The virtual machine that executes zero-knowledge proofs, enabling private computation on the Aleo network. [Learn more](https://developer.aleo.org/concepts/network/zkcloud/snarkvm/)

These tools are essential for developers building on the Aleo platform, providing the underlying infrastructure for private and secure applications to have someth8ing more local on a server side. 

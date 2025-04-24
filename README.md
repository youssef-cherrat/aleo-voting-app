# 🧾 Aleo Voting dApp — Instructor Overview

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

### 3️⃣ Set Up Environment

Create a `.env` file at the root:

```env
VITE_API_URL=https://api.explorer.provable.com/v1
VITE_PRIVATE_KEY=your-private-key-here
VITE_PROGRAM_ID=voteuva4232025.aleo
VITE_ADDRESS=aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs
```

- The **private key** and **address** are for signing transactions.
- The **program ID** matches the deployed contract.

---

### 4️⃣ Run the App

```bash
npm run dev
```

This launches the app locally at:  
👉 [http://localhost:5173](http://localhost:5173)

---

### 5️⃣ Interact with the Smart Contract

From the frontend, you can now:

- **Submit proposals** — stored on-chain
- **Cast a vote (agree/disagree)** — uses zero-knowledge proofs
- **View public tallies** after voting concludes

Each action triggers:
1. A **ZK proof** generated via the Leo contract.
2. A **transaction sent** to the Aleo Testnet via the Provable API.
3. **Results shown** back in the UI after confirmations.

---

## 🔍 Educational Value

This dApp demonstrates:
- How **ZKPs** can power private, verifiable elections.
- Real-world deployment of Leo programs on a zk-powered testnet.
- Secure, cryptographically verified user interactions—all in a user-friendly React app.


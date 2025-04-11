# Aleo Voting dApp — React + Leo + Provable

This project is a zero-knowledge voting decentralized application (dApp) built using **React**, **Leo**, and the **Aleo Testnet**. It was initialized using [ProvableHQ’s `create-leo-app` React template](https://github.com/ProvableHQ/sdk/tree/mainnet/create-leo-app/template-react-leo) and extended with a fully functioning on-chain voting contract.


## 📜 Contract Deployment Details

- **Program Name**: `voteuvacsprojectsp25.aleo`
- **Deployed By**: `aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs`
- **Deployment Endpoint**: `https://api.explorer.provable.com/v1`
- **Transaction ID**:  
  [`at1ys4q9lfxftsr0zc5p6gqf6tsnrrqph296tywnh5zrrqc3zvacygqr7jad9`](https://testnet.explorer.provable.com/transaction/at1ys4q9lfxftsr0zc5p6gqf6tsnrrqph296tywnh5zrrqc3zvacygqr7jad9)
- **Address Explorer View**:  
  [View on Provable Testnet Explorer](https://testnet.explorer.provable.com/address/aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs)


## 📦 Development Instructions

### 🔧 Start in Development Mode

```bash
npm install
npm run dev
```

Your app should now be running at:  
http://localhost:5173/


### 🔨 Compile the Leo Program

1. Navigate to the Leo program directory:
   ```bash
   cd helloworld
   ```

2. Copy `.env.example` to `.env` and provide your private key:
   ```bash
   cp .env.example .env
   ```

3. Edit the `.env` file and insert:
   ```env
   PRIVATE_KEY=your-private-key
   ENDPOINT=https://api.explorer.provable.com/v1
   NETWORK=testnet
   ```

4. Build the Leo program:
   ```bash
   leo build
   ```

---

### 🚀 Deploy the Program

To deploy your Leo smart contract to Aleo Testnet:

```bash
leo deploy --broadcast
```

---

## 🧠 Notes on Deployment

Aleo programs require unique names when deployed. Ensure the program name is updated in:
- `src/main.leo`
- `program.json`
- Any associated `.in` files in the `inputs/` directory

This project uses the official Aleo testnet endpoint via Provable:
```env
ENDPOINT=https://api.explorer.provable.com/v1
```

---

## ⚙️ Production Deployment

```bash
npm run build
```

Upload the `dist/` directory to a hosting provider such as Netlify or Vercel.

> 🛡️ If encountering SharedArrayBuffer issues in production:
>
> Add the following headers to your hosting config:
> ```
> Cross-Origin-Opener-Policy: same-origin
> Cross-Origin-Embedder-Policy: require-corp
> ```

---

## 📚 Resources

- 🔗 [Provable Explorer](https://testnet.explorer.provable.com)
- 🔗 [Leo Language Documentation](https://docs.leo-lang.org/)
- 🔗 [Provable SDK Template](https://github.com/ProvableHQ/sdk/tree/mainnet/create-leo-app/template-react-leo)

---

## 👨‍💻 Author

This smart contract and voting system was developed and deployed by:  
**`aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs`**

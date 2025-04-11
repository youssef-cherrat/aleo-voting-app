import React from "react";
import {
  WalletProvider,
  useWallet,
} from "@demox-labs/aleo-wallet-adapter-react";
import {
  WalletModalProvider,
  WalletMultiButton,
} from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

// Admin address (change to yours if needed)
const ADMIN_ADDRESS =
  "aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs";

function WalletInfo() {
  const { publicKey } = useWallet();
  const isAdmin = publicKey === ADMIN_ADDRESS;

  return (
    <div
      className="card text-white bg-dark shadow-sm"
      style={{
        maxWidth: "700px",
        minHeight: "520px",
        margin: "2rem auto",
        padding: "3rem 2rem",
        borderRadius: "1.5rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Connect Wallet Button */}
      <div className="mb-4">
        <WalletMultiButton className="btn btn-primary" />
      </div>

      {/* If connected */}
      {publicKey && (
        <>
          {/* Success alert */}
          <div className="alert alert-success text-center w-100" role="alert">
            ✅ Wallet connected successfully!
          </div>

          {/* Welcome message */}
          <h3 className="text-light mb-3">👋 Welcome!</h3>

          {/* User address */}
          <p className="text-muted small text-center">{publicKey}</p>

          {/* Admin badge */}
          {isAdmin && (
            <div className="alert alert-success text-center w-100" role="alert">
              🛡️ <strong>You are the admin of this voting system.</strong>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function WalletConnect() {
  return (
    <WalletProvider wallets={[new LeoWalletAdapter()]} autoConnect>
      <WalletModalProvider>
        <WalletInfo />
      </WalletModalProvider>
    </WalletProvider>
  );
}

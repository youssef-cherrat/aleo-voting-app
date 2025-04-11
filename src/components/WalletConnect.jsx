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

const ADMIN_ADDRESS =
  "aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs";

function WalletInfo() {
  const { publicKey } = useWallet();
  const isAdmin = publicKey === ADMIN_ADDRESS;

  return (
    <div style={{ padding: "1rem", background: "#f0f0f0", borderRadius: "8px" }}>
      <WalletMultiButton />
      {publicKey && (
        <div style={{ marginTop: "1rem" }}>
          <p>
            <strong>Welcome:</strong> {publicKey}
          </p>
          {isAdmin && (
            <p style={{ color: "green" }}>
              <strong>You are the admin of this voting system.</strong>
            </p>
          )}
        </div>
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

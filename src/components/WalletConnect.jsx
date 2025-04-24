import React, { useEffect, useState, useRef } from "react";
import { WalletProvider, useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider, WalletMultiButton } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

// Admin address
const ADMIN_ADDRESS =
  "aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs";

function WalletInfo() {
  const { publicKey, connect } = useWallet();
  const isAdmin = publicKey === ADMIN_ADDRESS;
  const [showRefreshAlert, setShowRefreshAlert] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const triedAutoConnect = useRef(false);

  // Prompt connection only once
  useEffect(() => {
    if (!publicKey && !triedAutoConnect.current) {
      triedAutoConnect.current = true;
      connect().catch(console.error);
    }
  }, [publicKey, connect]);

  // Show refresh alert once on connect
  useEffect(() => {
    if (publicKey) {
      setShowRefreshAlert(true);
      setCountdown(5);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(interval);
            setShowRefreshAlert(false);
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [publicKey]);

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
      <div className="mb-4">
        <WalletMultiButton className="btn btn-primary" />
      </div>

      {publicKey && (
        <>
          <div className="alert alert-success text-center w-100" role="alert">
            ✅ Wallet connected successfully!
          </div>
          {showRefreshAlert && (
            <div className="alert alert-warning text-center w-100" role="alert">
              ⚠️ Please refresh the page to ensure everything works properly ({countdown}s)
            </div>
          )}
          <h3 className="text-light mb-3">👋 Welcome!</h3>
          <div className="text-center small mb-3">
            <strong className="text-white">Your address:</strong>
            <div className="text-info text-break mt-1">{publicKey}</div>
          </div>
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
    <WalletProvider wallets={[new LeoWalletAdapter()]}>  {/* autoConnect removed */}
      <WalletModalProvider>
        <WalletInfo />
      </WalletModalProvider>
    </WalletProvider>
  );
}

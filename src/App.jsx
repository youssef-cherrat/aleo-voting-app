import React, { useMemo } from "react";
import WalletConnect from "./components/WalletConnect";
import VoteForm from "./components/VoteForm";
import SubmitProposalForm from "./components/SubmitProposalForm";
import ResultsView from "./components/ResultsView";
import Navbar from "./components/Navbar";
import aleoLogo from "./assets/aleo.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

// Import wallet provider modules and adapter configuration
import { WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";
import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

function App() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  // Initialize wallet adapter(s) using useMemo so they're not recreated on every render
  const wallets = useMemo(() => [
    new LeoWalletAdapter({
      appName: "Aleo Voting dApp"
    })
  ], []);

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      // Using TestnetBeta for testnet on Provable
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect
    >
      <WalletModalProvider>
        <Navbar />

        <div style={{ paddingTop: "70px" }}>
          <div className="container-fluid py-4">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                {/* Logos */}
                <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
                  <a href="https://aleo.org" target="_blank" rel="noreferrer">
                    <img src={aleoLogo} className="logo" alt="Aleo logo" />
                  </a>
                  <a href="https://react.dev" target="_blank" rel="noreferrer">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                  </a>
                </div>

                <h1 className="text-center mb-4 text-white">Aleo Voting dApp</h1>

                {/* Wallet Connect */}
                <WalletConnect />

                {/* Action Buttons */}
                <div className="card p-4 mt-5 mx-auto" style={{ maxWidth: "600px" }}>
                  <p className="text-center mb-3">Use the tabs or sections below to:</p>
                  <div className="d-grid gap-3">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => scrollTo("vote-section")}
                    >
                      🗳️ Vote on proposals
                    </button>
                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => scrollTo("submit-section")}
                    >
                      📄 Submit proposals (admin only)
                    </button>
                    <button
                      className="btn btn-outline-info"
                      onClick={() => scrollTo("results-section")}
                    >
                      📊 View proposal results
                    </button>
                  </div>
                </div>

                {/* Sections */}
                <VoteForm />
                <SubmitProposalForm />
                <ResultsView />
              </div>
            </div>
          </div>
        </div>
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default App;

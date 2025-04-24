import React, { useMemo, useEffect, useState } from "react";
import { useWallet, WalletProvider } from "@demox-labs/aleo-wallet-adapter-react";
import { WalletModalProvider } from "@demox-labs/aleo-wallet-adapter-reactui";
import { LeoWalletAdapter } from "@demox-labs/aleo-wallet-adapter-leo";

import WalletConnect from "./components/WalletConnect";
import VoteForm from "./components/VoteForm";
import SubmitProposalForm from "./components/SubmitProposalForm";
import ResultsView from "./components/ResultsView";
import Navbar from "./components/Navbar";
import aleoLogo from "./assets/aleo.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

import { DecryptPermission, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

const ADMIN_ADDRESS = "aleo1w7l4sx470xrl2cc6qd0wwxnfhg4ej8tfn36r8m03z84pue5lt5ps9e6frs";

function Content({ scrollTo }) {
  const { publicKey } = useWallet();
  const isAdmin = publicKey === ADMIN_ADDRESS;

  return (
    <>
      <section id="vote-section" className="mt-5">
        <h2 className="text-white mb-4">Vote on Proposals</h2>
        <VoteForm />
      </section>

      <section id="submit-section" className="mt-5">
        <h2 className="text-white mb-4">Submit Proposal</h2>
        {isAdmin ? (
          <>
            <div className="alert alert-success text-center w-100" role="alert">
              🛡️ <strong>You are admin and can submit proposals.</strong>
            </div>
            <SubmitProposalForm />
          </>
        ) : (
          <div className="alert alert-danger text-center w-100" role="alert">
            ⚠️ You are not admin and cannot submit proposals.
          </div>
        )}
      </section>

      <section id="results-section" className="mt-5">
        <h2 className="text-white mb-4">Proposal Results</h2>
        <ResultsView />
      </section>
    </>
  );
}

function App() {
  useEffect(() => {
    document.title = "Aleo Voting dApp";
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const wallets = useMemo(() => [new LeoWalletAdapter({ appName: "Aleo Voting dApp" })], []);

  return (
    <WalletProvider
      wallets={wallets}
      decryptPermission={DecryptPermission.UponRequest}
      network={WalletAdapterNetwork.TestnetBeta}
      autoConnect
    >
      <WalletModalProvider>
        <Navbar scrollTo={scrollTo} />

        <div style={{ paddingTop: "70px" }}>
          <div className="d-flex justify-content-center align-items-center gap-4 mb-4">
            <a href="https://aleo.org" target="_blank" rel="noreferrer">
              <img src={aleoLogo} className="logo" alt="Aleo logo" />
            </a>
            <a href="https://react.dev" target="_blank" rel="noreferrer">
              <img src={reactLogo} className="logo react" alt="React logo" />
            </a>
          </div>

          <WalletConnect />

          <div className="card p-4 mt-5 mx-auto" style={{ maxWidth: "600px" }}>
            <p className="text-center mb-3">Use the tabs or sections below to:</p>
            <div className="d-grid gap-3">
              <button className="btn btn-outline-primary" onClick={() => scrollTo("vote-section")}>
                🗳️ Vote on proposals
              </button>
              <button className="btn btn-outline-secondary" onClick={() => scrollTo("submit-section")}>
                📄 Submit proposals (admin only)
              </button>
              <button className="btn btn-outline-info" onClick={() => scrollTo("results-section")}>
                📊 View proposal results
              </button>
            </div>
          </div>

          <div className="container-fluid py-4">
            <div className="row justify-content-center">
              <div className="col-12 col-md-10 col-lg-8">
                <Content scrollTo={scrollTo} />
              </div>
            </div>
          </div>
        </div>
      </WalletModalProvider>
    </WalletProvider>
  );
}

export default App;
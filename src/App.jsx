import React from "react";
import WalletConnect from "./components/WalletConnect";
import aleoLogo from "./assets/aleo.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <a href="https://aleo.org" target="_blank" rel="noreferrer">
          <img src={aleoLogo} className="logo" alt="Aleo logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1 className="text-center mt-4">Aleo Voting dApp</h1>

      <WalletConnect />

      <div className="card p-4 mt-4" style={{ maxWidth: "600px", margin: "2rem auto" }}>
        <p className="text-center mb-3">Use the tabs or sections below to:</p>

        <div className="d-grid gap-2">
          <button className="btn btn-outline-primary">🗳️ Vote on proposals</button>
          <button className="btn btn-outline-secondary">📄 Submit proposals (admin only)</button>
          <button className="btn btn-outline-info">📊 View proposal results</button>
        </div>
      </div>
    </div>
  );
}

export default App;

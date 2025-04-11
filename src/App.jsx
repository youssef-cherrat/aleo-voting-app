import React from "react";
import WalletConnect from "./components/WalletConnect";
import aleoLogo from "./assets/aleo.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  return (
    <div style={{ fontFamily: "sans-serif", padding: "2rem" }}>
      <div style={{ display: "flex", gap: "2rem", justifyContent: "center" }}>
        <a href="https://aleo.org" target="_blank">
          <img src={aleoLogo} className="logo" alt="Aleo logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>

      <h1>Aleo Voting dApp</h1>

      <WalletConnect />

      <div className="card" style={{ marginTop: "2rem" }}>
        <p>Use the tabs or sections below to:</p>
        <ul>
          <li>🗳️ Vote on proposals</li>
          <li>📄 Submit proposals (admin only)</li>
          <li>📊 View proposal results</li>
        </ul>
      </div>
    </div>
  );
}

export default App;

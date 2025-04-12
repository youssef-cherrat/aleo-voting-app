import React from "react";
import WalletConnect from "./components/WalletConnect";
import Navbar from "./components/Navbar";
import aleoLogo from "./assets/aleo.svg";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  return (
    <>
      {/* Fixed top Navbar */}
      <Navbar />

      {/* Add padding to prevent content being hidden behind navbar */}
      <div style={{ paddingTop: "70px" }}>
        <div className="container-fluid py-4">
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
              {/* Logo Row */}
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
                  <button className="btn btn-outline-primary">🗳️ Vote on proposals</button>
                  <button className="btn btn-outline-secondary">📄 Submit proposals (admin only)</button>
                  <button className="btn btn-outline-info">📊 View proposal results</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

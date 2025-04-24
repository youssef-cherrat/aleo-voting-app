import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar({ scrollTo }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top p-2 m-0" style={{ borderRadius: 0 }}>
      <div className="container-fluid">
        <a className="navbar-brand" href="#" onClick={() => scrollTo("top")}>Aleo Voting dApp</a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white" onClick={() => scrollTo("vote-section")}>
                🗳️ Vote
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white" onClick={() => scrollTo("submit-section")}>
                📄 Proposals
              </button>
            </li>
            <li className="nav-item">
              <button className="nav-link btn btn-link text-white" onClick={() => scrollTo("results-section")}>
                📊 Results
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">Aleo Voting dApp</a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link active" href="#">🗳️ Vote</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">📄 Proposals</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">📊 Results</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

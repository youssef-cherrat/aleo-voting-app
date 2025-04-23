import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { encodeToField, decodeFromField } from "../utils/fieldEncoding.js";

export default function VoteForm() {
  const { publicKey, connected, requestRecords, requestTransaction } = useWallet();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [ticketInput, setTicketInput] = useState("");
  const [voteInput, setVoteInput] = useState("");
  const [voteType, setVoteType] = useState("agree");
  const [ticketIds, setTicketIds] = useState([]);
  const [proposals, setProposals] = useState([]);

  const passphrase = "jja3em";
  const programId = "voteuva4232025.aleo";
  const baseUrl = "https://api.explorer.provable.com/v1/testnet";
  const fee = 100000;

  const loadTickets = async () => {
    if (!requestRecords) return;
    try {
      const recs = await requestRecords(programId);
      const yours = recs
        .filter(r => r.recordName === "Ticket" && r.owner === publicKey)
        .map(r => r.data.pid.replace(/\.private$/, '').replace(/field$/, ''));
      setTicketIds(yours);
    } catch (e) {
      console.error("Error loading tickets:", e);
    }
  };

  useEffect(() => {
    if (connected) loadTickets();
  }, [connected]);

  const handleSubmitTicket = async () => {
    if (!connected) return alert("Please connect your wallet.");
    if (!ticketInput) return alert("Enter a proposal title.");
    setLoading(true);
    setError(null);
    try {
      const encoded = encodeToField(ticketInput, passphrase);
      const key = encoded;
      const url = `${baseUrl}/program/${programId}/mapping/proposals/${key}`;
      console.log("Checking proposal existence at:", url);
      const resp = await fetch(url);
      const text = await resp.text();
      let exists;
      try { exists = JSON.parse(text); } catch { exists = text; }
      if (!exists || exists === 'null') {
        throw new Error("Proposal not found");
      }
      const tx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        programId,
        "new_ticket",
        [key, publicKey],
        fee,
        false
      );
      await requestTransaction(tx);
      alert("✅ Ticket submitted!");
      setTicketInput("");
      await loadTickets();
    } catch (e) {
      console.error("Submit ticket error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCastVote = async () => {
    if (!connected) return alert("Please connect your wallet.");
    if (!voteInput) return alert("Enter a proposal title to vote.");
    setLoading(true);
    setError(null);
    try {
      const encoded = encodeToField(voteInput, passphrase);
      const pid = encoded.replace(/field$/, '');
      if (!ticketIds.includes(pid)) {
        return alert("You must submit a ticket for that proposal first.");
      }
      const recs = await requestRecords(programId);
      const pidPrivate = pid + "field.private";
      const ticketRecord = recs.find(r => r.recordName === "Ticket" && r.owner === publicKey && r.data.pid === pidPrivate);
      if (!ticketRecord) throw new Error("Ticket record not found on-chain");
      const tx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        programId,
        voteType,
        [ticketRecord],
        fee,
        false
      );
      await requestTransaction(tx);
      alert("✅ Vote cast successfully!");
      setVoteInput("");
    } catch (e) {
      console.error("Vote error:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="vote-section" className="mt-5 pt-5">
      <h2 className="text-white mb-4">Ticket & Vote</h2>

      {error && <p className="text-danger">Error: {error}</p>}

      <div className="mb-4">
        <h3 className="text-white">Submit a Ticket by Title</h3>
        <input
          type="text"
          className="form-control"
          placeholder="Enter proposal title"
          value={ticketInput}
          onChange={e => setTicketInput(e.target.value)}
        />
        <button className="btn btn-primary mt-2" onClick={handleSubmitTicket} disabled={loading}>
          {loading ? "Submitting…" : "Submit Ticket"}
        </button>
      </div>

      <div className="mb-4">
        <h3 className="text-white">Cast a Vote by Title</h3>
        <input
          type="text"
          className="form-control"
          placeholder="Enter proposal title"
          value={voteInput}
          onChange={e => setVoteInput(e.target.value)}
        />
        <div className="form-check form-check-inline text-white mt-2">
          <input id="agree" className="form-check-input" type="radio" name="voteType" value="agree" checked={voteType === "agree"} onChange={() => setVoteType("agree")} />
          <label htmlFor="agree" className="form-check-label">Agree</label>
        </div>
        <div className="form-check form-check-inline text-white mt-2">
          <input id="disagree" className="form-check-input" type="radio" name="voteType" value="disagree" checked={voteType === "disagree"} onChange={() => setVoteType("disagree")} />
          <label htmlFor="disagree" className="form-check-label">Disagree</label>
        </div>
        <button className="btn btn-success mt-2" onClick={handleCastVote} disabled={loading}>
          {loading ? "Casting…" : "Cast Vote"}
        </button>
      </div>

      <div className="text-white">
        <h4>Your Tickets</h4>
        {ticketIds.length ? (
          <ul>
            {ticketIds.map(id => <li key={id}>{id}</li>)}
          </ul>
        ) : (
          <p>No tickets submitted yet.</p>
        )}
      </div>
    </div>
  );
}
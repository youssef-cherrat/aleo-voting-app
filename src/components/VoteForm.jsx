// src/components/VoteForm.jsx
import React, { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { decodeFromField } from "../utils/fieldEncoding.js";

export default function VoteForm() {
  const { publicKey, connected, requestRecords, requestTransaction } = useWallet();

  const [proposals, setProposals]       = useState([]);
  const [ticketIds, setTicketIds]       = useState([]); 
  const [loading, setLoading]           = useState(false);

  // For submitting a ticket
  const [selectedToTicket, setSelectedToTicket] = useState("");

  // For casting a vote
  const [selectedToVote, setSelectedToVote]     = useState("");
  const [voteType, setVoteType]                 = useState("agree");
  const [voting, setVoting]                     = useState(false);

  const passphrase = "jja3em";
  const programId  = "voteuva2projectsp25.aleo";
  const fee        = 40000;   // microcredits

  // Load both proposals & your tickets
  const loadData = async () => {
    if (!requestRecords) return alert("Read function not available");
    setLoading(true);
    try {
      const recs = await requestRecords(programId);

      // Decode all proposals
      const allProposals = recs
        .filter(r => r.recordName === "Proposal")
        .map(r => {
          const rawId     = r.data.id.replace(/\.private$/, "");
          const numericId = rawId.replace(/field$/, "");
          return {
            id:      numericId,
            title:   decodeFromField(r.data.info.title,   passphrase),
            content: decodeFromField(r.data.info.content, passphrase),
          };
        });

      // Gather all ticket IDs you own
      const yours = recs
        .filter(r => r.recordName === "Ticket" && r.owner === publicKey)
        .map(r => {
          const rawPid     = r.data.pid.replace(/\.private$/, "");
          return rawPid.replace(/field$/, "");
        });

      setProposals(allProposals);
      setTicketIds(yours);
    } catch (err) {
      console.error("Load data error:", err);
      alert("Error loading data: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit a ticket for a chosen proposal
  const handleSubmitTicket = async () => {
    if (!connected) return alert("Please connect your wallet.");
    if (!selectedToTicket) return alert("Choose a proposal to ticket.");

    try {
      const pidField = selectedToTicket + "field";
      const tx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        programId,
        "new_ticket",
        [pidField, publicKey],
        fee,
        false
      );
      await requestTransaction(tx);
      alert("✅ Ticket submitted!");
      // reload so ticketIds updates
      await loadData();
    } catch (err) {
      console.error("Submit ticket error:", err);
      alert("Error submitting ticket: " + err.message);
    }
  };

  // Cast your vote using an existing ticket
  const handleCastVote = async () => {
    if (!connected) return alert("Please connect your wallet.");
    if (!selectedToVote) return alert("Choose a ticketed proposal first.");
    if (!ticketIds.includes(selectedToVote)) {
      return alert("You must submit a ticket for that proposal first.");
    }

    setVoting(true);
    try {
      const pidFieldPrivate = selectedToVote + "field.private";
      const recs = await requestRecords(programId);
      const ticketRecord = recs.find(r =>
        r.recordName === "Ticket" &&
        r.owner      === publicKey &&
        r.data.pid   === pidFieldPrivate
      );
      if (!ticketRecord) throw new Error("Ticket record not found on‑chain");

      const tx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        programId,
        voteType,           // "agree" or "disagree"
        [ticketRecord],
        fee,
        false
      );
      await requestTransaction(tx);
      alert("✅ Vote cast successfully!");
    } catch (err) {
      console.error("Vote error:", err);
      alert("Error casting vote: " + err.message);
    } finally {
      setVoting(false);
    }
  };

  // Split into two lists
  const availableToTicket = proposals.filter(p => !ticketIds.includes(p.id));
  const ticketedProposals = proposals.filter(p => ticketIds.includes(p.id));

  // Find the proposal object for voting
  const proposalToVote = proposals.find(p => p.id === selectedToVote);

  return (
    <div id="vote-section" className="mt-5 pt-5">
      <h2 className="text-white mb-4">Ticket & Vote</h2>

      {/* Load data */}
      <button
        className="btn btn-secondary mb-4"
        onClick={loadData}
        disabled={loading}
      >
        {loading ? "Loading…" : "Refresh Proposals & Tickets"}
      </button>

      {/* Submit Ticket */}
      <h3 className="text-white">Submit a Ticket</h3>
      {availableToTicket.length ? (
        <div className="mb-3">
          <select
            className="form-select"
            value={selectedToTicket}
            onChange={e => setSelectedToTicket(e.target.value)}
          >
            <option value="" disabled>— Choose proposal —</option>
            {availableToTicket.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>
          <button
            className="btn btn-primary mt-2"
            onClick={handleSubmitTicket}
          >
            Submit Ticket
          </button>
        </div>
      ) : (
        <p className="text-white">No proposals available to ticket.</p>
      )}

      {/* Cast Vote */}
      <h3 className="text-white mt-5">
        Already have a ticket? Cast Your Vote!{" "}
      </h3>
      {ticketedProposals.length ? (
        <div className="mb-3">
          <select
            className="form-select"
            value={selectedToVote}
            onChange={e => setSelectedToVote(e.target.value)}
          >
            <option value="" disabled>— Choose ticketed proposal —</option>
            {ticketedProposals.map(p => (
              <option key={p.id} value={p.id}>
                {p.title}
              </option>
            ))}
          </select>

          {/* Show content */}
          {proposalToVote && (
            <div className="mt-3 mb-3 text-white">
              <p><strong>Title:</strong> {proposalToVote.title}</p>
              <p><strong>Content:</strong> {proposalToVote.content}</p>
            </div>
          )}

          <div className="form-check mt-2 text-white">
            <input
              id="agree"
              className="form-check-input"
              type="radio"
              name="voteType"
              value="agree"
              checked={voteType === "agree"}
              onChange={() => setVoteType("agree")}
            />
            <label htmlFor="agree" className="form-check-label">Agree</label>
          </div>
          <div className="form-check text-white">
            <input
              id="disagree"
              className="form-check-input"
              type="radio"
              name="voteType"
              value="disagree"
              checked={voteType === "disagree"}
              onChange={() => setVoteType("disagree")}
            />
            <label htmlFor="disagree" className="form-check-label">Disagree</label>
          </div>

          <button
            className="btn btn-success mt-2"
            onClick={handleCastVote}
            disabled={voting}
          >
            {voting ? "Casting…" : "Cast Vote"}
          </button>
        </div>
      ) : (
        <p className="text-white">You haven’t submitted tickets yet.</p>
      )}
    </div>
  );
}

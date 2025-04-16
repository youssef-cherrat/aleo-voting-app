import React, { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { decodeFromField } from "../utils/fieldEncoding.js"; // or your correct path

export default function VoteForm() {
  const { publicKey, connected, requestRecords, requestTransaction } = useWallet();
  const [proposals, setProposals]       = useState([]);
  const [selectedId, setSelectedId]     = useState("");
  const [selectedProposal, setSelectedProposal] = useState(null);
  const [voteType, setVoteType]         = useState("agree");
  const [loadingProposals, setLoadingProposals] = useState(false);
  const [loadingVote, setLoadingVote]   = useState(false);

  const passphrase  = "jja3em";
  const programId   = "voteuva2projectsp25.aleo";

  // Step 1: On “Find Proposals”, fetch & decode
  const handleLoadProposals = async () => {
    if (!requestRecords) return alert("Read function not available.");
    setLoadingProposals(true);
    try {
      const recs = await requestRecords(programId);
      const list = recs
        .filter(r => r.recordName === "Proposal")
        .map(r => {
          // r.data.id is like "…field.private"
          const rawId        = r.data.id.replace(/\.private$/, "");  // "…field"
          const numericId    = rawId.replace(/field$/, "");          // digits only
          const title        = decodeFromField(r.data.info.title,   passphrase);
          const content      = decodeFromField(r.data.info.content, passphrase);
          return { id: numericId, title, content };
        });
      setProposals(list);
      if (!list.length) alert("No proposals found on‑chain.");
    } catch (err) {
      console.error("Failed to load proposals:", err);
      alert("Error loading proposals: " + err.message);
    }
    setLoadingProposals(false);
  };

  // Step 2: User picks one
  const handleSelect = (e) => {
    const id = e.target.value;
    setSelectedId(id);
    setSelectedProposal(proposals.find(p => p.id === id) || null);
  };

  // Step 3: Issue ticket → fetch real Ticket → agree/disagree
  const handleVote = async (e) => {
    e.preventDefault();
    if (!connected)         return alert("Connect your wallet first.");
    if (!selectedProposal)  return alert("Please choose a proposal.");
    setLoadingVote(true);

    try {
      // Build field strings
      const pidField         = selectedId + "field";          // "digitsfield"
      const pidFieldPrivate  = pidField + ".private";        // "digitsfield.private"
      const fee              = 10000;

      // 3.1) Create ticket
      await requestTransaction(
        Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.TestnetBeta,
          programId,
          "new_ticket",
          [pidField, publicKey],
          fee,
          false
        )
      );

      // 3.2) Fetch the actual Ticket record
      const recs2 = await requestRecords(programId);
      const ticketRecord = recs2.find(r =>
        r.recordName === "Ticket" &&
        r.owner      === publicKey &&
        r.data.pid   === pidFieldPrivate
      );
      if (!ticketRecord) throw new Error("Ticket record not found");

      // 3.3) Cast the vote
      const voteTx = await requestTransaction(
        Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.TestnetBeta,
          programId,
          voteType,           // "agree" or "disagree"
          [ticketRecord],     // pass the real record object
          fee,
          false
        )
      );

      alert("✅ Vote sent! Tx ID: " + voteTx.transactionId);
    } catch (err) {
      console.error("Error voting:", err);
      alert("Error voting: " + err.message);
    }

    setLoadingVote(false);
  };

  return (
    <div id="vote-section" className="mt-5 pt-5">
      <h2 className="text-white mb-4">Vote on Proposal</h2>

      {/* Find Proposals Button */}
      <div className="mb-3">
        <button
          className="btn btn-secondary"
          onClick={handleLoadProposals}
          disabled={loadingProposals}
        >
          {loadingProposals
            ? <>
                <span className="spinner-border spinner-border-sm me-2" role="status" />
                Loading…
              </>
            : "Find Proposals"}
        </button>
      </div>

      {/* Dropdown (once loaded) */}
      {proposals.length > 0 && (
        <div className="mb-3">
          <label htmlFor="proposalSelect" className="form-label text-white">
            Select a Proposal
          </label>
          <select
            id="proposalSelect"
            className="form-select"
            value={selectedId}
            onChange={handleSelect}
          >
            <option value="" disabled>— Choose one —</option>
            {proposals.map(p => (
              <option key={p.id} value={p.id}>{p.title}</option>
            ))}
          </select>
        </div>
      )}

      {/* Details & Vote Form */}
      {selectedProposal && (
        <>
          <div className="mb-4 text-white">
            <h3>Proposal Details</h3>
            <p><strong>ID:</strong> {selectedProposal.id}</p>
            <p><strong>Title:</strong> {selectedProposal.title}</p>
            <p><strong>Content:</strong> {selectedProposal.content}</p>
          </div>

          <form onSubmit={handleVote}>
            <div className="mb-3 text-white">
              <label className="form-label">Your Vote</label>
              <div className="form-check">
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
              <div className="form-check">
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
            </div>

            <button className="btn btn-primary" type="submit" disabled={loadingVote}>
              {loadingVote
                ? <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" />
                    Submitting Vote…
                  </>
                : "Submit Vote"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}

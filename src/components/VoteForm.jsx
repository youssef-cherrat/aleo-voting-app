import React, { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";

function VoteForm() {
  const [proposalID, setProposalID] = useState("");
  const [voteType, setVoteType] = useState("agree");
  const [loading, setLoading] = useState(false);
  const { publicKey } = useWallet();

  const programId = "voteuvacsprojectsp25.aleo";

  const handleVote = async (e) => {
    e.preventDefault();
    if (!publicKey) return alert("Connect your wallet first.");
    if (!proposalID) return alert("Proposal ID is required.");

    setLoading(true);
    try {
      const pidField = `${proposalID}field`;
      const ticketRecord = `{ owner: ${publicKey}, pid: ${pidField} }`;

      // Step 1: Issue a new ticket (calls new_ticket)
      const ticketTx = await window.aleoWallet.execute(
        programId,
        "new_ticket",
        [pidField, publicKey],
        0.1
      );
      console.log("🎫 Ticket created:", ticketTx);

      // Step 2: Vote using the ticket
      const voteTx = await window.aleoWallet.execute(
        programId,
        voteType, // "agree" or "disagree"
        [ticketRecord],
        0.1
      );

      console.log("🗳️ Vote submitted:", voteTx);
      alert("✅ Vote transaction sent: " + voteTx.transactionId);
    } catch (err) {
      console.error(err);
      alert("❌ Error voting: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div id="vote-section" className="mt-5 pt-5">
      <h2 className="text-white mb-4">Vote on Proposal</h2>
      <form onSubmit={handleVote}>
        <div className="mb-3">
          <label htmlFor="proposalID" className="form-label text-white">Proposal ID</label>
          <input
            type="text"
            className="form-control"
            id="proposalID"
            placeholder="Enter proposal title hash"
            value={proposalID}
            onChange={(e) => setProposalID(e.target.value)}
            required
          />
        </div>
        <div className="mb-3 text-white">
          <label className="form-label">Select your vote</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="agree"
              name="voteType"
              value="agree"
              checked={voteType === "agree"}
              onChange={() => setVoteType("agree")}
            />
            <label className="form-check-label" htmlFor="agree">Agree</label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="disagree"
              name="voteType"
              value="disagree"
              checked={voteType === "disagree"}
              onChange={() => setVoteType("disagree")}
            />
            <label className="form-check-label" htmlFor="disagree">Disagree</label>
          </div>
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Vote"}
        </button>
      </form>
    </div>
  );
}

export default VoteForm;

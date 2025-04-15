import React, { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

function VoteForm() {
  const [proposalID, setProposalID] = useState("");
  const [proposalData, setProposalData] = useState(null);
  const [voteType, setVoteType] = useState("agree");
  const [loading, setLoading] = useState(false);

  // Use methods from the wallet adapter hook
  const { publicKey, requestRecords, requestTransaction } = useWallet();

  // Your smart contract program identifier
  const programId = "voteuva2projectsp25.aleo";

  // Function to look up the proposal record on chain
  const handleFindProposal = async (e) => {
    e.preventDefault();
    if (!proposalID) {
      alert("Proposal ID is required.");
      return;
    }
    if (!requestRecords) {
      alert("read function is not available.");
      return;
    }
    setLoading(true);
    try {
      // Request all records for your program.
      // (Your proposals mapping is stored publicly; adjust the filtering if your records structure differs.)
      const records = await requestRecords(programId);
      // Attempt to find a record whose id matches the entered proposalID.
      // (Ensure that your record structure contains an 'id' field that reflects your proposal IDs.)
      const foundProposal = records.find((record) => record.id === proposalID);

      if (foundProposal) {
        setProposalData(foundProposal);
        alert("Proposal found!");
      } else {
        alert("Proposal not found.");
        setProposalData(null);
      }
    } catch (err) {
      console.error(err);
      alert("Error fetching proposal: " + err.message);
      setProposalData(null);
    }
    setLoading(false);
  };

  // Function to create a ticket and submit a vote transaction on chain
  const handleVote = async (e) => {
    e.preventDefault();
    if (!publicKey) return alert("Connect your wallet first.");
    if (!proposalID) return alert("Proposal ID is required.");
    if (!proposalData) return alert("Please find the proposal first.");

    setLoading(true);
    try {
      // Convert the proposalID to a field representation.
      // Adjust this conversion based on your app’s requirements.
      const pidField = proposalID + "field";
      const fee = 10000; // Adjust fee as needed

      // === Step 1: Issue a new ticket by invoking `new_ticket` transition ===
      // The new_ticket transition requires two parameters: the proposal id (as a field) and the voter's address.
      const ticketTx = await requestTransaction(
        Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.Localnet, // Change if using a different network (e.g. TestnetBeta)
          programId,
          "new_ticket",
          [pidField, publicKey],
          fee
        )
      );
      console.log("Ticket creation transaction submitted:", ticketTx);

      // === Step 2: Cast the vote using the ticket ===
      // For the voting transition (agree/disagree), we pass a ticket record.
      // Here we simulate the ticket record as an object that matches your smart contract's Ticket record.
      const ticketRecord = { owner: publicKey, pid: pidField };
      const voteTx = await requestTransaction(
        Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.Localnet,
          programId,
          voteType, // Either "agree" or "disagree"
          [ticketRecord],
          fee
        )
      );
      console.log("Vote transaction submitted:", voteTx);
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

      {/* Proposal lookup form */}
      <form onSubmit={handleFindProposal}>
        <div className="mb-3">
          <label htmlFor="proposalID" className="form-label text-white">
            Proposal ID
          </label>
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
        <button className="btn btn-secondary" type="submit" disabled={loading}>
          {loading ? "Searching..." : "Find Proposal"}
        </button>
      </form>

      {/* If a proposal is found, display its details and reveal the vote form */}
      {proposalData && (
        <div className="mt-4">
          <h3 className="text-white">Proposal Found:</h3>
          <p className="text-white">
            <strong>ID:</strong> {proposalData.id || "(No ID)"}
          </p>
          {/* Adjust below fields based on the structure of your ProposalInfo */}
          <p className="text-white">
            <strong>Title:</strong> {proposalData.title || "(No title)"}
          </p>
          <p className="text-white">
            <strong>Content:</strong> {proposalData.content || "(No content)"}
          </p>

          <form onSubmit={handleVote}>
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
                <label className="form-check-label" htmlFor="agree">
                  Agree
                </label>
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
                <label className="form-check-label" htmlFor="disagree">
                  Disagree
                </label>
              </div>
            </div>
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Submitting..." : "Submit Vote"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default VoteForm;

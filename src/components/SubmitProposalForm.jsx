import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

function SubmitProposalForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  // Retrieve wallet state; note the additional 'connected' flag.
  const { publicKey, connected, requestTransaction } = useWallet();

  // Debug: log wallet connection status and publicKey for troubleshooting.
  useEffect(() => {
    console.log("Wallet state:", { connected, publicKey });
  }, [connected, publicKey]);

  // Your smart contract's program ID
  const programId = "voteuvacsprojectsp25.aleo";

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check connection status using the connected flag
    if (!connected) {
      alert("Connect your wallet first.");
      return;
    }
    if (!title || !content) {
      alert("Please fill in all fields.");
      return;
    }
    setLoading(true);
    try {
      const fee = 10000; // Adjust fee as needed

      // Build the ProposalInfo object (the struct defined in your Leo program).
      const proposalInfo = {
        title: title,
        content: content,
        proposer: publicKey,
      };

      // Create and send the transaction by calling the "propose" transition.
      const tx = await requestTransaction(
        Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.Localnet, // Change network if needed (TestnetBeta/MainnetBeta)
          programId,
          "propose", // Transition name defined in your smart contract.
          [proposalInfo], // Transaction arguments.
          fee
        )
      );
      console.log("Proposal submitted:", tx);
      alert("Proposal submission sent: " + tx.transactionId);

      // Clear form inputs after successful submission.
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Error submitting proposal: " + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="mt-5 pt-5">
      <h2 className="text-white mb-4">Submit Proposal</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="proposalTitle" className="form-label text-white">
            Proposal Title
          </label>
          <input
            type="text"
            className="form-control"
            id="proposalTitle"
            placeholder="Enter proposal title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="proposalContent" className="form-label text-white">
            Proposal Content
          </label>
          <textarea
            className="form-control"
            id="proposalContent"
            placeholder="Enter proposal content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit Proposal"}
        </button>
      </form>
    </div>
  );
}

export default SubmitProposalForm;

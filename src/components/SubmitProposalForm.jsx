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

  // Your smart contract's program ID - updated to the new deployed contract
  const programId = "voteuva2projectsp25.aleo";

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
      
      // With the modified Leo contract, we can pass title, content, and proposer as separate inputs
      // This should work better with the Leo wallet adapter
      
      console.log("Submitting proposal with inputs:", { title, content, proposer: publicKey });
      
      // IMPORTANT: Build the transaction using the TestnetBeta network to match your configuration.
      const tx = Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        programId,
        "propose", // The transition name defined in your smart contract.
        [title, content, publicKey], // Pass the inputs as separate arguments
        fee
      );

      console.log("Created transaction:", tx);
      if (!tx) {
        throw new Error("Transaction creation failed; received undefined value.");
      }

      // Send the transaction by calling requestTransaction.
      console.log("Sending transaction...");
      const result = await requestTransaction(tx);
      console.log("Proposal submitted:", result);
      alert("Proposal submission sent: " + result.transactionId);

      // Clear form inputs upon successful submission.
      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Error details:", err);
      console.error("Error stack:", err.stack);
      alert("Error submitting proposal: " + (err.message || "Unknown error"));
    }
    setLoading(false);
  };

  return (
    <div className="mt-5 pt-5" id="submit-section">
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

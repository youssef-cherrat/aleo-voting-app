import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { encodeToField, decodeFromField } from "../utils/fieldEncoding.js";

function SubmitProposalForm() {
  const [title, setTitle]       = useState("");
  const [content, setContent]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [newProposalID, setNewProposalID] = useState("");
  const passphrase              = "jja3em";

  const {
    publicKey,
    connected,
    requestTransaction,
    requestRecords       // ← grab this too
  } = useWallet();

  const programId = "voteuva4232025.aleo";

  useEffect(() => {
    console.log("Wallet state:", { connected, publicKey });
  }, [connected, publicKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected)         { alert("Connect your wallet first."); return; }
    if (!title || !content) { alert("Please fill in all fields."); return; }

    setLoading(true);
    try {
      // encrypt to field
      const titleField   = encodeToField(title,   passphrase);
      const contentField = encodeToField(content, passphrase);

      // submit the tx
      const tx = await Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        programId,
        "propose",
        [titleField, contentField, publicKey],
        40000,
        false
      );
      await requestTransaction(tx);

      // now fetch public Proposal records
      const records = await requestRecords(programId);
      const ours = records.find(r =>
        r.recordName === "Proposal"
        && r.owner === publicKey
        && r.data.info.title   === titleField
        && r.data.info.content === contentField
      );

      if (ours) {
        // strip off ".private"
        const onChainID = ours.data.id.replace(/\.private$/, "");
        setNewProposalID(onChainID);
        alert("✅ Proposal created! On‑chain ID:\n" + onChainID);
      } else {
        console.warn("Proposal record not found in public state yet.");
      }

      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Error submitting proposal: " + err.message);
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
            id="proposalTitle"
            className="form-control"
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
            id="proposalContent"
            className="form-control"
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

      {newProposalID && (
        <p className="text-white mt-3">
          🆔 Your Proposal ID:<br/>
          <code>{newProposalID}</code>
        </p>
      )}
    </div>
  );
}

export default SubmitProposalForm;

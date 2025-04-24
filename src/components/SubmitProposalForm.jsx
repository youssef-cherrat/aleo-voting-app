import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";
import { encodeToField, decodeFromField } from "../utils/fieldEncoding.js";

function SubmitProposalForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [newProposalID, setNewProposalID] = useState("");
  const passphrase = "jja3em";

  const {
    publicKey,
    connected,
    requestTransaction,
    requestRecords
  } = useWallet();

  const programId = "voteuva4232025.aleo";

  useEffect(() => {
    console.log("🔐 Wallet connected:", connected);
    console.log("🔐 Wallet publicKey:", publicKey);
  }, [connected, publicKey]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected || !publicKey) {
      alert("🔌 Please connect your wallet first.");
      return;
    }
    if (!title || !content) {
      alert("✏️ Please fill in both title and content.");
      return;
    }

    setLoading(true);

    try {
      // Step 1: Encode input fields to Aleo field format
      const titleField = encodeToField(title, passphrase);
      const contentField = encodeToField(content, passphrase);

      console.log("🧾 Encoded titleField:", titleField);
      console.log("🧾 Encoded contentField:", contentField);

      // Sanity Check: Are the fields valid numbers < FIELD_MODULUS?
      const maxField = 2n ** 128n - 45n;
      if (BigInt(titleField.replace("field", "")) >= maxField || BigInt(contentField.replace("field", "")) >= maxField) {
        throw new Error("🚫 Encoded field value too large for Aleo field modulus.");
      }

      // Step 2: Construct transaction
      console.log("📤 Constructing transaction with:");
      console.log({ titleField, contentField, proposer: publicKey });

      let tx;
      try {
        tx = await Transaction.createTransaction(
          publicKey,
          WalletAdapterNetwork.TestnetBeta,
          programId,
          "propose",
          [titleField, contentField, publicKey],
          600000,
          false
        );
        console.log("📦 Transaction built:", tx);
      } catch (txBuildError) {
        console.error("❌ Error building transaction:", txBuildError);
        alert("❌ Could not build transaction:\n" + txBuildError.message);
        setLoading(false);
        return;
      }

      // Step 3: Send transaction
      try {
        console.log("📡 Sending transaction...");
        await requestTransaction(tx);
        console.log("✅ Transaction broadcasted.");
      } catch (walletError) {
        console.error("❌ Error sending transaction to wallet:", walletError);
        alert("❌ Wallet error: " + (walletError.message || JSON.stringify(walletError)));
        setLoading(false);
        return;
      }

      // Step 4: Wait and fetch the Proposal record
      console.log("⏳ Waiting for transaction to finalize...");
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const records = await requestRecords(programId);
      console.log("📄 Records fetched:", records);

      const ours = records.find(r =>
        r.recordName === "Proposal" &&
        r.owner === publicKey &&
        r.data.id === titleField
      );

      if (ours) {
        const onChainID = ours.data.id.replace(/\.private$/, "");
        setNewProposalID(onChainID);
        alert("🎉 Proposal created! On-chain ID:\n" + onChainID);
      } else {
        console.warn("⚠️ Proposal not yet indexed. It may take more time.");
        alert("✅ Transaction submitted. Proposal may take a few seconds to appear.");
      }

      setTitle("");
      setContent("");

    } catch (err) {
      console.error("❌ Unexpected error during submit:", err);
      alert("❌ Submission failed:\n" + err.message);
    }

    setLoading(false);
  };

  return (
    <div className="mt-5 pt-5" id="submit-section">
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
            disabled={loading}
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
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
          />
        </div>
        <button className="btn btn-primary" type="submit" disabled={loading}>
          {loading ? "Submitting…" : "Submit Proposal"}
        </button>
      </form>

      {newProposalID && (
        <p className="text-white mt-3">
          🆔 Your Proposal ID:<br />
          <code>{newProposalID}</code>
        </p>
      )}
    </div>
  );
}

export default SubmitProposalForm;

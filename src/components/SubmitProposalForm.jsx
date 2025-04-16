import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction, WalletAdapterNetwork } from "@demox-labs/aleo-wallet-adapter-base";

// Two‑way encoding: string → encrypted field (with XOR key) → reversible
function encodeToField(str, key) {
  const textBytes = new TextEncoder().encode(str);
  const keyBytes  = new TextEncoder().encode(key);

  const encrypted = textBytes.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  const hex = [...encrypted]
    .map(b => b.toString(16).padStart(2, "0"))
    .join("");

  return BigInt("0x" + hex).toString() + "field";
}

// Decode field → encrypted bytes → XOR with key → original string
function decodeFromField(fieldStr, key) {
  const hex = BigInt(fieldStr.replace(/field$/, ""))
    .toString(16)
    .padStart(fieldStr.length * 2, "0");
  const encrypted = new Uint8Array(hex.match(/.{1,2}/g).map(h => parseInt(h, 16)));
  const keyBytes  = new TextEncoder().encode(key);

  const decrypted = encrypted.map((b, i) => b ^ keyBytes[i % keyBytes.length]);
  return new TextDecoder().decode(decrypted);
}

function SubmitProposalForm() {
  const [title, setTitle]     = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const passphrase            = "jja3em"; // your secret key

  const { publicKey, connected, requestTransaction } = useWallet();

  useEffect(() => {
    console.log("Wallet state:", { connected, publicKey });
  }, [connected, publicKey]);

  const programId = "voteuva2projectsp25.aleo";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!connected)  { alert("Connect your wallet first."); return; }
    if (!title || !content) { alert("Please fill in all fields."); return; }

    setLoading(true);
    try {
      const titleField   = encodeToField(title,   passphrase);
      const contentField = encodeToField(content, passphrase);

      console.log("Encrypted fields:", { titleField, contentField });

      const tx = await Transaction.createTransaction(
        publicKey,
        WalletAdapterNetwork.TestnetBeta,
        programId,
        "propose",
        [titleField, contentField, publicKey],
        40000,
        false
      );

      console.log("Transaction created:", tx);
      const result = await requestTransaction(tx);
      console.log("Proposal submitted:", result);

      // Example of decoding for verification:
      // console.log("decoded title:", decodeFromField(titleField, passphrase));
      // console.log("decoded content:", decodeFromField(contentField, passphrase));

      alert("Proposal submitted! Transaction ID: " + result.transactionId);

      setTitle("");
      setContent("");
    } catch (err) {
      console.error("Submission error:", err);
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
export {
  encodeToField,
  decodeFromField
};

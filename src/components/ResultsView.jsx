import React, { useState } from "react";
import { decodeFromField, encodeToField } from "../utils/fieldEncoding.js";

export default function ResultsView() {
  const [inputTitle, setInputTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const passphrase = "jja3em";
  const programId = "voteuva4232025.aleo";
  const baseUrl = "https://api.explorer.provable.com/v1/testnet";

  const handleSearch = async () => {
    if (!inputTitle) {
      setError("Please enter a proposal title.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      // Encode title to get the numeric field representation
      const encoded = encodeToField(inputTitle, passphrase);
      const key = encoded;

      console.log("Input title:", inputTitle);
      console.log("Encoded field:", encoded);
      console.log("Mapping key:", key);

      const proposalUrl = `${baseUrl}/program/${programId}/mapping/proposals/${key}`;
      const agreeUrl = `${baseUrl}/program/${programId}/mapping/agree_votes/${key}`;
      const disagreeUrl = `${baseUrl}/program/${programId}/mapping/disagree_votes/${key}`;

      console.log("Proposal URL:", proposalUrl);
      console.log("Agree votes URL:", agreeUrl);
      console.log("Disagree votes URL:", disagreeUrl);

      // Fetch proposal info
      const propResp = await fetch(proposalUrl);
      const propText = await propResp.text();
      console.log("Raw proposal response:", propText);

      // Extract inner text
      let innerText;
      try {
        innerText = JSON.parse(propText);
      } catch {
        innerText = propText;
      }
      console.log("Inner proposal text:", innerText);

      // Parse object-like string into key-values
      const objString = innerText.trim().replace(/^{\s*|\s*}$/g, '');
      const entries = objString.split(/,\s*/);
      const obj = {};
      entries.forEach(entry => {
        const [rawKey, rawVal] = entry.split(/:\s*/);
        obj[rawKey.trim()] = rawVal.trim();
      });

      const rawTitle = obj['title'];
      const rawContent = obj['content'];
      if (!rawTitle || !rawContent) {
        throw new Error("Proposal not found");
      }

      const title = decodeFromField(rawTitle, passphrase);
      const content = decodeFromField(rawContent, passphrase);

      // Fetch agree count
      const agreeResp = await fetch(agreeUrl);
      const agreeText = await agreeResp.text();
      console.log("Raw agree response:", agreeText);
      let agreeVal;
      try {
        agreeVal = JSON.parse(agreeText);
      } catch {
        agreeVal = agreeText;
      }
      const agree = parseInt(agreeVal.replace(/u64$/, ''), 10);

      // Fetch disagree count
      const disagreeResp = await fetch(disagreeUrl);
      const disagreeText = await disagreeResp.text();
      console.log("Raw disagree response:", disagreeText);
      let disagreeVal;
      try {
        disagreeVal = JSON.parse(disagreeText);
      } catch {
        disagreeVal = disagreeText;
      }
      const disagree = parseInt(disagreeVal.replace(/u64$/, ''), 10);

      setResult({ id: encoded, title, content, agree, disagree });
    } catch (e) {
      console.error("Error loading proposal results:", e);
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="results-section" className="mt-5 pt-5">
      <h2 className="text-white mb-4">Proposal Results</h2>

      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Enter proposal title"
          value={inputTitle}
          onChange={(e) => setInputTitle(e.target.value)}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={handleSearch}
          disabled={loading}
        >
          {loading ? "Loading…" : "Search"}
        </button>
      </div>

      {error && <p className="text-danger">Error: {error}</p>}

      {result && (
        <table className="table table-dark table-striped">
          <thead>
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Agree</th>
              <th>Disagree</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{result.title}</td>
              <td>{result.content}</td>
              <td>{result.agree}</td>
              <td>{result.disagree}</td>
            </tr>
          </tbody>
        </table>
      )}

      {!loading && !error && !result && (
        <p className="text-white">Enter a proposal title above to see results.</p>
      )}
    </div>
  );
}

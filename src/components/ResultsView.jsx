import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { decodeFromField } from "../utils/fieldEncoding.js";

export default function ResultsView() {
  const { publicKey, connected, requestRecords } = useWallet();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError]     = useState(null);

  const passphrase = "jja3em";
  const programId  = "voteuva3projectsp25.aleo";

  useEffect(() => {
    if (!connected) return;

    async function loadResults() {
      setLoading(true);
      setError(null);

      try {
        // 1) pull down all Proposal, Ticket & Results records
        const recs = await requestRecords(programId);

        // 2) decode all proposals
        const proposals = recs
          .filter(r => r.recordName === "Proposal")
          .map(r => {
            const rawId     = r.data.id.replace(/\.private$/, "");
            const numericId = rawId.replace(/field$/, "");
            const title     = decodeFromField(r.data.info.title,   passphrase);
            const content   = decodeFromField(r.data.info.content, passphrase);
            return { id: numericId, title, content };
          });

        // 3) gather your ticket‑eligible IDs
        const ticketIds = recs
          .filter(r => r.recordName === "Ticket" && r.owner === publicKey)
          .map(r => {
            let pid = r.data.pid.replace(/\.private$/, "");
            if (pid.endsWith("field")) pid = pid.slice(0, -5);
            return pid;
          });

        // 4) pick out only the Results records you emitted
        const resultsList = recs
          .filter(r =>
            r.recordName === "Results" &&
            ticketIds.includes(
              r.data.id.replace(/\.private$/, "").replace(/field$/, "")
            )
          )
          .map(r => {
            const rawId     = r.data.id.replace(/\.private$/, "");
            const numericId = rawId.replace(/field$/, "");
            const prop      = proposals.find(p => p.id === numericId) || {};
            return {
              id:        numericId,
              title:     prop.title,
              content:   prop.content,
              agree:     Number(r.data.agrees),
              disagree:  Number(r.data.disagrees),
            };
          });

        setResults(resultsList);
      } catch (e) {
        console.error("❌ [ResultsView] loadResults error:", e);
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    loadResults();
  }, [connected, publicKey, requestRecords]);

  return (
    <div id="results-section" className="mt-5 pt-5">
      <h2 className="text-white mb-4">Proposal Results</h2>

      {loading && <p className="text-white">Loading results…</p>}
      {error   && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-white">(You have no tickets or no proposals found.)</p>
      )}

      {!loading && !error && results.length > 0 && (
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
            {results.map(r => (
              <tr key={r.id}>
                <td>{r.title}</td>
                <td>{r.content}</td>
                <td>{r.agree}</td>
                <td>{r.disagree}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

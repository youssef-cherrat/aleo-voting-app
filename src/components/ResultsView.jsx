import React, { useState, useEffect } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { decodeFromField } from "../utils/fieldEncoding.js";

export default function ResultsView() {
  const { publicKey, connected, requestRecords } = useWallet();
  const [loading, setLoading]                   = useState(false);
  const [results, setResults]                   = useState([]);
  const [error, setError]                       = useState(null);

  const passphrase = "jja3em";
  const programId  = "voteuva4232025.aleo";

  useEffect(() => {
    if (!connected) return;
    async function loadResults() {
      setLoading(true);
      setError(null);
      try {
        // 1) Fetch all on‑chain records
        const recs = await requestRecords(programId);

        // 2) Decode all proposals
        const proposals = recs
          .filter(r => r.recordName === "Proposal")
          .map(r => {
            const rawId     = r.data.id.replace(/\.private$/, "");
            const numericId = rawId.replace(/field$/, "");
            const title     = decodeFromField(r.data.info.title,   passphrase);
            const content   = decodeFromField(r.data.info.content, passphrase);
            return { id: numericId, title, content };
          });

        // 3) Find the proposals you hold tickets for
        const ticketIds = recs
          .filter(r => r.recordName === "Ticket" && r.owner === publicKey)
          .map(r => {
            const rawPid = r.data.pid.replace(/\.private$/, "");
            return rawPid.replace(/field$/, "");
          });

        // 4) Build a list of ticketed proposals
        const ticketed = proposals.filter(p => ticketIds.includes(p.id));

        // 5) For each, fetch agree/disagree counts from the explorer API
        const withCounts = await Promise.all(ticketed.map(async (p) => {
          const key = p.id + "field";
          // agree votes
          const agreeResp = await fetch(
            `https://api.explorer.provable.com/v1/mapping/${programId}/agree_votes/${key}`
          );
          const agreeJson = await agreeResp.json();
          const agree     = agreeJson.data.value ?? 0;
          // disagree votes
          const disagreeResp = await fetch(
            `https://api.explorer.provable.com/v1/mapping/${programId}/disagree_votes/${key}`
          );
          const disagreeJson = await disagreeResp.json();
          const disagree     = disagreeJson.data.value ?? 0;

          return {
            ...p,
            agree,
            disagree
          };
        }));

        setResults(withCounts);
      } catch (e) {
        console.error("ResultsView load error:", e);
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
      {error && <p className="text-danger">Error: {error}</p>}

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
            {results.map((r) => (
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


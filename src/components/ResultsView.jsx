import React, { useState } from "react";
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { decodeFromField } from "../utils/fieldEncoding.js";

export default function ResultsView() {
  const { publicKey, connected, requestRecords } = useWallet();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error,   setError]   = useState(null);

  const passphrase = "jja3em";
  const programId  = "voteuva3projectsp25.aleo";

  // ------------------------------------------------------------
  // Pull records on‑demand instead of automatically
  // ------------------------------------------------------------
  const handleRefresh = async () => {
    if (!connected) {
      setError("Connect your wallet first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch every record tied to the program
      const recs = await requestRecords(programId);

      // Decode all proposals
      const proposals = recs
        .filter(r => r.recordName === "Proposal")
        .map(r => {
          const id = r.data.id                    // "...field.private"
            .replace(/\.private$/, "")
            .replace(/field$/, "");

          return {
            id,
            title:   decodeFromField(r.data.info.title,   passphrase),
            content: decodeFromField(r.data.info.content, passphrase),
          };
        });

      // Tally votes (1 = agree, 0 = disagree)
      const tally = {};
      recs
        .filter(r => r.recordName === "Vote")
        .forEach(v => {
          const pid = v.data.pid
            .replace(/\.private$/, "")
            .replace(/field$/, "");

          const agree = String(v.data.vote).startsWith("1");
          if (!tally[pid]) tally[pid] = { agree: 0, disagree: 0 };
          agree ? tally[pid].agree++ : tally[pid].disagree++;
        });

      // Merge tally back onto proposals
      const resultsList = proposals.map(p => ({
        ...p,
        agree:    tally[p.id]?.agree    ?? 0,
        disagree: tally[p.id]?.disagree ?? 0,
      }));

      setResults(resultsList);
    } catch (e) {
      console.error("[ResultsView] loadResults error:", e);
      setError(e.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="results-section" className="mt-5 pt-5">
      <h2 className="text-white mb-4">Proposal Results</h2>

      <button
        className="btn btn-primary mb-3"
        onClick={handleRefresh}
        disabled={loading || !connected}
      >
        {loading ? (
          <>
            <span
              className="spinner-border spinner-border-sm me-2"
              role="status"
              aria-hidden="true"
            />
            Loading…
          </>
        ) : (
          "Refresh Results"
        )}
      </button>

      {error && <p className="text-danger">Error: {error}</p>}

      {!loading && !error && results.length === 0 && (
        <p className="text-white">
          (No proposals or votes found for this wallet.)
        </p>
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

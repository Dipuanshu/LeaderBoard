/** @format */
import { useEffect, useState } from "react";
import axios from "axios";

export default function ClaimHistory({ userId }) {
  const [history, setHistory] = useState([]);
  console.log("history", history);

  useEffect(() => {
    if (!userId) {
      setHistory([]);
      return;
    }

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `https://leaderboard-backend-1-qe97.onrender.com/api/claim-history/${userId}`
        );
        console.log("CLAIM HISTORY API RESPONSE:", res.data);
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (error) {
        console.error("Error fetching claim history:", error);
        setHistory([]);
      }
    };

    fetchHistory();
  }, [userId]);

  if (!userId) {
    return (
      <p className="text-center text-gray-400 text-sm">
        Select a user to view history.
      </p>
    );
  }

  if (!Array.isArray(history)) {
    return (
      <p className="text-center text-red-500 text-sm">
        Invalid claim history format.
      </p>
    );
  }

  if (history.length === 0) {
    return <p className="text-center text-gray-500 text-sm">No claims yet.</p>;
  }

  return (
    <ul className="max-h-40 overflow-y-auto text-sm text-gray-700 space-y-2 px-2 mt-4">
      {history.map((entry, index) => (
        <li
          key={index}
          className="bg-orange-50 px-3 py-2 rounded-xl shadow text-xs border border-orange-100"
        >
          <strong className="text-orange-500">
            +{entry.claimedPoints} pts
          </strong>{" "}
          on{" "}
          <span className="text-gray-500">
            {entry.timestamp
              ? new Date(entry.timestamp).toLocaleString()
              : "Unknown date"}
          </span>
        </li>
      ))}
    </ul>
  );
}

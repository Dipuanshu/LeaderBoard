/** @format */

import axios from "./api";
import { useState } from "react";

export default function ClaimPointsButton({ selectedUserId, onClaimSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!selectedUserId) {
      alert("Please select a user before claiming points.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/claim-points", {
        userId: selectedUserId,
      });

      if (onClaimSuccess) {
        onClaimSuccess(res.data.claimedPoints);
      }
    } catch (err) {
      console.error("Error claiming points:", err);
      alert("Failed to claim points.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClaim}
      disabled={loading || !selectedUserId}
      className={`mt-6 w-full px-6 py-3 text-white rounded-lg transition 
        ${
          loading || !selectedUserId
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
    >
      {loading ? "Claiming..." : "Claim Points"}
    </button>
  );
}

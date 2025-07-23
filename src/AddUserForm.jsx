/** @format */

import { useState } from "react";
import axios from "./api"; // Make sure this points to your axios instance

export default function AddUserForm({ onUserAdded }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("⚠️ Name is required");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("/users", { name: trimmedName });
      if (res.status === 201 || res.status === 200) {
        setName(""); // Reset input
        if (onUserAdded) onUserAdded(); // Inform parent to refresh data
      } else {
        setError("❌ Could not add user. Try again.");
      }
    } catch (error) {
      console.error("Add user error:", error);
      setError("❌ Error while adding user.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 flex flex-col sm:flex-row sm:items-center sm:gap-2 w-full"
    >
      <div className="flex flex-col w-full sm:flex-1">
        <input
          type="text"
          className="px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-400 focus:border-blue-400 w-full"
          placeholder="New user name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={loading}
        />
        {error && <p className="text-red-500 text-sm mt-1 ml-1">{error}</p>}
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`mt-2 sm:mt-0 sm:ml-0 sm:w-auto w-full text-white px-4 py-2 rounded-lg transition ${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Adding..." : "Add User"}
      </button>
    </form>
  );
}

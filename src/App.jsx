/** @format */
import { useEffect, useState } from "react";
import axios from "axios";
import AddUserForm from "./AddUserForm";
import ClaimPointsButton from "./ClaimPointsButton";
import Leaderboard from "./Leaderboard";
import ClaimHistory from "./ClaimHistory";
import ErrorBoundary from "./ErrorBoundery";

export default function App() {
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState("");
  const [leaderboard, setLeaderboard] = useState([]);
  const [message, setMessage] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchAll = async () => {
    try {
      const [resUsers, resBoard] = await Promise.all([
        axios.get("/users"),
        axios.get("/leaderboard"),
      ]);
      setUsers(Array.isArray(resUsers.data) ? resUsers.data : []);
      setLeaderboard(Array.isArray(resBoard.data) ? resBoard.data : []);
    } catch (err) {
      console.error("Failed to fetch:", err);
      setUsers([]);
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleAddUser = async () => {
    await fetchAll();
    setMessage("✅ User added successfully!");
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4 lg:p-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-6 relative">
        {/* Leaderboard and actions */}
        <div className="flex-1 overflow-y-auto lg:pr-[22rem]">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-orange-100">
            <h1 className="text-3xl font-extrabold text-center text-orange-500 mb-2">
              🏆 Weekly Leaderboard
            </h1>
            <p className="text-center text-sm text-gray-500 mb-4">
              Claim points & climb the ranks!
            </p>

            <div className="flex justify-center mb-4">
              <ClaimPointsButton
                selectedUserId={selected}
                onClaimSuccess={(points) => {
                  setMessage(`🎉 You claimed ${points} points!`);
                  fetchAll();
                  setSelected("");
                  setRefreshTrigger((prev) => prev + 1);
                }}
              />
            </div>

            {/* ✅ Claim history below ClaimPointsButton on mobile */}
            <div className="lg:hidden mb-6">
              <h3 className="text-lg font-semibold text-orange-500 text-center mb-2">
                Claim History
              </h3>
              <ErrorBoundary>
                <ClaimHistory userId={selected} />
              </ErrorBoundary>
            </div>

            {message && (
              <div className="mt-2 p-3 bg-yellow-50 text-yellow-800 border border-yellow-300 rounded-lg text-center animate-pulse">
                {message}
              </div>
            )}

            <div className="mt-6">
              <ErrorBoundary>
                <Leaderboard
                  refreshTrigger={refreshTrigger}
                  onUserSelect={(userId) => setSelected(userId)}
                  selectedUserId={selected}
                />
              </ErrorBoundary>
            </div>

            {/* ✅ Add user form (visible only on mobile below leaderboard) */}
            <div className="lg:hidden mt-8">
              <h2 className="text-2xl font-bold mb-4 text-orange-600 text-center">
                ➕ Add User
              </h2>
              <AddUserForm onUserAdded={handleAddUser} />
            </div>
          </div>
        </div>

        {/* Right panel (desktop only) */}
        <div className="w-full lg:w-[20rem] lg:fixed lg:right-6 lg:top-6 z-50 hidden lg:block">
          <div className="bg-white p-6 rounded-3xl shadow-lg border border-orange-100 flex flex-col h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mt-2 mb-6 text-orange-600 text-center">
              ➕ Add User
            </h2>

            <AddUserForm onUserAdded={handleAddUser} />

            <div className="mt-6">
              <h3 className="text-lg font-semibold text-orange-500 text-center mb-2">
                Claim History
              </h3>
              <ErrorBoundary>
                <ClaimHistory userId={selected} />
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

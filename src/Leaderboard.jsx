/** @format */

import { useEffect, useState } from "react";
import api from "./api";
import { FaTrophy } from "react-icons/fa";

export default function Leaderboard({
  refreshTrigger,
  onUserSelect,
  selectedUserId,
}) {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await api.get("/leaderboard");
      const sorted = Array.isArray(res.data)
        ? [...res.data].sort((a, b) => b.points - a.points)
        : [];
      setLeaderboard(sorted);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData();
  }, [refreshTrigger]);

  const getRankIcon = (index) => {
    const colors = ["text-yellow-500", "text-gray-400", "text-orange-500"];
    if (index < 3) {
      return (
        <span className={`flex items-center gap-1 font-bold ${colors[index]}`}>
          <FaTrophy />
          {index + 1}
        </span>
      );
    }
    return <span className="text-gray-700 font-medium">{index + 1}</span>;
  };

  if (loading)
    return <p className="text-center text-gray-500">Loading leaderboard...</p>;

  return (
    <div className="mt-8">
      <div className="w-full rounded-lg border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full table-fixed">
          <thead className="bg-blue-50 border-b">
            <tr>
              <th className="px-2 py-2 text-left text-gray-700 text-sm font-semibold w-[25%]">
                Rank
              </th>
              <th className="px-2 py-2 text-left text-gray-700 text-sm font-semibold w-[45%] truncate">
                Name
              </th>
              <th className="px-2 py-2 text-center text-gray-700 text-sm font-semibold w-[30%]">
                Points
              </th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => {
              const isSelected = selectedUserId === user._id;
              return (
                <tr
                  key={user._id}
                  onClick={() => onUserSelect(user._id)}
                  className={`cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-200 font-semibold shadow-inner border-l-4 border-blue-600"
                      : index % 2 === 0
                      ? "bg-white"
                      : "bg-gray-50"
                  } hover:bg-blue-50`}
                >
                  <td className="px-2 py-2">{getRankIcon(index)}</td>
                  <td className="px-2 py-2 text-gray-800 truncate">
                    {user.name}
                  </td>
                  <td className="px-2 py-2 text-center text-gray-900">
                    {user.points}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

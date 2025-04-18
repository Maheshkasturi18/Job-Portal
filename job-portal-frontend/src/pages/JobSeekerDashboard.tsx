// JobSeekerDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useStore } from "../store";
import { Application } from "../types";
import axios from "axios";
import {
  startOfWeek,
  differenceInCalendarWeeks,
  subWeeks,
  parseISO,
  isAfter,
} from "date-fns";
import { baseUrl } from "../Url"; // adjust the path based on your folder structure

// console.log("JobSeekerDashboard component loaded", JobSeekerDashboard);

function JobSeekerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const token = currentUser?.token;
  const [applications, setApplications] = useState<Application[]>([]);
  const [chartData, setChartData] = useState<
    { week: string; applications: number }[]
  >([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Token used for fetching applications:", token); // Debugging check

        console.log("Fetched applications:", response.data); // Debugging check

        setApplications(response.data);
        // Process data for chart (e.g., group by week)
        // const processedChartData = [
        //   { week: "Week 1", applications: 3 },
        //   { week: "Week 2", applications: 5 },
        //   { week: "Week 3", applications: 2 },
        //   { week: "Week 4", applications: 7 },
        // ];
        // Dynamic chart data processing
        const applications = response.data;

        const now = new Date();
        const startDate = startOfWeek(subWeeks(now, 3)); // Start of 4 weeks ago (Week 1)

        const weekCounts = [0, 0, 0, 0]; // Week 1 to Week 4

        applications.forEach((app: Application) => {
          if (!app.appliedAt) return;
          const appliedDate = parseISO(app.appliedAt);
          if (isAfter(appliedDate, now)) return; // ignore future dates

          const weekIndex = differenceInCalendarWeeks(appliedDate, startDate);
          if (weekIndex >= 0 && weekIndex < 4) {
            weekCounts[weekIndex] += 1;
          }
        });

        const processedChartData = weekCounts.map((count, index) => ({
          week: `Week ${index + 1}`,
          applications: count,
        }));

        setChartData(processedChartData);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };
    if (token) {
      fetchApplications();
    }
  }, [token]);

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Job Seeker Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-blue-600">
            {applications.length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Under Review</h3>
          <p className="text-3xl font-bold text-yellow-600">
            {applications.filter((app) => app.status === "pending").length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Accepted</h3>
          <p className="text-3xl font-bold text-green-600">
            {applications.filter((app) => app.status === "accepted").length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Rejected</h3>
          <p className="text-3xl font-bold text-red-600">
            {applications.filter((app) => app.status === "rejected").length}
          </p>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } p-6 rounded-lg shadow-md mb-8`}
      >
        <h2 className="text-xl font-bold mb-4">Application Activity</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="applications"
                stroke="#3B82F6"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Application History
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Company</th>
                <th className="px-6 py-3 text-left">Applied Date</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr
                  key={app._id}
                  className={`${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">{app.jobTitle || "N/A"}</td>
                  <td className="px-6 py-4">
                    <td>
                      {typeof app.jobId === "object" &&
                      "company" in app.jobId !== null
                        ? app.jobId.company
                        : "N/A"}
                    </td>
                  </td>
                  <td className="px-6 py-4">
                    {new Date(app.appliedAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        app.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : app.status === "accepted"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default JobSeekerDashboard;

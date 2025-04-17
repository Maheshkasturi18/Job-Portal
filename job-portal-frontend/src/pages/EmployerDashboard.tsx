// EmployerDashboard.tsx
import React, { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useStore } from "../store";
import { Job, Application } from "../types";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EmployerDashboard() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const token = currentUser?.token;
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<
    {
      jobId: string;
      status: string;
      [key: string]: any;
    }[]
  >([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        // fetch all jobs
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append("title", searchTerm);
        if (selectedCategory) queryParams.append("category", selectedCategory);

        const resJobs = await axios.get(
          `http://localhost:3000/api/jobs?${queryParams.toString()}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        console.log("Query string:", queryParams.toString());
        console.log(
          "Full URL:",
          `http://localhost:3000/api/jobs?${queryParams.toString()}`
        );
        console.log("Employee dashboard jobs list:", resJobs.data);
        setJobs(resJobs.data);

        // fetch all applications
        const resApps = await axios.get(
          "http://localhost:3000/api/applications",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // const allApps: any[] = Array.isArray(resApps.data) ? resApps.data : [];

        const allApps: Application[] = Array.isArray(resApps.data)
          ? resApps.data.map((app) => ({
              _id: app._id,
              jobId: app.jobId,
              jobTitle: app.jobTitle || "N/A",
              appliedDate: app.appliedAt || new Date().toISOString(),
              appliedAt: app.appliedAt || new Date().toISOString(),
              fullName: app.fullName || "N/A",
              status: app.status,
              ...app,
            }))
          : [];
        // // filter applications for this employer's jobs
        // const filteredApps = allApps.filter((app) =>
        //   employerJobs.some((job) => job._id === app.jobId)
        // );
        console.log("Fetched filteredApps:", allApps); // debugger check
        setApplications(allApps);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    if (currentUser) fetchData();
  }, [currentUser, searchTerm, selectedCategory]);

  // dashboard summary counts
  const pendingCount = applications.filter(
    (app) => app.status === "pending"
  ).length;
  const acceptedCount = applications.filter(
    (app) => app.status === "accepted"
  ).length;

  const handleViewDetails = (application: Application) => {
    navigate(`/employer/applications/${application._id}`);
  };

  // const monthlyData = [
  //   { month: "Jan", jobs: 4 },
  //   { month: "Feb", jobs: 6 },
  //   { month: "Mar", jobs: 8 },
  //   { month: "Apr", jobs: 5 },
  //   { month: "May", jobs: 7 },
  //   { month: "Jun", jobs: 9 },
  // ];

  // const categoryData = [
  //   { name: "Development", value: 35 },
  //   { name: "Design", value: 25 },
  //   { name: "Marketing", value: 20 },
  //   { name: "Sales", value: 20 },
  // ];

  // compute monthly job postings (e.g., counts per month name)
  const monthlyData = React.useMemo(() => {
    console.log("Computing monthlyData from jobs:", jobs); // debugger check
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      console.log("job.postedDate =", job.postedDate); // debugger check
      const date = new Date(job.postedDate);
      const monthName = date.toLocaleString("default", { month: "short" });
      counts[monthName] = (counts[monthName] || 0) + 1;
    });
    // transform into array sorted by calendar order
    const monthOrder = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return monthOrder
      .filter((m) => counts[m])
      .map((m) => ({ month: m, jobs: counts[m] }));
  }, [jobs]);

  // compute category distribution for pie chart
  const categoryData = React.useMemo(() => {
    console.log("Computing categoryData from jobs:", jobs); // debugger check
    const counts: Record<string, number> = {};
    jobs.forEach((job) => {
      console.log("job.category =", job.category); // debugger check
      counts[job.category] = (counts[job.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [jobs]);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Employer Dashboard</h1>
        <p className="text-gray-500">Welcome back, {currentUser?.name}</p>
      </div>

      <div className="grid md:grid-cols-4 gap-6 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Active Jobs</h3>
          <p className="text-3xl font-bold text-blue-600">{jobs.length}</p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Total Applications</h3>
          <p className="text-3xl font-bold text-green-600">
            {applications.length}
          </p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Pending Review</h3>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h3 className="text-lg font-semibold mb-2">Hired</h3>
          <p className="text-3xl font-bold text-purple-600">{acceptedCount}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md`}
        >
          <h2 className="text-xl font-bold mb-4">Monthly Job Postings</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="jobs" fill="#3B82F6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div
          className={`${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } p-6 rounded-lg shadow-md overflow-visible`}
        >
          <h2 className="text-xl font-bold mb-4">Jobs by Category</h2>
          <div className="h-80 overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md`}
      >
        <h2 className="text-xl font-bold p-6 border-b border-gray-200">
          Recent Applications
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className={`${isDarkMode ? "bg-gray-700" : "bg-gray-50"}`}>
              <tr>
                <th className="px-6 py-3 text-left">Job Title</th>
                <th className="px-6 py-3 text-left">Applicant</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => (
                <tr
                  key={app._id}
                  className={`${
                    isDarkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                  }`}
                >
                  <td className="px-6 py-4">{app.jobTitle || "N/A"}</td>
                  <td className="px-6 py-4">{app.fullName || "N/A"}</td>
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
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleViewDetails(app as Application)}
                      // onClick={() => handleViewDetails(app)}
                      className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                    >
                      View Details
                    </button>
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

export default EmployerDashboard;

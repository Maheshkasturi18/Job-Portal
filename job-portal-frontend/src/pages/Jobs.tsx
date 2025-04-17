// Jobs.tsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, MapPin, Building2, Clock } from "lucide-react";
import { useStore } from "../store";
import { Job } from "../types";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";

function Jobs() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const token = currentUser?.token;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Fetch jobs from backend with search/filter query parameters
  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append("title", searchTerm);
        if (selectedCategory) queryParams.append("category", selectedCategory);

        const response = await axios.get(
          `http://localhost:3000/api/jobs?${queryParams.toString()}`
        );

        setJobs(response.data);
        console.log("Fetched jobs:", response.data); // debugger check
        setLoading(false);
        setError(null); // Clear error on successful fetch
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs(); // ✅ Always fetch, with or without token
  }, [searchTerm, selectedCategory]);

  // Get distinct categories from fetched jobs
  const categories = Array.isArray(jobs)
    ? [...new Set(jobs.map((job) => job.category))]
    : [];

  const handleDelete = async (id: string) => {
    if (!currentUser?.token) return;
    const confirm = window.confirm("Are you sure you want to delete this job?");
    if (!confirm) return;

    try {
      const res = await axios.delete(`http://localhost:3000/api/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      if (res.status === 200) {
        setJobs((prev) => prev.filter((job) => job._id !== id));
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message || err.message || "Failed to delete job";
      console.error(message);
      // setError(message);
    }
  };

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Find Your Next Opportunity</h1>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div
              className={`flex items-center ${
                isDarkMode ? "bg-gray-800" : "bg-white"
              } rounded-lg p-2 shadow-md`}
            >
              <Search className="w-5 h-5 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full bg-transparent focus:outline-none ${
                  isDarkMode ? "text-white" : "text-gray-900"
                }`}
              />
            </div>
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={`p-2 rounded-lg ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-900"
            } shadow-md`}
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div>Loading jobs...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      ) : (
        <div className="grid gap-6">
          {jobs.length > 0 ? (
            jobs.map((job) => {
              currentUser?.role === "employer" &&
                (currentUser._id === job.employerId ||
                  currentUser._id === job.employerId);

              return (
                <div
                  key={job._id}
                  className={`relative p-14 rounded-lg shadow-md transition ${
                    isDarkMode
                      ? "bg-gray-800 hover:bg-gray-700"
                      : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Link to={`/jobs/${job._id}`} className="block">
                    <div className="flex justify-between items-start">
                      <div>
                        <h2 className="text-xl font-semibold mb-2">
                          {job.title}
                        </h2>
                        <div className="flex items-center text-gray-500 mb-2">
                          <Building2 className="w-4 h-4 mr-1" />
                          <span className="mr-4">{job.company}</span>
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            {job.type}
                          </span>
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${
                              isDarkMode ? "bg-gray-700" : "bg-gray-100"
                            }`}
                          >
                            {job.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-blue-600">
                          ₹ {job.salary}
                        </div>
                        <div className="flex items-center text-gray-500 mt-2">
                          <Clock className="w-4 h-4 mr-1" />
                          <span className="text-sm">
                            Posted{" "}
                            {new Date(job.postedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>

                  {currentUser?.role === "employer" && (
                    <div className="absolute top-4 right-4 flex gap-3">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          navigate(`/employer/create-job/${job._id}`);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Pencil size={18} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(job._id);
                        }}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-center mt-8 text-gray-500">No jobs found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default Jobs;

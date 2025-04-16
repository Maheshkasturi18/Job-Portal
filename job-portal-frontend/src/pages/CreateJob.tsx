// CreateJob.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStore } from "../store";

function CreateJob() {
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const token = currentUser?.token;
  const [jobData, setJobData] = useState({
    title: "",
    description: "",
    location: "",
    category: "",
    salary: "",
    type: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async  (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });
      if (res.ok) {
        navigate("/employer/dashboard");
      } else {
        const data = await res.json();
        setError(data.message || "Error creating job");
      }
    } catch (err) {
      console.log("Error object:", err);
      const errorMessage =
        (err as Error).message || "An unknown error occurred.";
      setError(errorMessage);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Create Job Listing</h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Job Title"
          value={jobData.title}
          onChange={(e) => setJobData({ ...jobData, title: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border"
          required
        />
        <textarea
          placeholder="Job Description"
          value={jobData.description}
          onChange={(e) =>
            setJobData({ ...jobData, description: e.target.value })
          }
          className="w-full p-3 mb-4 rounded-lg border"
          required
        />
        <input
          placeholder="Location"
          value={jobData.location}
          onChange={(e) => setJobData({ ...jobData, location: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border"
          required
        />
        <input
          placeholder="Category"
          value={jobData.category}
          onChange={(e) => setJobData({ ...jobData, category: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border"
          required
        />
        <input
          placeholder="Salary"
          value={jobData.salary}
          onChange={(e) => setJobData({ ...jobData, salary: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border"
          required
        />
        <input
          placeholder="Job Type"
          value={jobData.type}
          onChange={(e) => setJobData({ ...jobData, type: e.target.value })}
          className="w-full p-3 mb-4 rounded-lg border"
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}

export default CreateJob;

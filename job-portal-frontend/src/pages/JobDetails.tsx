// JobDetails.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapPin, Building2, Clock, Send } from "lucide-react";
import { useStore } from "../store";
import { Job } from "../types";

function JobDetails() {
  const { id } = useParams();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((state) => state.currentUser);
  const token = currentUser?.token;
  const [job, setJob] = useState<Job | null>(null);
  
  useEffect(() => {
    async function fetchJob() {
      try {
        const res = await fetch(`/api/jobs/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setJob(data);
      } catch (error) {
        console.error("Error fetching job details:", error);
      }
    }
    if (token) fetchJob();
  }, [id, token]);

  const handleApply = async () => {
    try {
      const res = await fetch(`/api/jobs/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ resumeUrl: "" }), // Optionally add resume URL if available
      });
      if (res.ok) {
        alert("Application submitted successfully!");
      } else {
        alert("Error submitting application.");
      }
    } catch (err) {
      console.error("Application error:", err);
      alert("Error submitting application.");
    }
  };

  if (!job) return <div>Loading job details...</div>;

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"}`}>
      <div
        className={`${
          isDarkMode ? "bg-gray-800" : "bg-white"
        } rounded-lg shadow-md p-8 mb-8`}
      >
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-4">{job.title}</h1>
            <div className="flex items-center text-gray-500 mb-4">
              <Building2 className="w-5 h-5 mr-2" />
              <span className="mr-4">{job.company}</span>
              <MapPin className="w-5 h-5 mr-2" />
              <span>{job.location}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {job.type}
              </span>
              <span
                className={`px-4 py-2 rounded-full text-sm ${
                  isDarkMode ? "bg-gray-700" : "bg-gray-100"
                }`}
              >
                {job.category}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600 mb-2">
              {job.salary}
            </div>
            <div className="flex items-center text-gray-500">
              <Clock className="w-5 h-5 mr-2" />
              <span>
                Posted {new Date(job.postedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        {currentUser?.role === "jobseeker" && (
          <button
            onClick={handleApply}
            className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition flex items-center justify-center"
          >
            <Send className="w-5 h-5 mr-2" />
            Apply Now
          </button>
        )}
      </div>
      {/* Additional sections such as Job Description, Requirements, Company Overview */}
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-8 mb-8`}
          >
            <h2 className="text-2xl font-bold mb-4">Job Description</h2>
            <p className="mb-6 whitespace-pre-line">{job.description}</p>
          </div>
        </div>
        <div>
          <div
            className={`${
              isDarkMode ? "bg-gray-800" : "bg-white"
            } rounded-lg shadow-md p-8`}
          >
            <h2 className="text-xl font-bold mb-4">Company Overview</h2>
            <div className="flex items-center mb-4">
              <Building2 className="w-12 h-12 text-blue-600 mr-4" />
              <div>
                <h3 className="font-semibold">{job.company}</h3>
                <p className="text-gray-500">{job.location}</p>
              </div>
            </div>
            <p className="text-gray-500">
              Leading technology company specializing in innovative solutions...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;

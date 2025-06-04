import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store";
import axios from "axios";
import { baseUrl } from "../Url";

interface JobData {
  title: string;
  description: string;
  requirements: string;
  company: string;
  location: string;
  category: string;
  salaryMin: string;
  salaryMax: string;
  salaryType: string;
  currency: string;
  type: string;
}

function CreateJob() {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const currentUser = useStore((state) => state.currentUser);
  const token = currentUser?.token;
  const isDarkMode = useStore((state) => state.isDarkMode);
  const [jobData, setJobData] = useState<JobData>({
    title: "",
    description: "",
    requirements: "",
    company: "",
    location: "",
    category: "",
    salaryMin: "",
    salaryMax: "",
    salaryType: "per_month",
    currency: "INR",
    type: "",
  });
  const [error, setError] = useState("");
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (!currentUser || currentUser.role !== "employer") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (isEditMode && id && token) {
      axios
        .get(`${baseUrl}/api/jobs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setJobData({
            title: res.data.title,
            description: res.data.description,
            requirements: res.data.requirements,
            company: res.data.company,
            location: res.data.location,
            category: res.data.category,
            salaryMin: String(res.data.salaryMin),
            salaryMax: String(res.data.salaryMax),
            salaryType: res.data.salaryType || "per_month",
            currency: res.data.currency || "INR",
            type: res.data.type,
          });
        })
        .catch(() => setError("Failed to load job details"));
    }
  }, [id, isEditMode, token]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...jobData,
        salaryMin: Number(jobData.salaryMin),
        salaryMax: Number(jobData.salaryMax),
      };

      if (isEditMode && id) {
        await axios.patch(`${baseUrl}/api/jobs/${id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${baseUrl}/api/jobs`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      navigate("/jobs");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error saving job");
    }
  };

  return (
    <div
      className={`max-w-xl mx-auto p-6 rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? "text-white" : "text-gray-800"
        }`}
      >
        {isEditMode ? "Edit Job" : "Post a Job"}
      </h2>
      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Job Title"
          value={jobData.title}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
          required
        />

        <textarea
          name="description"
          placeholder="Job Description"
          value={jobData.description}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
          required
        />

        <input
          name="company"
          placeholder="Company"
          value={jobData.company}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
          required
        />

        <textarea
          name="requirements"
          placeholder="Job Requirements"
          value={jobData.requirements}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
          required
        />

        <input
          name="location"
          placeholder="Location"
          value={jobData.location}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
          required
        />

        <input
          name="category"
          placeholder="Category"
          value={jobData.category}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        />

        <div className="flex gap-4 mb-4">
          <input
            name="salaryMin"
            type="number"
            placeholder="Min Salary"
            value={jobData.salaryMin}
            onChange={handleChange}
            className={`w-full p-3 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          />
          <input
            name="salaryMax"
            type="number"
            placeholder="Max Salary"
            value={jobData.salaryMax}
            onChange={handleChange}
            className={`w-full p-3 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          />
        </div>

        <div className="flex gap-4 mb-4">
          <select
            name="salaryType"
            value={jobData.salaryType}
            onChange={handleChange}
            className={`w-full p-3 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <option value="per_month">Per Month</option>
            <option value="per_annum">Per Annum</option>
            <option value="per_hour">Per Hour</option>
          </select>

          <select
            name="currency"
            value={jobData.currency}
            onChange={handleChange}
            className={`w-full p-3 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
          >
            <option value="INR">₹ Rupees</option>
            <option value="USD">$ USD</option>
            <option value="EUR">€ Euro</option>
          </select>
        </div>

        <input
          name="type"
          placeholder="Job Type (Full-Time, Part-Time)"
          value={jobData.type}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700"
        >
          {isEditMode ? "Update Job" : "Post Job"}
        </button>
      </form>
    </div>
  );
}

export default CreateJob;

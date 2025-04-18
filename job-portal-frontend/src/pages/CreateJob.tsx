import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../store";
import axios from "axios";
import { baseUrl } from "../Url";

interface JobData {
  title: string;
  description: string;
  location: string;
  category: string;
  salary: string;
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
    location: "",
    category: "",
    salary: "",
    type: "",
  });
  const [error, setError] = useState("");
  const isEditMode = Boolean(id);

  // redirect non-employers
  useEffect(() => {
    if (!currentUser || currentUser.role !== "employer") {
      navigate("/login");
    }
  }, [currentUser, navigate]);

  // fetch existing job when editing
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
            location: res.data.location,
            category: res.data.category,
            salary: String(res.data.salary),
            type: res.data.type,
          });
        })
        .catch(() => setError("Failed to load job details"));
    }
  }, [id, isEditMode, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setJobData({ ...jobData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode && id) {
        // update
        await axios.patch(
          `${baseUrl}/api/jobs/${id}`,
          { ...jobData, salary: Number(jobData.salary) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        // create
        await axios.post(
          `${baseUrl}/api/jobs`,
          { ...jobData, salary: Number(jobData.salary) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      navigate("/employer/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Error saving job");
    }
  };

  return (
    <div
      className={`max-w-xl mx-auto p-6  rounded-lg shadow-md ${
        isDarkMode ? "bg-gray-800 " : "bg-white "
      }`}
    >
      <h2
        className={`text-2xl font-bold mb-6 ${
          isDarkMode ? "text-white " : "text-gray-800 "
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
            isDarkMode ? "bg-gray-800 text-white" : "bg-white  text-gray-800"
          }`}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={jobData.description}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white  text-gray-800"
          }`}
          required
        />
        <input
          name="location"
          placeholder="Location"
          value={jobData.location}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
            isDarkMode ? "bg-gray-800 text-white" : "bg-white  text-gray-800"
          }`}
          required
        />
        <input
          name="category"
          placeholder="Category"
          value={jobData.category}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
             isDarkMode ? "bg-gray-800 text-white" : "bg-white  text-gray-800"
          }`}
        />
        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={jobData.salary}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
             isDarkMode ? "bg-gray-800 text-white" : "bg-white  text-gray-800"
          }`}
        />
        <input
          name="type"
          placeholder="Job Type (Full-Time, Part-Time)"
          value={jobData.type}
          onChange={handleChange}
          className={`w-full mb-4 p-3 border rounded ${
             isDarkMode ? "bg-gray-800 text-white" : "bg-white  text-gray-800"
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

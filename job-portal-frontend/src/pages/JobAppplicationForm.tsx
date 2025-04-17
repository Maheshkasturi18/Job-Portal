import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useStore } from "../store";

export default function JobApplicationForm() {
  const { id: jobId } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useStore((state) => state.isDarkMode);
  const currentUser = useStore((s) => s.currentUser);
  const token = currentUser?.token;

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    location: "",
    jobTitle: "",
    resumeLink: "",
    linkedin: "",
    portfolio: "",
    experience: "",
    education: "",
    coverLetter: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required
    const required = [
      "fullName",
      "email",
      "phone",
      "location",
      "jobTitle",
      "resumeLink",
    ];
    for (let field of required) {
      if (!formData[field as keyof typeof formData]) {
        setError(`Please fill in your ${field}`);
        return;
      }
    }

    if (!token) {
      setError("You must be logged in to apply");
      return;
    }

    setSubmitting(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/api/jobs/${jobId}/apply`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.status === 201) {
        alert("Application submitted successfully!");
        navigate(-1); // go back to job details
      } else {
        setError(res.data?.message || "Error submitting application");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || "Failed to apply");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Full Name*
        </label>
        <input
          name="fullName"
          type="text"
          value={formData.fullName}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Email*
        </label>
        <input
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Phone*
        </label>
        <input
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Location*
        </label>
        <input
          name="location"
          type="text"
          value={formData.location}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Job Title*
        </label>
        <input
          name="jobTitle"
          type="text"
          value={formData.jobTitle}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Resume Link*
        </label>
        <input
          name="resumeLink"
          type="url"
          value={formData.resumeLink}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://drive.google.com/..."
          required
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          LinkedIn
        </label>
        <input
          name="linkedin"
          type="url"
          value={formData.linkedin}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://linkedin.com/in/..."
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Portfolio
        </label>
        <input
          name="portfolio"
          type="url"
          value={formData.portfolio}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="https://github.com/..."
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Experience
        </label>
        <textarea
          name="experience"
          value={formData.experience}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={3}
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Education
        </label>
        <textarea
          name="education"
          value={formData.education}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={2}
        />
      </div>

      <div>
        <label
          className={`block font-medium ${
            isDarkMode ? "text-white" : "text-gray-900"
          }`}
        >
          Cover Letter
        </label>
        <textarea
          name="coverLetter"
          value={formData.coverLetter}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          rows={4}
        />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-blue-600 text-white p-3 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {submitting ? "Submitting…" : "Submit Application"}
      </button>
    </form>
  );
}

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useStore } from "../store";
import { baseUrl } from "../Url"; // adjust the path based on your folder structure
import { ArrowLeft } from "lucide-react";

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
        `${baseUrl}/api/jobs/${jobId}/apply`,
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

  const handleBack = () => {
    navigate(-1); // go back to previous page
  };

  return (
    <div className="max-w-3xl mx-auto ">
      <div className="flex gap-2 items-center mb-4">
        <ArrowLeft onClick={handleBack} className="cursor-pointer"/>
        <h1 className="text-2xl font-semibold ">Applicant Details</h1>
      </div>
      <form
        onSubmit={handleSubmit}
        className={`space-y-4 p-6 border rounded-lg shadow-md  ${
          isDarkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
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
            className={`w-full p-2 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
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
            className={`w-full p-2 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
            required
          />
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full">
            <label
              className={` font-medium ${
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
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              required
            />
          </div>

          <div className="w-full">
            <label
              className={` font-medium ${
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
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              required
            />
          </div>
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
            className={`w-full p-2 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
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
            className={`w-full p-2 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
            placeholder="https://drive.google.com/..."
            required
          />
        </div>

        <div className="flex flex-col md:flex-row  gap-4">
          <div className="w-full">
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
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              placeholder="https://linkedin.com/in/..."
            />
          </div>

          <div className="w-full">
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
              className={`w-full p-2 border rounded ${
                isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
              }`}
              placeholder="https://github.com/..."
            />
          </div>
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
            className={`w-full p-2 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
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
            className={`w-full p-2 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
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
            className={`w-full p-2 border rounded ${
              isDarkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
            }`}
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
    </div>
  );
}

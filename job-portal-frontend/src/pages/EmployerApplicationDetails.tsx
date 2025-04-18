import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useStore } from "../store";
import { baseUrl } from "../Url"; // adjust the path based on your folder structure
import { Application } from "../types"; // adjust the path based on your folder structure

const EmployerApplicationDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useStore(); // access the token from global state
  const token = currentUser?.token;

  const handleStatusChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newStatus = e.target.value;
    try {
      await axios.patch(
        `${baseUrl}/api/applications/${id}`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setApplication((prev) => (prev ? { ...prev, status: newStatus } : prev));
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await axios.get(
          `${baseUrl}/api/applications/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setApplication(res.data);
      } catch (err) {
        console.error("Error fetching application:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

  if (loading) {
    return <div className="text-center py-10 text-gray-600">Loading...</div>;
  }

  if (!application) {
    return (
      <div className="text-center py-10 text-red-500">
        Application not found.
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Applicant Details
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8">
        <Detail label="Full Name" value={application.fullName} />
        <Detail label="Email" value={application.email} />
        <Detail label="Phone" value={application.phone} />
        <Detail label="Location" value={application.location} />
        <Detail
          label="Resume"
          value={
            <a
              href={application.resumeLink}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          }
        />
        {application.linkedin && (
          <Detail
            label="LinkedIn"
            value={
              <a
                href={application.linkedin}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {application.linkedin}
              </a>
            }
          />
        )}
        {application.portfolio && (
          <Detail
            label="Portfolio"
            value={
              <a
                href={application.portfolio}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {application.portfolio}
              </a>
            }
          />
        )}
        {application.experience && (
          <Detail label="Experience" value={application.experience} />
        )}
        {application.education && (
          <Detail label="Education" value={application.education} />
        )}
        {application.coverLetter && (
          <Detail label="Cover Letter" value={application.coverLetter} />
        )}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <span className="font-semibold text-gray-700 sm:w-1/3">Status:</span>
          <select
            className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 sm:w-2/3"
            value={application.status}
            onChange={handleStatusChange}
          >
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <Detail
          label="Applied On"
          value={new Date(application.appliedAt).toLocaleDateString()}
        />
      </div>
    </div>
  );
};

const Detail = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
    <span className="font-semibold text-gray-700 sm:w-1/3">{label}:</span>
    <span className="text-gray-800 sm:w-2/3">{value}</span>
  </div>
);

export default EmployerApplicationDetails;

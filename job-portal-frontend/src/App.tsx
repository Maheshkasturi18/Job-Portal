import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useStore } from "./store";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Jobs from "./pages/Jobs";
import JobDetails from "./pages/JobDetails";
import EmployerDashboard from "./pages/EmployerDashboard";
import JobSeekerDashboard from "./pages/JobSeekerDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CreateJob from "./pages/CreateJob";
import JobApplicationForm from "./pages/JobAppplicationForm";
import EmployerApplicationDetails from "./pages/EmployerApplicationDetails";

function App() {
  const isDarkMode = useStore((state) => state.isDarkMode);
  const setCurrentUser = useStore((state) => state.setCurrentUser);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && user && expiresAt && Date.now() < Number(expiresAt)) {
      setCurrentUser({ ...JSON.parse(user), token });
    } else {
      localStorage.clear();
      setCurrentUser(null);
    }
  }, [setCurrentUser]);

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "dark bg-gray-900" : "bg-gray-50"
      }`}
    >
      <BrowserRouter>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetails />} />
            <Route path="/employer/dashboard" element={<EmployerDashboard />} />
            <Route path="/jobseeker/dashboard" element={<JobSeekerDashboard/>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/employer/create-job" element={<CreateJob />} />
            <Route path="/employer/create-job/:id" element={<CreateJob />} />
            <Route path="/jobs/:id/apply" element={<JobApplicationForm />} />
            <Route
              path="/employer/applications/:id"
              element={<EmployerApplicationDetails />}
            />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;

// Home.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Link, useNavigate } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Search,
  Building2,
  Clock,
  ArrowRight,
  Users,
  Building,
  TrendingUp,
  User,
} from "lucide-react";
import { useStore } from "../store";
import { Job } from "../types";
import { baseUrl } from "../Url";

function Home() {
  var settings = {
    dots: true,
    infinite: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: false,
    arrows: true,
    autoplaySpeed: 4000,
    cssEase: "linear",
  };

  const isDarkMode = useStore((state) => state.isDarkMode);
  const navigate = useNavigate();
  const currentUser = useStore((state) => state.currentUser);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const token = currentUser?.token;

  const handlePostJobClick = () => {
    if (!currentUser || currentUser.role !== "employer") {
      navigate("/register");
    } else {
      navigate("/employer/create-job");
    }
  };

  useEffect(() => {
    async function fetchJobs() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();

        const endpoint =
          currentUser?.role === "employer"
            ? `${baseUrl}/api/employer/jobs?${queryParams}`
            : `${baseUrl}/api/jobs?${queryParams}`;

        const resp = await axios.get<Job[]>(endpoint, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        console.log("Fetched jobs (before-filter):", resp.data);

        // Shuffle the array
        const shuffled = resp.data.sort(() => 0.5 - Math.random());

        // Get any 4 data
        const selected = shuffled.slice(0, 4);

        setJobs(selected);
        setError(null);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError("Failed to fetch jobs. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchJobs();
  }, []);

  const visibleJobs = React.useMemo(() => jobs, [jobs]);

  return (
    <div className={`${isDarkMode ? "text-white" : "text-gray-900"} py-8`}>
      {/* hero section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Find Your Dream Job Today</h1>
        <p className="text-xl mb-8">
          Connect with top employers and opportunities
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/jobs"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Browse Jobs
          </Link>
          {currentUser?.role !== "jobseeker" && (
            <button
              onClick={handlePostJobClick}
              className={`${
                isDarkMode
                  ? "border border-white text-white"
                  : "border border-black text-black"
              }   px-6 py-2 rounded-lg hover:bg-blue-700 hover:text-white hover:border-0 `}
            >
              Post a Job
            </button>
          )}
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-8 mt-16">
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <Search className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Search Jobs</h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Browse through thousands of job listings from top companies.
          </p>
        </div>
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <Briefcase className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Easy Apply</h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Apply to multiple jobs with just a few clicks using your profile.
          </p>
        </div>
        <div
          className={`p-6 rounded-lg ${
            isDarkMode ? "bg-gray-800" : "bg-white"
          } shadow-lg`}
        >
          <Building2 className="w-12 h-12 text-blue-600 mb-4" />
          <h3 className="text-xl font-semibold mb-2">Company Profiles</h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            Learn about company culture and benefits before applying.
          </p>
        </div>
      </div>

      {/* featured job */}

      <div className="my-16 md:my-28">
        <div className="flex items-center justify-between  ">
          <h1 className="text-2xl md:text-3xl  font-bold">Featured Jobs</h1>

          <Link
            to="/jobs"
            className="text-blue-600 font-semibold hover:underline flex items-center"
          >
            View all jobs <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {loading ? (
          <div>Loading jobs...</div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">
            {error}
          </div>
        ) : visibleJobs.length === 0 ? (
          <p className="text-center mt-8 text-gray-500">
            {currentUser?.role === "employer"
              ? "You haven’t posted any jobs yet."
              : "No jobs found."}
          </p>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-8 mt-8">
            {visibleJobs.map((job) => (
              <div
                key={job._id}
                className={`p-6 rounded-lg ${
                  isDarkMode ? "bg-gray-800" : "bg-white"
                } shadow-lg`}
              >
                <Link to={`/jobs/${job._id}`} className="block">
                  <div className="flex flex-col gap-5 justify-between items-start">
                    <div>
                      <h2 className="text-xl font-semibold mb-2">
                        {job.title}
                      </h2>
                      <div className="flex flex-col gap-2 text-gray-500 mb-2">
                        <div className="flex gap-2 items-center">
                          <Building2 className="w-4 h-4 mr-1" />
                          <span >{job.company}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{job.location}</span>
                        </div>
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
                      <div className="text-md font-semibold text-blue-600">
                        {job.currency === "INR" && "₹"}
                        {job.currency === "USD" && "$"}
                        {job.currency === "EUR" && "€"}
                        {job.salaryMin} – {job.salaryMax}{" "}
                        {job.salaryType === "per_month" && "per month"}
                        {job.salaryType === "per_annum" && "per annum"}
                        {job.salaryType === "per_hour" && "per hour"}
                      </div>

                      <div className="flex items-center text-gray-500 mt-2">
                        <Clock className="w-4 h-4 mr-1" />
                        <span className="text-sm">
                          Posted {new Date(job.postedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 text-end">
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition">
                      Apply Now
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* job */}

      <div className="bg-blue-600 rounded-xl px-4 py-8 md:p-12 text-white mb-16">
        <div className="text-center mb-12 md:mb-20">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            JobPortal in Numbers
          </h1>

          <p>
            Our platform connects thousands of job seekers with employers every
            day, creating success stories across industries.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <Users className="w-12 h-12 text-blue-600 bg-white rounded-full p-2 mb-4" />
            <h2 className="text-3xl font-bold mb-2">6000+</h2>
            <p>Jobs Seekers</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Briefcase className="w-12 h-12 text-blue-600 bg-white rounded-full p-2 mb-4" />
            <h2 className="text-3xl font-bold mb-2">800+</h2>
            <p>Jobs Posted</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <Building className="w-12 h-12 text-blue-600 bg-white rounded-full p-2 mb-4" />
            <h2 className="text-3xl font-bold mb-2">100+</h2>
            <p>Companies</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <TrendingUp className="w-12 h-12 text-blue-600 bg-white rounded-full p-2 mb-4" />
            <h2 className="text-3xl font-bold mb-2">93%</h2>
            <p>Success Rate</p>
          </div>
        </div>
      </div>

      {/* testimonial */}

      <div>
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Success Stories
          </h1>

          <p>
            Hear from job seekers and employers who found success through our
            platform.
          </p>
        </div>

        <div className="w-11/12 md:w-7/12 mx-auto ">
          <Slider {...settings}>
            <div className=" p-8  rounded-lg  ">
              <p className="text-xl mb-8">
                "As a recent graduate, I was nervous about finding the right
                job. Within two weeks of creating my profile on JobPortal, I
                started receiving interview calls. I’m now working as a Junior
                Developer at a great company!"
              </p>
              <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-blue-600 bg-blue-200 rounded-full p-2" />
                <div>
                  <h3 className="font-semibold text-lg"> Priya Sharma</h3>
                  <p className="text-gray-500">Software Engineer</p>
                </div>
              </div>
            </div>

            <div className="p-8  rounded-lg ">
              <p className="text-xl mb-8">
                "After 5 years in sales, I decided to move into digital
                marketing. JobPortal’s tailored job alerts and career resources
                made the switch smooth. I’m now a Digital Marketing Analyst and
                loving it!"
              </p>
              <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-blue-600 bg-blue-200 rounded-full p-2" />
                <div>
                  <h3 className="font-semibold text-lg">Rahul Verma</h3>
                  <p className="text-gray-500">Digital Marketing Analyst</p>
                </div>
              </div>
            </div>

            <div className="p-8  rounded-lg ">
              <p className="text-xl mb-8">
                "Being a new mom, I needed a flexible remote job. JobPortal’s
                filters helped me find exactly what I was looking for. I now
                work remotely for a U.S.-based startup from the comfort of my
                home"
              </p>
              <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-blue-600 bg-blue-200 rounded-full p-2" />
                <div>
                  <h3 className="font-semibold text-lg">Anita Desai</h3>
                  <p className="text-gray-500">Remote UX Designer</p>
                </div>
              </div>
            </div>

            <div className="p-8  rounded-lg ">
              <p className="text-xl mb-8">
                "I was looking for opportunities abroad and didn’t know where to
                start. JobPortal made it possible by connecting me with a UK
                recruiter. I now work in London as a Data Analyst!"
              </p>
              <div className="flex items-center gap-4">
                <User className="w-12 h-12 text-blue-600 bg-blue-200 rounded-full p-2" />
                <div>
                  <h3 className="font-semibold text-lg">Ahmed Khan</h3>
                  <p className="text-gray-500"> Data Analyst</p>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </div>
    </div>
  );
}

export default Home;

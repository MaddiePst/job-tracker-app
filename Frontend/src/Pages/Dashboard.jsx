// src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import JobCard from "../components/JobCard";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // try axios instance
        try {
          const res = await api.get("/jobs/allJobs");
          if (mounted) setJobs(res.data || []);
          return;
        } catch (err) {
          console.warn(
            "api get failed",
            err?.response?.status,
            err?.response?.data
          );
        }

        // fallback manual
        const axios = (await import("axios")).default;
        const manualRes = await axios.get(
          "http://localhost:8000/jobs/allJobs",
          {
            headers: { Authorization: token ? `Bearer ${token}` : undefined },
          }
        );
        if (mounted) setJobs(manualRes.data || []);
      } catch (err) {
        console.error("Failed to load jobs:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/jobs/login");
        } else {
          // console error already printed
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [navigate, location.search]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete job?")) return;
    try {
      await api.delete(`/jobs/allJobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  const handleEdit = (job) => {
    navigate(`/jobs/edit/${job.id}`, { state: { job } });
  };

  return (
    <div className="app-container py-9 px-5 bg-gray-100">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-m text-muted">Your tracked job applications</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/jobs/new")}
            className="inline-flex items-center gap-2 px-4 py-2 bg-green-900 text-white sm:bg-green-900 sm:text-white rounded-lg shadow md:bg-gray-300 md:text-black hover:bg-green-900 hover:text-gray-200"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
            Add Job
          </button>
        </div>
      </header>

      {/* summary / stats row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-900 px-3 py-5  md:py-9 lg:py-15 rounded-2xl shadow-card flex items-center justify-between text-white">
          <div>
            <p className="text-xl text-muted">Total Applications</p>
            <p className="text-4xl font-semibold">{jobs.length}</p>
          </div>
          <div className="text-5xl">📨</div>
        </div>
        <div className="bg-green-800 p-4 rounded-2xl shadow-card flex items-center justify-between text-white">
          <div>
            <p className="text-xl text-muted">Open Interviews</p>
            <p className="text-4xl font-semibold">
              {jobs.filter((j) => j.status === "Interviewing").length}
            </p>
          </div>
          <div className="text-5xl">✨</div>
        </div>
        <div className="bg-green-700 p-4 rounded-2xl shadow-card flex items-center justify-between text-white">
          <div>
            <p className="text-xl text-muted">Offers</p>
            <p className="text-4xl font-semibold">
              {jobs.filter((j) => j.status === "Offer").length}
            </p>
          </div>
          <div className="text-5xl">🚀</div>
        </div>
      </section>

      {/* jobs list */}
      <section>
        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-6 bg-white rounded-2xl skeleton h-28" />
            <div className="p-6 bg-white rounded-2xl skeleton h-28" />
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white p-6 rounded-2xl shadow-card text-center text-muted">
            No jobs yet — click{" "}
            <button
              onClick={() => navigate("/jobs/new")}
              className="text-brand-500 font-medium"
            >
              Add Job
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

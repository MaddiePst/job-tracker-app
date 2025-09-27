// // src/pages/Dashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../utils/api";
import JobCard from "../Components/JobCard";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // load jobs — effect depends on location.search (so ?refresh=timestamp will re-run it)
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        // 1) Log token presence
        const token = localStorage.getItem("token");
        console.log("DEBUG: token from localStorage:", token);

        // 2) Try request using api (with interceptor if configured)
        try {
          console.log(
            "DEBUG: calling api.get('/jobs/allJobs') using axios instance"
          );
          const res = await api.get("/jobs/allJobs");
          console.log("DEBUG: response from api.get:", res.status, res.data);
          if (mounted) setJobs(res.data || []);
          // stop here if successful
          return;
        } catch (err) {
          console.warn(
            "DEBUG: api.get('/jobs/allJobs') failed:",
            err?.response?.status,
            err?.response?.data
          );
        }

        // 3) Try fetching manually with axios and explicit Authorization header
        try {
          const axios = (await import("axios")).default;
          const manualRes = await axios.get(
            "http://localhost:8000/jobs/allJobs",
            {
              headers: {
                Authorization: token ? `Bearer ${token}` : undefined,
              },
            }
          );
          console.log(
            "DEBUG: manual axios response:",
            manualRes.status,
            manualRes.data
          );
          if (mounted) setJobs(manualRes.data || []);
          return;
        } catch (manualErr) {
          console.error(
            "DEBUG: manual axios get failed:",
            manualErr?.response?.status,
            manualErr?.response?.data || manualErr.message
          );
          // If both calls failed, we'll handle below
          throw manualErr;
        }
      } catch (err) {
        console.error("Failed to load jobs:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/jobs/login");
        } else {
          alert("Failed to load jobs (see console for debug info)");
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
      // update UI immediately
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
    <div className="container">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
        <div>
          <button className="btn" onClick={() => navigate("/jobs/new")}>
            Add Job
          </button>
        </div>
      </header>

      {loading ? (
        <div>Loading...</div>
      ) : jobs.length === 0 ? (
        <div>No jobs yet</div>
      ) : (
        <div className="jobs-list">
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
    </div>
  );
}

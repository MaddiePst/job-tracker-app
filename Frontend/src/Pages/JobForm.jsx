// src/pages/JobForm.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import api from "../utils/api";

export default function JobForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();
  const editing = Boolean(params.id);
  const passedJob = location.state?.job || null;

  // form state
  const [company, setCompany] = useState(passedJob?.company || "");
  const [title, setTitle] = useState(passedJob?.title || "");
  const [locationStr, setLocationStr] = useState(passedJob?.location || "");
  const [status, setStatus] = useState(passedJob?.status || "Applied");
  const [notes, setNotes] = useState(passedJob?.notes || "");
  const [saving, setSaving] = useState(false);

  // If we're editing but no job was passed via state, fetch single job (optional)
  useEffect(() => {
    let mounted = true;
    async function fetchJobIfNeeded() {
      if (editing && !passedJob) {
        try {
          const res = await api.get("/jobs/allJobs"); // get all and find one (backend doesn't expose single GET)
          if (!mounted) return;
          const job = res.data.find((j) => String(j.id) === String(params.id));
          if (!job) {
            alert("Job not found");
            navigate("/dashboard");
            return;
          }
          setCompany(job.company || "");
          setTitle(job.title || "");
          setLocationStr(job.location || "");
          setStatus(job.status || "Applied");
          setNotes(job.notes || "");
        } catch (err) {
          console.error("Failed to load job", err);
          alert("Failed to load job");
          navigate("/dashboard");
        }
      }
    }
    fetchJobIfNeeded();
    return () => {
      mounted = false;
    };
  }, [editing, passedJob, params.id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        // update existing job
        await api.put(`/jobs/allJobs/${params.id}`, {
          company,
          title,
          location: locationStr,
          status,
          notes,
        });
        // After edit, navigate back to dashboard (you can also pass state if you want)
        navigate("/dashboard?refresh=" + Date.now());
      } else {
        // create new job
        const res = await api.post("/jobs/allJobs", {
          company,
          title,
          location: locationStr,
          status,
          notes,
        });
        // Force dashboard to re-fetch by adding a unique query param
        navigate("/dashboard?refresh=" + Date.now());
      }
    } catch (err) {
      console.error("Save failed", err);
      alert(err.response?.data?.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container">
      <h2>{editing ? "Edit Job" : "Add Job"}</h2>
      <form onSubmit={handleSubmit} className="job-form">
        <label>
          Company
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
          />
        </label>

        <label>
          Title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </label>

        <label>
          Location
          <input
            value={locationStr}
            onChange={(e) => setLocationStr(e.target.value)}
            required
          />
        </label>

        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option>Applied</option>
            <option>Interviewing</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
        </label>

        <label>
          Notes
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
        </label>

        <div style={{ marginTop: 12 }}>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? "Saving..." : editing ? "Save Changes" : "Create Job"}
          </button>
          <button
            type="button"
            className="btn"
            style={{ marginLeft: 8 }}
            onClick={() => navigate(-1)}
            disabled={saving}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

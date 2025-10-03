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

  const [company, setCompany] = useState(passedJob?.company || "");
  const [title, setTitle] = useState(passedJob?.title || "");
  const [locationStr, setLocationStr] = useState(passedJob?.location || "");
  const [status, setStatus] = useState(passedJob?.status || "Applied");
  const [notes, setNotes] = useState(passedJob?.notes || "");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchJobIfNeeded() {
      if (editing && !passedJob) {
        try {
          const res = await api.get("/jobs/allJobs");
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
        await api.put(`/jobs/allJobs/${params.id}`, {
          company,
          title,
          location: locationStr,
          status,
          notes,
        });
        navigate("/dashboard?refresh=" + Date.now());
      } else {
        const res = await api.post("/jobs/allJobs", {
          company,
          title,
          location: locationStr,
          status,
          notes,
        });
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
    <div className="app-container py-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">
            {editing ? "Edit Job" : "Add Job"}
          </h2>
          <button className="text-sm" onClick={() => navigate(-1)}>
            Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-muted">Company</label>
            <input
              className="mt-1 block w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted">Title</label>
            <input
              className="mt-1 block w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted">Location</label>
            <input
              className="mt-1 block w-full border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={locationStr}
              onChange={(e) => setLocationStr(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-muted">Status</label>
            <select
              className="mt-1 block w-full border border-gray-400 rounded-md px-3 py-2 "
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Applied</option>
              <option>Interviewing</option>
              <option>Offer</option>
              <option>Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-muted">Notes</label>
            <textarea
              className="mt-1 block w-full border border-gray-400 rounded-md px-3 py-2 h-28 focus:outline-none focus:ring-2 focus:ring-green-600"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-3 mt-2">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-4 py-2 bg-green-900 text-white xl:bg-gray-300 border xl:text-black rounded-md hover:bg-green-900 hover:text-white disabled:opacity-60"
            >
              {saving ? "Saving..." : editing ? "Save Changes" : "Create Job"}
            </button>

            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={saving}
              className="px-4 py-2 border rounded-md bg-gray-200 xl:bg-white hover:xl:bg-gray-200"
            >
              Back
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

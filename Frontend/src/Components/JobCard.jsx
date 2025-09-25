import React from "react";

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className="job-card">
      <div>
        <h3>{job.title}</h3>
        <p className="muted">
          {job.company} • {job.location}
        </p>
        <p>{job.notes}</p>
      </div>
      <div className="job-actions">
        <span className="status">{job.status}</span>
        <div>
          <button onClick={() => onEdit(job)} className="btn">
            Edit
          </button>
          <button onClick={() => onDelete(job.id)} className="btn btn-delete">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

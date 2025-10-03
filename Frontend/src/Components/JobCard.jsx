// src/components/JobCard.jsx
import React from "react";

export default function JobCard({ job, onEdit, onDelete }) {
  return (
    <div className="bg-white rounded-2xl shadow-card p-5 flex flex-row  justify-between gap-4 items-start">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-brand-100 flex items-center justify-center text-brand-700 font-semibold">
            {job.company ? job.company[0].toUpperCase() : "J"}
          </div>
          <div className="truncate">
            <h3 className="text-lg font-semibold truncate">{job.title}</h3>
            <p className="text-sm text-muted truncate">
              {job.company} • {job.location}
            </p>
          </div>
        </div>

        <p className="mt-3 text-sm text-gray-700 line-clamp-2">
          {job.notes || ""}
        </p>
      </div>

      <div className="flex flex-col items-end gap-3">
        <div className="text-right">
          <span
            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full
            ${job.status === "Applied" ? "bg-blue-50 text-brand-700" : ""}
            ${
              job.status === "Interviewing"
                ? "bg-yellow-50 text-yellow-600"
                : ""
            }
            ${job.status === "Offer" ? "bg-green-50 text-green-600" : ""}
            ${job.status === "Rejected" ? "bg-red-50 text-red-600" : ""}`}
          >
            {job.status}
          </span>
          <p className="text-xs text-muted mt-1">
            {new Date(job.date_applied || Date.now()).toLocaleDateString()}
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit(job)}
            className="px-3 py-1 rounded-md bg-white border border-slate-200 text-sm hover:bg-slate-50"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(job.id)}
            className="px-3 py-1 rounded-md bg-green-700 text-white text-sm hover:bg-green-300 hover:text-black"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

import {v4 as uuidv4 } from "uuid";
import { readJSON, writeJSON } from "./reusableFunc.js";
import rawJobs from "../Data/myJobs.json" with {type: 'json'};

// all jobs routes
let {jobs} = rawJobs;
// console.log(jobs)

// Create (POST) job
export const addNewJob = async (req, res) => {
  const {
    id,
    company,
    title,
    location,
    status = "Applied",
    date_applied = new Date().toISOString(),
    link,
    notes = "",
  } = req.body;
  if (!company || !title || !location)
    return res.status(400).json({ message: "company, title and location are required" });
  const jobs = await readJSON("jobs.json");
  const job = {
    id: uuidv4(),
    title,
    company,
    location,
    status,
    date_applied,
    link,
    notes,
  };
  jobs.push(job);
  await writeJSON("jobs.json", jobs);
  return res.status(201).json(job);
};

//Read (GET) job
// Get all jobs
export const getAllJobs = async (req, res) => {
  // only return jobs belonging to the authenticated user
  let myJobs = jobs.filter((j) => j.userId === req.user.id);
  return res.json(myJobs);
};

// Filter jobs data
export const filteredData = async (req, res) => {


  // allJobs not defines=d
  let filteredData = jobs;
  console.log("Query: ", req.query);
  const { title, company, location, status } = req.query;
  console.log("Filtering data");

  // filter with query param
  if (title) {
    filteredData = filteredData.filter(
      (job) => job.title.toLowerCase() === title.toLowerCase()
    );
  }

  if (company) {
    filteredData = filteredData.filter(
      (job) => job.company.toLowerCase() === company.toLowerCase()
    );
  }
  if (location) {
    filteredData = filteredData.filter(
      (job) => job.location.toLowerCase() === location.toLowerCase()
    );
  }
  if (status) {
    filteredData = filteredData.filter(
      (job) => job.status.toLowerCase() === status.toLowerCase()
    );
  }
  res.json(filteredData);
};

//Update job data
export const updateJobData = async (req, res) => {
  try {
    const jobId = req.params.id;
    if (!jobId) return res.status(400).json({ message: "Missing id in params" });

    // ensure req.body is an object
    const body = req.body || {};

    const jobs = await readJSON("jobs.json");
    const index = jobs.findIndex(j => String(j?.id) === String(jobId));
    if (index === -1) {
      const availableIds = jobs.slice(0,10).map(j => ({ id: j.id, title: j.title }));
      return res.status(404).json({ message: "Job not found", availableIds });
    }

    // Apply allowed updates safely using `body`
    const allowed = ["company","title","location","status","date_applied","link","notes"];
    let updated = { ...jobs[index] };
    let applied = false;
    for (const key of allowed) {
      // safe check: don't call hasOwnProperty on undefined
      if (Object.prototype.hasOwnProperty.call(body, key)) {
        updated[key] = body[key];
        applied = true;
      }
    }
    if (!applied) {
      return res.status(400).json({ message: "No valid fields to update" });
    }

    jobs[index] = updated;
    await writeJSON("jobs.json", jobs);
    return res.json(updated);

  } catch (err) {
    console.error("updateJobById error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};


// Delete job
export const deleteJob = async(req, res) => {
  try {
    // require id in route param or accept from body as fallback
    const jobId = req.params.id || req.body?.id;
    if (!jobId) return res.status(400).json({ message: "Missing id in params or body" });

    // read file inside handler (no top-level 'jobs' variable)
    const jobs = await readJSON("jobs.json"); // <- pass filename string
    if (!Array.isArray(jobs)) {
      return res.status(500).json({ message: "Jobs data is corrupted" });
    }

    const index = jobs.findIndex(j => String(j?.id) === String(jobId));
    if (index === -1) {
      const availableIds = jobs.slice(0,10).map(j => ({ id: j.id, title: j.title }));
      return res.status(404).json({
        message: "Job not found",
        hint: "Use one of the available IDs to test the DELETE",
        availableIds
      });
    }

    // Optional ownership check (uncomment if you use req.user)
    // if (jobs[index].userId && String(jobs[index].userId) !== String(req.user?.id)) {
    //   return res.status(403).json({ message: "Forbidden: not your job" });
    // }

    // remove job and save
    const [deleted] = jobs.splice(index, 1);
    await writeJSON("jobs.json", jobs);

    return res.json({ message: "Job deleted", deleted });
  } catch (err) {
    console.error("deleteJobById error:", err);
    return res.status(500).json({ message: err.message || "Internal Server Error" });
  }
};

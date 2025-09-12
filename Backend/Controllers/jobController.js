// all jobs routes

let jobs = [];

// Create (POST) job
export const createNewJob = (req, res) => {
  const job = req.body;
  jobs.push(job);
  res.status(201).json(job);
};

//Read (GET) job
// Get all jobs
export const getAllJobs = (req, res) => {
  res.json(jobs);
};

// Filter jobs data
export const filteredData = (req, res) => {
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
export const updateJobData = (req, res) => {
  const id = req.params.id;
  users[id] = req.body;
  res.json(jobs[id]);
};
// Delete job
export const deleteJob = (req, res) => {
  const id = req.params.id;
  jobs.splice(id, 1);
  res.send(`Job ${id} deleted`);
};

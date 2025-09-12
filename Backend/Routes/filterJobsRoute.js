app.get("/myJobs", (req, res) => {
  const { status, sortBy = "date", order = "desc" } = req.query;
});

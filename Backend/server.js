import express from "express";
import cors from "cors";
import jobsRoutes from "./Routes/jobsRoutes.js";
import usersRoutes from "./Routes/usersRoutes.js";

const app = express();
app.use("/jobs", jobsRoutes);
app.use("/users", usersRoutes);

// ???????????????????? Is this the right place for the code???
// Middleware
app.use(cors()); //allows requests from the frontend
app.use(express.json()); // parse JSON request bodies

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

app.listen(8000, console.log("server connected on port 8000"));

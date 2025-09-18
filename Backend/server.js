import express from "express";
import cors from "cors";
import jobsRoutes from "./Routes/jobsRoutes.js";
import usersRoutes from "./Routes/usersRoutes.js";

// Middleware
const app = express();
app.use(express.json()); // parse JSON request bodies
app.use(cors()); //allows requests from the frontend

app.use("/jobs", jobsRoutes);
app.use("/users", usersRoutes);

app.get("/", (req, res) => res.send("Job Tracker API"));

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error(err);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server Error" });
});

app.listen(8000, console.log("server connected on port 8000"));

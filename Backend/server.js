import express from "express";
import jobsRoutes from "./Routes/jobsRoutes.js";
import usersRoutes from "./Routes/usersRoutes.js";

const app = express();
app.use("/jobs", jobsRoutes);
app.use("/users", usersRoutes);

app.listen(8000, console.log("server connected on port 8000"));

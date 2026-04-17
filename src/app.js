import cors from "cors";
import express from "express";
import healthRoutes from "./routes/health.routes.js";
import testRoutes from "./routes/test.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// routes
app.use(healthRoutes);
app.use(testRoutes);

export default app;

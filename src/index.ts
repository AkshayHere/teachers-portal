import express, { Request, Response } from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./swagger";
import teacherRoutes from "./routes/teacherRoutes";
import path from "path";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Default Route
app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use("/api", teacherRoutes);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;

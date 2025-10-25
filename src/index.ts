import express, { Request, Response } from 'express';
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";

dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 3000;

// Default Route
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Teacher Portal.');
});

app.use("/api", userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
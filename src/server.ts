import express from "express";
import dotenv from "dotenv";
import { corsMiddleware } from "./middlewares/cors";
import { errorHandler } from "./middlewares/errorHandler";
import { notFound } from "./middlewares/notFound";
import testRoutes from "./routes/test";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

app.use("/api/test", testRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(🚀 Serveur démarré sur http://localhost:);
});

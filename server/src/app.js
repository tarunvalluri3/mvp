import express from "express";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import vendorRoutes from "./routes/vendor.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import categoryRoutes from "./routes/category.routes.js"; 
import serviceRoutes from "./routes/service.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "SME Marketplace API Running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/admin", adminRoutes); 
app.use("/api/categories", categoryRoutes); 
app.use("/api/services", serviceRoutes);

export default app;

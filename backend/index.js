import serverConfig from "./serverConfig.js";
import express from "express";
import path from "path";
import dbConnect from "./db.js";
import protectRouter from "./routes/protected/protectedRouter.js";
import publicRouter from "./routes/public/publicRouter.js";
import createSuperAdmin from "./utils/superAdminRouter.js";
import { authMiddleware } from "./utils/jwtTokens.js";

const app = express();
const port = serverConfig.port;
const dir = path.resolve();

app.use(express.json());

//static path
app.use(express.static(path.join(dir, serverConfig.frontendpath)));

//api
app.use("/api/public", publicRouter);
app.use("/api/protected", authMiddleware, protectRouter);

//not found handller
app.all("*", (req, res) => {
  res.status(404).json({ message: "path not found" });
});

try {
  await dbConnect();
  app.listen(port, () => {
    console.log(`started listing at http://localhost:${port}`);
    createSuperAdmin();
  });
} catch (error) {
  console.log("server init error", error);
}

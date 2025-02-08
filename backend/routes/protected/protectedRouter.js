import { Router } from "express";
import adminUserRouter from "./admin/adminUserRouter.js";
import adminBookRouter from "./admin/adminBookRouter.js";
import userBookRouter from "./users/userBookRouter.js";
import { isSuperAdminMiddleware } from "../../utils/jwtTokens.js";

const protectRouter = Router();

protectRouter.use("/admin", isSuperAdminMiddleware, adminUserRouter);
protectRouter.use("/books", isSuperAdminMiddleware, adminBookRouter);
protectRouter.use("/userbook", userBookRouter);
export default protectRouter;

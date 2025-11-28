import express from "express";
import isAuthenticated from "../middleware/isAuthenticated.js";
import { chnageStatus, sent } from "../controller/request.controller.js";

const router = express.Router();

router.route("/sent").post(isAuthenticated, sent);
router.route("/status-update").put(isAuthenticated, chnageStatus)

export default router;

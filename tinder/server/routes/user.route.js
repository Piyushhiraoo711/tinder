import express from 'express';
import isAuthenticated from "../middleware/isAuthenticated.js";
import { blockConnection, login, logout, myConnections, register } from '../controller/user.controller.js';

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/my-connections").get(isAuthenticated, myConnections);
router.route("/block/:id").post(isAuthenticated, blockConnection);

export default router;
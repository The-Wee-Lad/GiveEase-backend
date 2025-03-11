import express from "express";
import {refreshAccessToken,
    loginUser,
    registerUser,
    logoutUser,
    getCurrentUser
} from "../src/controllers/user.controller.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);
router.route("/refreshAccessToken").get(refreshAccessToken);

router.use(verifyJwt);
router.route("/logout").post(logoutUser);
router.route("/getCurrentUser").get(getCurrentUser);


export default router;
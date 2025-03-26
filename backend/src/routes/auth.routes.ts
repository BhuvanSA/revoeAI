import { Router } from "express";
import {
    login,
    register,
    checkAuth,
    logout,
} from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/checkAuth", checkAuth);
router.get("/logout", logout);

export default router;

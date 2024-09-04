import { Router } from "express";

import {
    cratePostagem
} from "../controllers/PostagensControllers.js"

const router = Router()

router.post("/", cratePostagem)

export default router;
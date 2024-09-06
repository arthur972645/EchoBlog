import { Router } from "express";

import {
    cratePostagem,
    showall,
    getbyid
} from "../controllers/PostagensControllers.js"

const router = Router()

router.post("/", cratePostagem)
router.get("/", showall)
router.get("/:id", getbyid)

export default router;
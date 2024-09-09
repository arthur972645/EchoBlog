import { Router } from "express";
import bodyParser from 'body-parser';

import {
    createUsuarios,
    loginUsuarios
} from "../controllers/UsuariosControllers.js"

const router = Router()

router.post("/create", createUsuarios)
router.get("/login", loginUsuarios)

export default router;
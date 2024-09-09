import { Router } from "express";
import bodyParser from 'body-parser';

import {
    createUsuarios
} from "../controllers/UsuariosControllers.js"

const router = Router()

router.post("/create", createUsuarios)

export default router;
import { Router } from "express";
import bodyParser from 'body-parser';

import {
    createUsuarios,
    loginUsuarios,
    updateUsuarios
} from "../controllers/UsuariosControllers.js"

import imageUpload from "../helpers/image-uploud.js";

const router = Router()

router.post("/create",imageUpload.single("imagem"), createUsuarios)
router.get("/login", loginUsuarios)
router.put("/atualizar/:id", updateUsuarios)

export default router;
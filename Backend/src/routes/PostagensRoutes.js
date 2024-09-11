import { Router } from "express";
import bodyParser from 'body-parser';

import {
    cratePostagem,
    showall,
    getbyid,
    atualizarinformacoes,
    deleteinformacoes,
} from "../controllers/PostagensControllers.js"

import imageUpload from "../helpers/image-uploud.js";

const router = Router()

router.post("/",imageUpload.single("imagem"), cratePostagem)
router.get("/", showall)
router.get("/:id", getbyid)
router.delete("/:id", deleteinformacoes)
router.put("/:id", atualizarinformacoes)


export default router;
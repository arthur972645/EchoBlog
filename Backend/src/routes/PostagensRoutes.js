import { Router } from "express";
import bodyParser from 'body-parser';

import {
    cratePostagem,
    showall,
    getbyid,
    atualizarinformacoes,
    deleteinformacoes,
    imagesend
} from "../controllers/PostagensControllers.js"

const router = Router()

router.post("/", cratePostagem)
router.get("/", showall)
router.get("/:id", getbyid)
router.delete("/:id", deleteinformacoes)
router.put("/:id", atualizarinformacoes)
router.post("/:id/imagem",  bodyParser.raw({type: ["image/jpeg", "image/png"], limit: "5mb"}),imagesend)

export default router;
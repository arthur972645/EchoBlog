import { response } from "express";
import jwt from "jsonwebtoken";
import Usuarios from "../models/UsuariosModels.js";

const getUsuarioByToken = async (token) => {

    return new Promise(async (resolve, reject) => {
        if(!token){
            return response.status(401).json({err: "Acesso negado"})
        }

        const decoled = jwt.verify(token, process.env.TOKEN_PASSAWORD)
        const usuario = await Usuarios.findByPk(decoled.id)

        if(!usuario){
            reject({err: "Erro ao buscar usuarios"})
        } else{
            resolve(usuario)
        }
    })
}

export default getUsuarioByToken
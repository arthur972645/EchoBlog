import Usuarios from "../models/UsuariosModels.js";
import { z } from "zod"
import formatZodError from "../helpers/formatZoderror.js";
import bcrypt from "bcrypt"
import { request, response } from "express";

//Validação Zod
const crateUsuariosSchema = z.object({
    nome: z
        .string()
        .min(3,{message: "O nome deve ter pelo menos 3 caracteres"})
        .transform((txt) => txt.toLowerCase()),
    email: z
        .string()
        .email("Formato do email invalido"),
    senha: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    papel: z
        .enum(["leitor", "administrador", "autor"]),
          
})


export const createUsuarios = async(request, response) => {
    //validaçõa
    const bodyValidation = crateUsuariosSchema.safeParse(request.body)

    if(!bodyValidation.success){
        response.status(400).json({
            message: "Os dados recebidor do corpo da aplicação são invalidos",
            detalhes: formatZodError(bodyValidation.error)
        })
        return
    }
    const { nome, email, senha, papel } = request.body
    
    const saltRounds = 10;
    const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

    const novoUusuario = {
        nome, email, senha: senhaCriptografada, papel
    }
    try{
        await Usuarios.create(novoUusuario)
        response.status(201).json({message: "usuario criado com sucesso"})
    }catch(error){
        console.error(error)
        response.status(500).json({message: "Erro ao cadastrar usuario na aplição"})
    }
}
import Postagens from "../models/PostagensModels.js"
import { z } from "zod"
import formatZodError from "../helpers/formatZoderror.js"
import { request, response } from "express"

//Validações com o zod
const cratePostagemSchema = z.object({
    titulo: z
        .string()
        .min(3,{message: "O titulo deve ter pelo menos 3 caracteres"})
        .transform((txt) => txt.toLowerCase()),
    conteudo: z
        .string()
        .min(10, {message: "O conteudo deve ter pelo menos 10 caracters"}),
    autor: z
        .string()
        .min(1,{message: "O nome do autor precisa ter no meino 1 caracter"}),
})


export const cratePostagem = async(request, response) => {
    //Validação:
    const bodyValidation = cratePostagemSchema.safeParse(request.body)
    
    if(!bodyValidation.success){
        response.status(400).json({
            message: "Os dados recebidos do corpo da aplicação são invalidos",
            detalhes: bodyValidation.error,
        })
        return
    }
    const { titulo, conteudo, autor, imagem } = request.body

    const novaPostagem = {
        titulo, conteudo, autor, imagem
    }
    try{
        await Postagens.create(novaPostagem)
        response.status(201).json({message: "Postagem feita com sucesso"})
    }catch(error){
        console.error(error)
        response.status(500).json({message: "erro ao postar sua postagem"})
    }
}
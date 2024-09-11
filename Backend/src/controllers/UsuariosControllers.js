import Usuarios from "../models/UsuariosModels.js";
import { z } from "zod"
import formatZodError from "../helpers/formatZoderror.js";
import gerarToken from "../helpers/createToken.js"
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

const loginUsuariosSchema = z.object({
    email: z
        .string()
        .email("Formato do email invalido"),
    senha: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
          
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
    
    try {
     
        const emailExistente = await Usuarios.findOne({ where: { email } });
        if (emailExistente) {
     
          response.status(409).json({ message: "E-mail já cadastrado" });
          return;
        }
    
        // Criptografa a senha
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
    
        // Dados do novo usuário
        const novoUsuario = {
          nome,
          email,
          senha: senhaCriptografada,
          papel,
        };
    
        // Cria o novo usuário
        await Usuarios.create(novoUsuario);
        response.status(201).json({ message: "Usuário criado com sucesso" });
      } catch (error) {
        console.error(error);
        response.status(500).json({ message: "Erro ao cadastrar usuário na aplicação" });
      }
}
export const loginUsuarios = async (request, response) => {
    // Validação
    const bodyValidation = loginUsuariosSchema.safeParse(request.body);
    if (!bodyValidation.success) {
        response.status(400).json({
            message: "Os dados recebidos do corpo da aplicação são inválidos",
            detalhes: formatZodError(bodyValidation.error),
        });
        return;
    }

    const { email, senha } = request.body;
    if(!email){
        return response.status(401).json({message: "O email é obirgatorio"})
    }
    if(!senha){
        return response.status(401).json({message: "A senha é obrigatoria"})
    }

    const usuario = await Usuarios.findOne({ where: { email } });

    if (!usuario) {
        return response.status(404).json({ message: "Usuário não encontrado" });
    }
    const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
    if(!senhaCorreta){
        return response.status(401).json({ message: "senha inválida" });
    }
    try {
        await gerarToken(usuario, request, response);
      } catch (error) {
        console.error(error);
        response.status(500).json({ error: "erro ao processar informação" });
      }
    
};



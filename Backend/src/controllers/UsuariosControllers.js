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
        .min(8, {message: "A senha deve ter pelo menos 8 caracteres"})
        .regex(/[a-zA-Z]/,{message: "A senha deve ter pelo menos 1 numero"})
        .regex(/[0-9]/, {message: "A senha deve ter pelo menos 1 letra"}),
    // papel: z
    //     .enum(["leitor", "administrador", "autor"]),
          
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

const updateUsuariosSchema = z.object({
    nome: z
        .string()
        .min(3,{message: "O nome deve ter pelo menos 3 caracteres"})
        .transform((txt) => txt.toLowerCase()),
    senha: z
        .string()
        .min(8, "A senha deve ter pelo menos 8 caracteres")
        .regex(/[a-zA-Z]/, "A senha deve conter pelo menos uma letra")
        .regex(/[0-9]/, "A senha deve conter pelo menos um número"),
    email: z
        .string()
        .email("Formato do email invalido"),
})



export const createUsuarios = async(request, response) => {
    //validaçõa
    const createValidation = crateUsuariosSchema.safeParse(request.body)

    if(!createValidation.success){
        response
          .status(400)
          .json({
            error:formatZodError(createValidation.error)
          })
        return
    }
    const { nome, email, senha, papel } = request.body
    
        // Criptografa a senha
        const salt = bcrypt.genSaltSync(12);
        const senhaCriptografada = await bcrypt.hashSync(senha, salt);
    
        let imagem
        if(request.file){
          imagem = request.file.filename
        }else{
          imagem = "postagemDefault.png"
        }

        // Dados do novo usuário
        const novoUsuario = {
          nome,
          email,
          senha: senhaCriptografada,
          papel,
          imagem
        };
      try {
        const verificaEmail= await Usuarios.findOne({ where: { email } });
        if (verificaEmail) {
          response.status(404).json({ message: "E-mail já cadastrado" });
          return;
        }
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
export const updateUsuarios = async (request, response) => {

    const id = request.params.id 
    const bodyValidation = updateUsuariosSchema.safeParse(request.body)
     
    if(!bodyValidation.success){
      response.status(400).json({msg: "Os dados recebidos do corpo são invalidos", detalhes: bodyValidation.error})
      return
    }
  
    const { nome, email , senha} = request.body;
 
  
    if (!nome) {
      response.status(400).json({ err: "A tarefa é obirgatoria" });
      return;
    }
    if (!email) {
      response.status(400).json({ err: "A descricao é obirgatoria" });
      return;
    }
    if (!senha ) {
      response.status(400).json({ err: "A descricao é obirgatoria" });
      return;
    }
 

    try {

        const emailExistente = await Usuarios.findOne({ where: { email } });
        if (emailExistente) {
     
          response.status(409).json({ message: "E-mail já cadastrado" });
          return;
        }

        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);

        const usuarioAtualizado = {
            nome,
            email,
            senha: senhaCriptografada
          };
    

          
      await Usuarios.update(usuarioAtualizado , { where:{id} });
      response.status(201).json({ msg: "usuario Atualizado" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ Err: "Erro ao Atualizado do usuario   " });
    }
};



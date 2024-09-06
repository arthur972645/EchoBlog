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

export const showall = async (request, response) => {

    const page = parseInt(request.query.page) || 1;
    const limit = parseInt(request.query.limit) || 10;
    const offset = (page - 1) * 10;
    try {
      const postagens = await Posts.findAndCountAll({
        limit,
        offset,
      });
      const totalPaginas = Math.ceil(postagens.count / limit);
      response.status(200).json({
        totalTarefas: postagens.count,
        totalPaginas,
        paginaAtual: page,
        itemsPorPagina: limit,
        proximaPagina:
          totalPaginas === 0
            ? null
            : `http://localhost:3333/tarefas?page=${page + 1}`,
        postagens: postagens.rows,
      });
    } catch (error) {
      response.status(500).json({ msg: "Erro ao buscar tarefas" });
    }
  };
  export const getbyid = async (request, response) => {

    const id = request.params.id 
    console.log(id)
     try {
       const postagens = await Posts.findOne({
         where: {id},
         raw:true,
       });
 
       if(postagens){
       response.status(200).json({
         postagens: postagens.rows,
       });
     }
     else
       response.status(404).json({ msg: "Não existe esse post" });
   
     } catch (error) {
       response.status(500).json({ msg: "Erro ao buscar postagens" });
     }
   };

   export const deleteinformacoes = async (request, response) => {

    const id = request.params.id 
    console.log(id)
     try {
       const postagens = await Posts.destroy({
         where: {id}
       });
 
       response.status(500).json({ msg: "Posts deletado" });
   
     } catch (error) {
       response.status(500).json({ msg: "Erro ao buscar postagens" });
     }
   };
 export const atualizarinformacoes = async (request, response) => {
 
    const id = request.params.id 
    const bodyValidation = createSchema.safeParse(request.body)
     
    if(!bodyValidation.success){
      response.status(400).json({msg: "Os dados recebidos do corpo são invalidos", detalhes: bodyValidation.error})
      return
    }
  
    const { titulo, conteudo,autor,imagem } = request.body;
 
  
    if (!titulo) {
      response.status(400).json({ err: "A tarefa é obirgatoria" });
      return;
    }
    if (!conteudo) {
      response.status(400).json({ err: "A descricao é obirgatoria" });
      return;
    }
    if (!autor) {
      response.status(400).json({ err: "A descricao é obirgatoria" });
      return;
    }
 
 
 
  
    const novopost = {
      titulo,
      conteudo,
      autor,
      imagem,
    };
    try {
      await Posts.update(novopost , { where:{id} });
      response.status(201).json({ msg: "Posts Atualizado" });
    } catch (error) {
      console.error(error);
      response.status(500).json({ Err: "Erro ao Atualizado os posts" });
    }
   };
 
   export const imagesend = async (request, response) => {
 
     const id = request.params.id 
     console.log(id)
     try {
 
       fs.writeFile(`imagem/perfil/${id}.png`, request.body, (error) => {
         if (error) {
           throw error;
         }
       });
       await Posts.update({imagem_url: `imagem/perfil/${id}.png`} , { where:{id} });
       response.status(201).json({ msg: "Posts Atualizado" });
     } catch (error) {
       console.error(error);
       response.status(500).json({ Err: "Erro ao Atualizado os posts" });
     }
    };
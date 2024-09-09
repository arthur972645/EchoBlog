
import jwt from "jsonwebtoken";

//função assincrona para a criação do token
const createUserToken = async (usuario, request, response) => {
  //criar token do usuario, onde no token vai ter o nome e o id do usuario
  //o jwt.sing cria o token
  const token = jwt.sign({
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        senha: usuario.senha,
        papel: usuario.papel
    },
    //Chave que vai autentificar o token
    "arthur972645" //senha
  );
  //Retornar o token
    response.status(200).json({
        message: "Você está logado!",
        token: token,
        usuarioId: usuario.id,
      });
 
 
};

export default createUserToken
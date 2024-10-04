
import jwt from "jsonwebtoken";

//função assincrona para a criação do token
const createUserToken = async (usuario, request, response) => {
  //criar token do usuario, onde no token vai ter o nome e o id do usuario
  //o jwt.sing cria o token

  const token = jwt.sign(
    {
      nome: usuario.nome,
      id: usuario.id
    },
    process.env.TOKEN_PASSAWORD,
    {
      expiresIn: "12h",
    }
  )
  response.status(200).json({
    message: "voce esta logado",
    token: token,
    usuarioId: usuario.id
  })
}

export default createUserToken
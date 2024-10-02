import "dotenv/config"
import express from "express"
import cors from "cors"
import path from "node:path"
import {fileURLToPath} from "node:url"

//importar conexão do banco
import conn from "./config/conn.js"

//Importar os modelos do banco de dados
import Postagens from "./models/PostagensModels.js"
import Usuarios from "./models/UsuariosModels.js"

//*IMPORTAÇÃO DAS ROTAS
import PostagemRoutes from "./routes/PostagensRoutes.js"
import UsuariosRoutes from "./routes/UsuariosRoutes.js"


const PORT = process.env.PORT || 3333
const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
console.log(__filename)
console.log(__dirname)

//3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(path.join(__dirname,"public")))

//Conexão com o banco
conn
.sync(/*{force: true}*/)
.then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor on PORT: ${PORT}`)
    })
})
.catch((error) => console.error(error))

//utilizar rotas
app.use("/postagens", PostagemRoutes)
app.use("/usuarios", UsuariosRoutes)

app.use((request, response) => {
    response.status(404).json({ message: "Rota não encontrada" });
  });
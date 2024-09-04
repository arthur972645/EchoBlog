import "dotenv/config"
import express from "express"
import cors from "cors"

//importar conexão do banco
import conn from "./config/conn.js"

//Importar os modelos do banco de dados
import Postagens from "./models/PostagensModels.js"

//*IMPORTAÇÃO DAS ROTAS
import PostagemRoutes from "./routes/PostagensRoutes.js"


const PORT = process.env.PORT || 3333
const app = express()

//3 middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Conexão com o banco
conn
.sync()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Servidor on PORT: ${PORT}`)
    })
})
.catch((error) => console.error(error))

//utilizar rotas
app.use("/postagens", PostagemRoutes)

app.use((request, response) => {
    response.status(404).json({ message: "Rota não encontrada" });
  });
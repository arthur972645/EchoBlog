import conn from "../config/conn.js"
import { DataTypes } from "sequelize"

import Usuarios from "./UsuariosModels.js";

const Postagens = conn.define(
    "postagens",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,   
          },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
        },
        conteudo: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
        },
       dataPublicacao: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
       },
        imagem: {
            type: DataTypes.STRING,
            allowNull: true,
            required: false
          },
    },
    {
        tableName: "postagens",
    }
);
//1 usuario para muitas postagens 1:N
//1 postagem para varios usuarios N:1
//Fazer o relacionamento na tabela que é para muitos, muitas postagens para um usuario

Usuarios.hasMany(Postagens, { foreignKey: "usuarioId" });
Postagens.belongsTo(Usuarios, { foreignKey: "usuarioId" });

export default Postagens
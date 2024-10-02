import conn from "../config/conn.js";
import { DataTypes } from "sequelize";

const Usuarios = conn.define(
    "usuarios",
    {
        usuario_id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },
        nome: {
            type: DataTypes.STRING,
            allowNull: false,   
            required: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true
            }
        },
        senha: {
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
        },
        imagem: {
            type: DataTypes.STRING,
            allowNull: true,
            required: false
          },
        // Tipo de usuário (administrador, autor, leitor)
        papel: {
            type: DataTypes.ENUM('leitor', 'administrador', 'autor'),
            allowNull: true,
        },
    },
    {
        tableName: "usuarios",
    }
);

export default Usuarios
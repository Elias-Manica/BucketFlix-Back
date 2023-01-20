import { createUserParams } from "../services/user.services";
import Joi from "joi";

export const createUserSchema = Joi.object<createUserParams>({
  email: Joi.string().email().required().empty("").messages({
    "string.empty": "O email não pode ser vazio",
    "string.base": "O email deve ser um texto",
    "any.required": "Passar o email é obrigatório",
    "string.email": "O email deve ser válido",
  }),
  username: Joi.string()
    .required()
    .empty("")
    .regex(/[a-zA-Z0-9]/)
    .messages({
      "string.empty": "O username não pode ser vazio",
      "string.base": "O username deve ser um texto",
      "any.required": "Passar o username é obrigatório",
      "object.regex": "Esse username não deve ser utilizado",
      "string.pattern.base": "O username deve ter pelo menos uma letra",
    }),
  pictureUrl: Joi.string().required().empty("").messages({
    "string.empty": "O pictureUrl não pode ser vazio",
    "string.base": "O pictureUrl deve ser um texto",
    "any.required": "Passar o pictureUrl é obrigatório",
    "string.pattern.base": "O pictureUrl deve ter pelo menos uma letra",
  }),
});

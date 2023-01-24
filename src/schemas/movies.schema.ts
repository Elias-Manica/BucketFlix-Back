import Joi from "joi";
import { movies } from "@prisma/client";

export const addMovieSchema = Joi.object<moviesTypeId>({
  movieid: Joi.number().required().messages({
    "number.empty": "O movieid não pode ser vazio",
    "number.base": "O movieid deve ser um número",
    "any.required": "Passar o movieid é obrigatório",
  }),
  apiKey: Joi.string().required().messages({
    "string.empty": "A apiKey não pode ser vaziA",
    "string.base": "A apiKey deve ser uma string",
    "any.required": "Passar a apiKey é obrigatório",
  }),
});

export const addCommentSchema = Joi.object({
  movieid: Joi.number().required().messages({
    "number.empty": "O movieid não pode ser vazio",
    "number.base": "O movieid deve ser um número",
    "any.required": "Passar o movieid é obrigatório",
  }),
  comment: Joi.string().required().max(240).messages({
    "string.empty": "O comment não pode ser vazio",
    "string.base": "O comment deve ser uma string",
    "any.required": "Passar o comment é obrigatório",
    "string.max": "O comentário deve ter no máximo 240 caracteres",
  }),
  rating: Joi.number().required().max(5).min(0).integer().messages({
    "number.empty": "O rating não pode ser vazio",
    "number.base": "O rating deve ser um número",
    "any.required": "Passar o rating é obrigatório",
    "number.max": "O rating deve ser um valor entre 0 e 5",
    "number.min": "O rating deve ser um valor entre 0 e 5",
  }),
  apiKey: Joi.string().required().messages({
    "string.empty": "A apiKey não pode ser vaziA",
    "string.base": "A apiKey deve ser uma string",
    "any.required": "Passar a apiKey é obrigatório",
  }),
});

export type moviesTypeId = {
  movieid: string;
  apiKey: string;
};

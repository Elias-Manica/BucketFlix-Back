import Joi from "joi";
import { movies } from "@prisma/client";

export const addMovieSchema = Joi.object<moviesTypeId>({
  movieid: Joi.number().required().messages({
    "number.empty": "O movieid não pode ser vazio",
    "number.base": "O movieid deve ser um número",
    "any.required": "Passar o movieid é obrigatório",
  }),
  apiKey: Joi.string().required().messages({
    "number.empty": "A apiKey não pode ser vaziA",
    "number.base": "A apiKey deve ser uma string",
    "any.required": "Passar a apiKey é obrigatório",
  }),
});

export type moviesTypeId = {
  movieid: string;
  apiKey: string;
};

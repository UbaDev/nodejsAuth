import { Router } from 'express';
import { body, check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import { UserModel } from '../models/User.js';

export const signUp = Router();

signUp.post(
  '/',
  // Validación y sanitización de los datos de entrada
  body('username').not().isEmpty().trim(),
  check('username').custom(async (username) => {
    const maybeUser = await UserModel.findOne({ username });
    if (maybeUser) {
      throw new Error('El nombre de usuario ya existe');
    }

    return true;
  }),
  body('password').isLength({ min: 6 }),

  //
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const { username, password } = request.body;

      const saltRounds = 10; // Número de rondas de sal para la encriptación
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      const user = await UserModel.create({
        username,
        password: hashedPassword,
      });

      return response
        .status(201)
        .json({ username: user.username, createdAt: user.createdAt });
    } catch (error) {
      console.error(`[signIn]: ${error}`);

      return response.status(500).json({
        error: 'Ocurrió un error inesperado. Por favor, inténtelo más tarde',
      });
    }
  }
);

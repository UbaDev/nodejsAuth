import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import { UserModel } from '../models/User.js';

export const login = Router();

login.post(
  '/',
  // Validación  de los datos de entrada
  body('username').not().isEmpty().trim(),
  body('password').isLength({ min: 6 }),

  //
  async (request, response) => {
    try {
      const errors = validationResult(request);
      if (!errors.isEmpty()) {
        return response.status(400).json({ errors: errors.array() });
      }

      const { username, password } = request.body;

      const user = await UserModel.findOne({ username });

      if (!user) {
        return response.status(400).json({
          error: 'Usuario o contraseña incorrectos',
        });
      }

      const isPasswordValid = password === user.password;
      if (!isPasswordValid) {
        return response.status(400).json({
          error: 'Usuario o contraseña incorrectos',
        });
      }

      const secretKey =
        '09c13f4965c217779ac6dad35a9d3aa71ace9eddb41bea37242d8ba0fd767590'; // Clave secreta para firmar el token

      const token = jwt.sign({ username: user.username }, secretKey);

      return response.status(201).json({ token, username: user.username });
    } catch (error) {
      console.error(`[signIn]: ${error}`);

      return response.status(500).json({
        error: 'Ocurrió un error inesperado. Por favor, inténtelo más tarde',
      });
    }
  }
);

import Mongoose from 'mongoose';
//Crear el esquema de la base de datos para el usuario.
export const UserSchema = new Mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      lowercase: true,
      required: true,
    },
    password: {
      type: String,
      minlength: 6,
      required: true,
    },
  },

  { timestamps: true }
);

export const UserModel = Mongoose.model('user', UserSchema);

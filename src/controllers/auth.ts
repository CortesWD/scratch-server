/*
 * Dependencies
 */
import express, { RequestHandler } from 'express';
import bcrypt from 'bcrypt';

/*
 * Models
 */
import { User } from '../models/user.js';

/*
 * Others
 */
import catchError from '../utils/catchError.js';

const login: RequestHandler = (req, res, next) => {
  const { email, password } = req.body;
  // const text = (req.body as { text: string }).text;
}

const signUp: RequestHandler = async (req, res, next) => {
  const { password, email }: { email: string, password: string } = req.body;

  try {
    const bcPwd = await bcrypt.hash(password, 16);

    const user = new User({
      email,
      password: bcPwd
    });

    const savedUser = await user.save();

    res.status(201)
      .json({
        message: 'user created',
        userId: savedUser._id
      });

  } catch (error) {
    catchError(error as object, next);
  }

};

const router = express.Router();

router.post('/signup', signUp);
router.post('/access_user', login);

export default router;
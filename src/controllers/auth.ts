import { RequestHandler } from 'express';

export const login: RequestHandler = (req, res, next) => {
  const { email, password } = req.body;
  // const text = (req.body as { text: string }).text;
}
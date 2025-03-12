import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";
import axios from "axios";

require('dotenv').config();  // Charger les variables du fichier .env

// Clé secrète de Google reCAPTCHA
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY;

// Vérifie la validité du CAPTCHA en faisant une requête à Google
const verifyRecaptcha = async (captchaResponse: string) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`;
  const { data } = await axios.post(url);
  return data.success;
};

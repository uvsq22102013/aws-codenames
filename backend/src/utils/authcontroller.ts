import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../prismaClient";
import axios from "axios";

// Clé secrète de Google reCAPTCHA
const RECAPTCHA_SECRET_KEY = "6LeRKfAqAAAAAJY0TRtZ08JyU4O1TDiioDFbtzrk";

// Vérifie la validité du CAPTCHA en faisant une requête à Google
const verifyRecaptcha = async (captchaResponse: string) => {
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET_KEY}&response=${captchaResponse}`;
  const { data } = await axios.post(url);
  return data.success;
};

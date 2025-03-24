import axios from "axios";

const SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY || "6LfH6P0qAAAAAKx_TNib_pmq5znebcXxr35RYk6i"; //clé secrete

const verifyCaptcha = async (token: string) => {
  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: SECRET_KEY,
          response: token,
        },
      }
    );
    return response.data; // il y a 'success' et 'score'
  } catch (error) {
    console.error("Erreur de vérification du CAPTCHA", error);
    return null;
  }
};

export default verifyCaptcha;  
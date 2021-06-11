import jwt from "jwt-simple";
import moment from "moment";

const SECRET_KEY = "afaf7JAL8ak8SAKA16fg2askJAHlasdi";

export const ensureAuth = (req, res, next) => {
  if (!req.headers.authorization) {
    return res
      .status(404)
      .status({ message: "La peticion no tiene cabecera de Autenticacion" });
  }

  const token = req.headers.authorization.replace(/['"]+/g, "");

  try {
    var payload = jwt.decode(token, SECRET_KEY);

    if (payload.exp <= moment.unix()) {
      res.status(404).send({ message: "EL Token ha expirado" });
    }
  } catch (ex) {
    return res.status(404).send({ message: "Token invalido" });
  }

  req.user = payload;

  next();
};

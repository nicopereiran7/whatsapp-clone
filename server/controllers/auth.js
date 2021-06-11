import { decodeToken, createAccessToken } from "../services/jwt.js";
import moment from "moment";
import User from "../models/user.js";

function willExpireToken(token) {
  const { exp } = decodeToken(token);
  const currentDate = moment().unix();

  if (currentDate > exp) {
    return true;
  }
  return false;
}

export const refreshAccessToken = (req, res) => {
  const { refreshToken } = req.body;
  const isTokenExpired = willExpireToken(refreshToken);

  if (isTokenExpired) {
    res.status(404).send({ message: "El token ha expirado" });
  } else {
    const { id } = decodeToken(refreshToken);

    User.findOne({ _id: id }, (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        if (!data) {
          res.status(404).send({ message: "Usuario no encontrado" });
        } else {
          res.status(200).send({
            accessToken: createAccessToken(data),
            refreshToken: refreshToken,
          });
        }
      }
    });
  }
};

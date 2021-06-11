import jwt from "jwt-simple";
import moment from "moment";

const SECRET_KEY = "afaf7JAL8ak8SAKA16fg2askJAHlasdi";

export const createAccessToken = (user) => {
  const payload = {
    //informacion del usuario dentro del token
    id: user._id,
    name: user.name,
    email: user.email,
    createToken: moment().unix(),
    exp: moment().add(3, "hours").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

export const createRefreshToken = (user) => {
  const payload = {
    id: user._id,
    exp: moment().add(30, "days").unix(),
  };

  return jwt.encode(payload, SECRET_KEY);
};

export const decodeToken = (token) => {
  return jwt.decode(token, SECRET_KEY, true);
};

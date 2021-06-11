import express from "express";
import bcrypt from "bcrypt-nodejs";
//models
import User from "../models/user.js";
import Chat from "../models/chat.js";
import Message from "../models/message.js";

import { createAccessToken, createRefreshToken } from "../services/jwt.js";
import { refreshAccessToken } from "../controllers/auth.js";

const router = express.Router();

router.post("/sign-up", (req, res) => {
  const { name, email, password } = req.body;
  const user = new User();
  user.name = name;
  user.email = email;
  bcrypt.hash(password, null, null, (err, hash) => {
    if (err) {
      res.status(500).send(err);
    } else {
      user.password = hash;
      User.create(user, (err, data) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.status(201).send(data);
        }
      });
    }
  });
});
router.post("/sign-in", (req, res) => {
  const { email, password } = req.body;
  User.findOne({ email }, (err, userStored) => {
    if (err) {
      res.status(500).send({ message: "Error en el Servidor" });
    } else {
      if (!userStored) {
        res.status(404).json({ message: "Usuario No encontrado" });
      } else {
        bcrypt.compare(password, userStored.password, (err, check) => {
          if (err) {
            res.status(500).send({ message: "Error en el servidor" });
          } else {
            if (!check) {
              res
                .status(404)
                .send({ message: "Correo o Contraseña incorrecto" });
            } else {
              res.status(200).send({
                accessToken: createAccessToken(userStored),
                refreshToken: createRefreshToken(userStored),
              });
            }
          }
        });
      }
    }
  });
});

router.get("/users", (req, res) => {
  User.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.get("/user/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
// obtener todos los chat de un usuario
router.get("/chat", (req, res) => {
  const { id } = req.body;
  Chat.find({ users: { $all: [id] } }, (err, chats) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(chats);
    }
  });
});

// obtener todos los chats
router.get("/chats", (req, res) => {
  Chat.find({}, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      if (!data) {
        res.status(404).send({ message: "Sin chats" });
      } else {
        res.status(200).send(data);
      }
    }
  });
});
router.get("/chat/:id", (req, res) => {
  Chat.findOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});
router.post("/chat/new", (req, res) => {
  const chat = req.body;
  Chat.create(chat, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
//agregar mensaje a un chat
router.put("/chat/:id", (req, res) => {
  const { message } = req.body;
  Chat.findByIdAndUpdate(
    { _id: req.params.id },
    { $push: { message: message } },
    (err, data) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    }
  );
});

router.post("/message/new", (req, res) => {
  const message = req.body;
  Message.create(message, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(data);
    }
  });
});
//obtener mensaje prr id
router.get("/message/:id", (req, res) => {
  Message.findById(req.params.id, (err, data) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(200).send(data);
    }
  });
});

router.post("/refresh-access-token", refreshAccessToken);

export default router;

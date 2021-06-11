import express from "express";
import mongoose from "mongoose";
import Pusher from "pusher";
import bodyParser from "body-parser";
import cors from "cors";
import routes from "./routes/routes.js";

// CONFIGURACIONES
const app = express();
const PORT = process.env.PORT || 3001;
const CONNECTION_URL =
  "mongodb+srv://admin:1999_nico@cluster0.lcv3m.mongodb.net/whatsapp-clone?retryWrites=true&w=majority";

const pusher = new Pusher({
  appId: "1210739",
  key: "b2b0eb84f1cd39066cac",
  secret: "84e1701e5ff7021a318b",
  cluster: "us2",
  useTLS: true,
});

// MIDDLEWARES
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
// app.use((req, res, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
//   );
//   res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
//   res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
//   next();
// });

// DB CONFIG
mongoose
  .connect(CONNECTION_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Conectada a MongoDB");
  })
  .catch((err) => console.log(err));

const db = mongoose.connection;

db.once("open", () => {
  const msgCollection = db.collection("chats");
  const changeStream = msgCollection.watch();

  changeStream.on("change", (change) => {
    if (change.operationType === "insert") {
      const messageDatails = change.fullDocument;
      pusher.trigger("messages", "inserted", {
        sender: messageDatails.sender,
        receiver: messageDatails.receiver,
        message: messageDatails.message,
        timestamp: messageDatails.timestamp,
      });
    } else {
      console.log("Error en Pusher");
    }
  });
});

// API ROUTES
app.use(routes);

// LISTEN SERVER
app.listen(PORT, () => console.log(`Server en http//localhost:${PORT}`));

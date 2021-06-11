import React, { useState, useEffect } from "react";
import { Avatar, IconButton } from "@material-ui/core";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import AttachFileOutlinedIcon from "@material-ui/icons/AttachFileOutlined";
import MoreVertOutlinedIcon from "@material-ui/icons/MoreVertOutlined";
import InsertEmoticonOutlinedIcon from "@material-ui/icons/InsertEmoticonOutlined";
import MicOutlinedIcon from "@material-ui/icons/MicOutlined";
import axios from "axios";
import { map } from "lodash";
import useAuth from "../hooks/useAuth";
import "./Chat.css";
import { withRouter } from "react-router";

function Chat(props) {
  const { match } = props;
  const { user } = useAuth();
  const [chat, setChat] = useState({});
  const [messages, setMessages] = useState({});
  const [receiverUser, setReceiverUser] = useState({});

  useEffect(() => {
    async function fechData() {
      await axios
        .get(`http://localhost:3001/chat/${match.params?.id}`)
        .then(async (response) => {
          setChat(response.data);
          setMessages(response.data.message);
          await axios
            .get(`http://localhost:3001/user/${response.data.receiver}`)
            .then((response) => {
              setReceiverUser(response.data);
            })
            .catch((err) => {
              console.log(err.response);
            });
        });
    }
    fechData();
  }, [match]);

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__header-left">
          <Avatar src="https://joanna-james.com/wp-content/uploads/2016/09/businessman.png" />
          <div className="info">
            <h2>{receiverUser.name}</h2>
            <p>Ultima conexion...</p>
          </div>
        </div>
        <div className="chat__header-right">
          <IconButton>
            <SearchOutlinedIcon />
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon />
          </IconButton>
          <IconButton>
            <MoreVertOutlinedIcon />
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {map(messages, (message, index) => (
          <p className="message received" key={index}>
            <span className="name">{user.name}</span>
            {message}
            <span className="timestamp">{new Date().toUTCString()}</span>
          </p>
        ))}
      </div>

      <div className="chat__footer">
        <InsertEmoticonOutlinedIcon />
        <form>
          <input type="text" placeholder="Ingrese un mensaje" />
          <button type="submit">Enviar Mensaje</button>
        </form>
        <MicOutlinedIcon />
      </div>
    </div>
  );
}

function ChatItem(props) {
  const { item } = props;
  console.log(item);

  return (
    <div className="chat__body">
      <p className="message">
        <span className="name">Sorry</span>
        This is A message
        <span className="timestamp">{new Date().toUTCString()}</span>
      </p>
      <p className="message received">
        <span className="name">Sorry</span>
        This is A message
        <span className="timestamp">{new Date().toUTCString()}</span>
      </p>
    </div>
  );
}

export default withRouter(Chat);

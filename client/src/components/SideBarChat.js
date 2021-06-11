import React, { useEffect, useState } from "react";
import { Avatar } from "@material-ui/core";
import "./SideBarChat.css";
import { Link } from "react-router-dom";
import { map } from "lodash";
import axios from "../api/axios";

export default function SideBarChat(props) {
  const { user } = props;
  const [chats, setChats] = useState(null);

  // obtener los chats del usuario
  useEffect(() => {
    async function fechData() {
      await axios.get("/chat", { id: user.id }).then((response) => {
        console.log(response);
      });
    }
    fechData();
  }, []);

  if (!chats) {
    return (
      <div>
        <h2>Sin Chats</h2>
      </div>
    );
  }
  return (
    <div className="sidebar-chat">
      {map(chats, (chat, index) => (
        <ChatItem key={index} chat={chat} />
      ))}
    </div>
  );
}

function ChatItem(props) {
  const { chat } = props;
  const [receiver, setReceiver] = useState("");

  useEffect(() => {
    async function fechData() {
      await axios
        .get(`/user/${chat.receiver}`)
        .then((response) => {
          setReceiver(response.data.name);
        })
        .catch((err) => {
          console.log(err.response);
        });
    }
    fechData();
  }, []);

  return (
    <Link to={`/chat/${chat._id}`}>
      <div className="sidebar-chat__info">
        <Avatar src="https://joanna-james.com/wp-content/uploads/2016/09/businessman.png" />
        <div className="item">
          <h2>{receiver}</h2>
          <p>Ultimo mensaje</p>
        </div>
      </div>
    </Link>
  );
}

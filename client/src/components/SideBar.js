import React, { useEffect, useState } from "react";
import ChatIcon from "@material-ui/icons/Chat";
import DonutLargeIcon from "@material-ui/icons/DonutLarge";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SendIcon from "@material-ui/icons/Send";
import {
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  TextField,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import SideBarChat from "./SideBarChat";
import axios from "../api/axios";
import { logout } from "../utils/auth";

import "./SideBar.css";

function SideBar(props) {
  const { user } = props;
  const [open, setOpen] = useState(null);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState(null);

  //obtener usuarios registrados
  useEffect(() => {
    async function fechData() {
      await axios.get("/users").then((response) => {
        setUsers(response.data);
      });
    }
    fechData();
  }, []);

  //obtener todos los chat del usuario

  const handleClick = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };
  //deslogear usuario
  const logoutUser = () => {
    logout();
    setOpen(null);
    window.location.reload();
  };

  const agregarChat = async (option) => {
    const participantes = [user.id, option._id];
    await axios
      .post("/chat/new", {
        users: participantes,
      })
      .then((response) => {
        console.log(response);
      })
      .catch((err) => {
        console.log(err.response);
      });
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <div className="sidebar__header-left">
          <Avatar src="https://www.lavanguardia.com/files/image_948_465/uploads/2019/02/12/5fa51b6323b14.jpeg" />
          <div className="user-info">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
          </div>
        </div>
        <div className="sidebar__header-right">
          <IconButton>
            <DonutLargeIcon />
          </IconButton>
          <IconButton>
            <ChatIcon />
          </IconButton>
          <IconButton onClick={handleClick}>
            <MoreVertIcon />
          </IconButton>
          <Menu
            id="simple-menu"
            className="menu"
            anchorEl={open}
            keepMounted
            open={Boolean(open)}
            onClose={handleClose}
          >
            <MenuItem onClick={() => setOpen(null)}>Profile</MenuItem>
            <MenuItem onClick={() => setOpen(null)}>My account</MenuItem>
            <MenuItem onClick={logoutUser} className="logout">
              Logout
            </MenuItem>
          </Menu>
        </div>
      </div>
      <div className="sidebar__search">
        {/* <SearchIcon /> */}
        <Autocomplete
          options={users}
          autoHighlight
          getOptionLabel={(option) => option.name}
          getOptionDisabled={(option) => option.name === user.name}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Buscar Personas" />
          )}
          renderOption={(option) => (
            <>
              <p>
                {option.name} <span>{` | ${option.email}`}</span>
              </p>
              <IconButton onClick={() => agregarChat(option)}>
                <SendIcon />
              </IconButton>
            </>
          )}
          getOptionSelected={(option, value) => value.name}
          onChange={(e, value) => setSelected(value)}
        />
      </div>
      <div className="sidebar__friends">
        <SideBarChat user={user} />
      </div>
    </div>
  );
}

export default SideBar;

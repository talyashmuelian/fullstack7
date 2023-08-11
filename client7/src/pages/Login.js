import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../css/Login.css";
import { requestsGet } from "../requestsFromServer.js";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";

import avatarImage from "../media/avatar.png";
import inSound from "../media/in.mp3";

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetchData();
  };

  const fetchData = async () => {
    try {
      const response = await requestsGet(
        `/customers/logIn?username=${inputs.username}&password=${inputs.password}`
      );
      let data = await response.json();
      let status = response.status;

      if (status === 200) {
        localStorage.setItem("currentUserID", data.id);
        playSound();
        navigate("/HomeClients");
      } else {
        setModalMessage("Username or password is incorrect");
        setModalVisible(true);
      }
    } catch (error) {
      console.error(error);
      setModalMessage("Username or password is incorrect11");
      setModalVisible(true);
    }
  };

  const closeModal = () => {
    setModalVisible(false);
  };
  const playSound = () => {
    const audio = new Audio(inSound);
    audio.play();
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        {" "}
        <div className="avatar-container">
          <img src={avatarImage} alt="Avatar" className="avatar-image" />
        </div>
        <h1>Login</h1>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={inputs.username || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={inputs.password || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Login</button>
        <div>
          <Link to={`/Signin`}>Sign In</Link>
        </div>
        <div>
          <Link to={`/LoginAdmin`}>Login as Admin</Link>
        </div>
      </form>
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Login;

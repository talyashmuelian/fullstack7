import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import "../css/Login.css";
import { requestsGet } from "../requestsFromServer.js";
import { useNavigate, NavLink } from "react-router-dom";

const LoginAdmin = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function fetchData() {
    try {
      const response = await requestsGet(
        `/admin/logIn?username=${inputs.username}&password=${inputs.password}`
      );
      let data = await response.json();
      let status = response.status;
      console.log("line 158");
      console.log(data);
      if (status === 200) {
        localStorage.setItem("currentUserID", data.id);
        navigate("/HomeAdmin");
      } else {
        alert("Username or password is incorrect");
      }
    } catch (error) {
      console.error(error);
      alert("Username or password is incorrect11");
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("line177");
    console.log(inputs);
    fetchData();
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit}>
        <h1>Login As Admin</h1>
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
          <Link to={`/LoginAdmin`}>Login as Customer</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginAdmin;

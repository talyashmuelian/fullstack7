import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import "../css/Login.css";
import { requestsGet } from "../requestsFromServer.js";
import { useNavigate, NavLink } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState({});

  // useEffect(() => {
  //   const hostname = "http://localhost:3001";
  //   let path = "/customers/signIn";

  //   async function requestsPost(path, object) {
  //     let requestBody;
  //     if (typeof object === "string") {
  //       requestBody = object;
  //     } else {
  //       requestBody = JSON.stringify(object);
  //     }

  //     console.log(requestBody);

  //     const response = await fetch(hostname + path, {
  //       method: "POST",
  //       body: requestBody,
  //       headers: {
  //         "Content-type": "application/json",
  //       },
  //     });

  //     return await response.json();
  //   }
  //   let cus = {
  //     username: "talya2",
  //     //password: 1,
  //   };
  //   requestsPost(path, cus);
  //   console.log("line137");
  // }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function fetchData() {
    try {
      const response = await requestsGet(
        `/customers/logIn?username=${inputs.username}&password=${inputs.password}`
      );
      let data = await response.json();
      let status = response.status;
      console.log("line 158");
      console.log(data);
      if (status === 200) {
        localStorage.setItem("currentUserID", data.id);
        navigate("/HomeClients");
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
    </div>
  );
};

export default Login;

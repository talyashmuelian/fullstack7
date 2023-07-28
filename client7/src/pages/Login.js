import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Assuming you're using React Router for navigation
import "../css/Login.css";

// const Login = () => {
//   const [inputs, setInputs] = useState({});
//   const [loginMode, setLoginMode] = useState("administrator"); // Default to administrator login mode

//   const handleChange = (event) => {
//     const name = event.target.name;
//     const value = event.target.value;
//     setInputs((values) => ({ ...values, [name]: value }));
//   };

//   async function fetchData() {
//     try {
//       // Modify the API call based on the login mode selected
//       const endpoint =
//         loginMode === "administrator" ? "/admin/login" : "/customer/login";
//       const data = await requestsGet(
//         `${endpoint}?username=${inputs.username}&password=${inputs.password}`
//       );

//       console.log(data);
//       let exists = false; // Fixed typo in variable name

//       if (data.length !== 0) {
//         const dataUser = await requestsGet(
//           `/users?username=${inputs.username}`
//         );
//         console.log(dataUser);

//         var json = JSON.stringify(dataUser[0]);
//         localStorage.setItem("currentUser", json);
//         exists = true;
//         window.location.href = "/Users";
//       }

//       if (!exists) {
//         alert("Username or password is incorrect");
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     console.log(inputs);
//     fetchData();
//   };

//   // Function to handle mode switching when buttons are clicked
//   const handleModeSwitch = (mode) => {
//     setLoginMode(mode);
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleSubmit}>
//         <h1>Login</h1>
//         <div className="form-group">
//           <label htmlFor="username">Username:</label>
//           <input
//             type="text"
//             id="username"
//             name="username"
//             value={inputs.username || ""}
//             onChange={handleChange}
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={inputs.password || ""}
//             onChange={handleChange}
//           />
//         </div>
//         <button type="submit">Login</button>
//         <div>
//           <Link to={`/register`}>Sign In</Link>
//         </div>
//         {/* Login mode buttons */}
//         <div>
//           <button
//             type="button"
//             onClick={() => handleModeSwitch("administrator")}
//           >
//             Login as Administrator
//           </button>
//           <button type="button" onClick={() => handleModeSwitch("customer")}>
//             Login as Customer
//           </button>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default Login;

const Login = () => {
  const [inputs, setInputs] = useState({});

  useEffect(() => {
    const hostname = "http://localhost:4000";
    let path = "/signInCustomers";

    async function requestsPost(path, object) {
      let requestBody;
      if (typeof object === "string") {
        requestBody = object;
      } else {
        requestBody = JSON.stringify(object);
      }

      console.log(requestBody);

      const response = await fetch(hostname + path, {
        method: "POST",
        body: requestBody,
        headers: {
          "Content-type": "application/json",
        },
      });

      return await response.json();
    }
    let cus = {
      username: "talya",
      password: 1,
    };
    requestsPost(path, cus);
  }, []);

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function fetchData() {
    // try {
    //   // Your async data fetching logic
    //   // ...
    //   // Example usage: (You should replace this with your actual logic)
    //   const data = await requestsGet(
    //     `/passwords?username=${inputs.username}&password=${inputs.password}`
    //   );
    //   console.log(data);
    //   let exists = false; // Corrected the variable name 'exists'
    //   if (data.length !== 0) {
    //     const dataUser = await requestsGet(
    //       `/users?username=${inputs.username}`
    //     );
    //     console.log(dataUser);
    //     var json = JSON.stringify(dataUser[0]);
    //     localStorage.setItem("currentUser", json);
    //     exists = true;
    //     window.location.href = "/Users";
    //   }
    //   if (exists === false) {
    //     alert("Username or password is incorrect");
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
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
          <Link to={`/register`}>Sign In</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;

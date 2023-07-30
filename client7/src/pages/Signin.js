import { useState } from "react";
//import ReactDOM from "react-dom/client";
import "../css/Signin.css";
import { Link } from "react-router-dom";
import { useNavigate, NavLink } from "react-router-dom";
import { requestsPost } from "../requestsFromServer";
//להיות בטוחה שהמספר זהות יהיה זהה בים שני האובייקטים
const Signin = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    username: "",
    password: "",
    name: "",
    id_number: "",
    phone: "",
    email: "",
  });

  const [inputs, setInputs] = useState({});
  const [visibilityMoreInfo, setvisibilityMoreInfo] = useState({
    visibility: "hidden",
  });

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setCustomer((prevUser) => ({ ...prevUser, [name]: value }));
  };

  const handleChangeI = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  async function fetchData() {}

  async function fetchInfo() {
    // try {
    //   setvisibilityMoreInfo({ visibility: "hidden" });
    //   let newInUser = {
    //     id: user.id,
    //     name: inputs.name || "name",
    //     username: user.username,
    //     email: inputs.email || "email",
    //     phone: inputs.phone || "0",
    //     website: inputs.website || "website",
    //     rank: "user",
    //     api_key: "0",
    //   };
    //   setInputs({});
    //   //var json = JSON.stringify(newInUser);
    //   console.log(newInUser);
    //   //requestsPost(`/users`, newInUser);
    // } catch (error) {
    //   console.error(error);
    // }
  }

  const MoreInfo = function () {
    setvisibilityMoreInfo({ visibility: "visible" });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      console.log("line36");
      //console.log(user);
      //await fetchInfo();
      try {
        console.log(customer);
        let response = await requestsPost(`/customers/signIn`, customer);

        // setCustomer({
        //   id: 0,
        //   username: "",
        //   password: "",
        //   name: "",
        //   id_number: "",
        //   phone: "",
        //   email: "",
        // });
        if (response.status === 200) {
          let data = await response.json();
          localStorage.setItem("currentUserID", data.customer_id);
          navigate("/HomeClients");
        } else {
          alert("username alrady exist");
        }
      } catch (error) {
        console.error(error);
      }

      //window.location.href = "/Login";
    } catch {
      //error
    }
  };

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit}>
        <h1>User Registration</h1>
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            required
            type="text"
            id="username"
            name="username"
            value={customer.username || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            required
            type="password"
            id="password"
            name="password"
            value={customer.password || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            required
            type="text"
            id="name"
            name="name"
            value={customer.name || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="id_number">ID number:</label>
          <input
            required
            type="text"
            id="id_number"
            name="id_number"
            value={customer.id_number || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone number:</label>
          <input
            required
            type="text"
            id="phone"
            name="phone"
            value={customer.phone || ""}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            required
            type="text"
            id="email"
            name="email"
            value={customer.email || ""}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
        <div>
          <Link to={`/Login`}>Login</Link>
        </div>
        {/* <h3>More Info</h3>
        <div className="info-details">
          <input
            name="name"
            className="info-item"
            type="text"
            value={inputs.name || "Name"}
            onChange={handleChangeI}
          />
          <input
            name="email"
            className="info-item"
            type="text"
            value={inputs.email || "Email"}
            onChange={handleChangeI}
          />
          <input
            name="phone"
            className="info-item"
            type="text"
            value={inputs.phone || "Phone"}
            onChange={handleChangeI}
          />
          <input
            name="website"
            className="info-item"
            type="text"
            value={inputs.website || "Website"}
            onChange={handleChangeI}
          />
        </div> */}
      </form>
    </div>
  );
};

export default Signin;

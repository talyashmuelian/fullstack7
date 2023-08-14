import { useState } from "react";
import "../css/Signin.css";
import { Link } from "react-router-dom";
import { useNavigate, NavLink } from "react-router-dom";
import { requestsPost } from "../requestsFromServer";
import Modal from "./Modal";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

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

  const MoreInfo = function () {
    setvisibilityMoreInfo({ visibility: "visible" });
  };

  const handleSubmit = async (event) => {
    try {
      event.preventDefault();
      console.log("line36");
      try {
        console.log(customer);
        let response = await requestsPost(`/customers/signIn`, customer);

        if (response.status === 200) {
          let data = await response.json();
          localStorage.setItem("currentUserID", data.customer_id);
          navigate("/HomeClients");
        } else {
          setModalMessage("username alrady exist");
          setModalVisible(true);
        }
      } catch (error) {
        console.error(error);
      }
    } catch {}
  };
  const closeModal = () => {
    setModalVisible(false);
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
      </form>
      {modalVisible && <Modal message={modalMessage} onClose={closeModal} />}
    </div>
  );
};

export default Signin;

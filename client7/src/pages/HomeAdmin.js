import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { requestsGet } from "../requestsFromServer.js";

import "../css/HomeClients.css"; // Styles for the redesigned component

const HomeAdmin = () => {
  const [user, setUser] = useState({});
  var userID = JSON.parse(localStorage.getItem("currentUserID"));

  //   useEffect(async () => {
  //     const response = await requestsGet(`/customer/${userID}/info`);
  //     let data = await response.json();
  //     setUser(data.name);
  //   }, []);

  return (
    <div className="users-container">
      <h1 className="user-name">Hello, {user.name}</h1>
      <Link to="/Login">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("currentUserID");
          }}
        >
          Logout
        </button>
      </Link>
      <nav className="user-navigation">
        <ul>
          <li>
            <Link>Appointments</Link>
            <ul className="sub-menu">
              <li>
                <Link to={`/Admin/${userID}/Appointments/CreateAppointments`}>
                  Create Appointments
                </Link>
              </li>

              <li>
                <Link
                  to={`/Admin/${userID}/Appointments/adminFutureAppointments`}
                >
                  Future Appointments
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to={`/Admin/${userID}/Payments`}>Payments</Link>
          </li>
          {/* <li>
            <Link to={`/Users/${userID}/Messages`}>Messages</Link>
          </li> */}
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default HomeAdmin;

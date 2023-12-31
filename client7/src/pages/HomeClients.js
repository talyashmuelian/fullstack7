import { Outlet, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { requestsGet } from "../requestsFromServer.js";
import { useNavigate, NavLink, Navigate } from "react-router-dom";

import "../css/HomeClients.css";

const HomeClients = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  var userID = JSON.parse(localStorage.getItem("currentUserID"));

  useEffect(() => {
    const fetchName = async () => {
      try {
        const response = await requestsGet(`/customers/${userID}/info`);
        let data = await response.json();
        setUser(data.customer);
      } catch (error) {
        console.error("Error fetching name:", error);
      }
    };

    fetchName();
  }, []);
  if (!userID) {
    return <Navigate to="/Login" />;
  }
  return (
    <div className="users-container">
      <h1 className="user-name">Hello, {user.username}</h1>
      <Link to="/Login">
        <button
          className="logout-button"
          onClick={() => {
            localStorage.removeItem("currentUserID");
            navigate("/Login");
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
                <Link to={`/Users/${userID}/Appointments/MakeAppointment`}>
                  Making an Appointment
                </Link>
              </li>
              <li>
                <Link to={`/Users/${userID}/Appointments/History`}>
                  My Appointment History
                </Link>
              </li>
              <li>
                <Link to={`/Users/${userID}/Appointments/Future`}>
                  My Future Appointments
                </Link>
              </li>
            </ul>
          </li>
          <li>
            <Link to={`/Users/${userID}/Payments`}>Payments</Link>
          </li>
          {/* <li>
            <Link to={`/Users/${userID}/Messages`}>Messages</Link>
          </li> */}
          <li>
            <Link>Replacement Requests</Link>
            <ul className="sub-menu">
              <li>
                <Link to={`/Users/${userID}/Requests/MyRequests`}>
                  Requests I Created
                </Link>
              </li>
              <li>
                <Link to={`/Users/${userID}/Requests/RequestsForMe`}>
                  Requests For Me
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default HomeClients;
